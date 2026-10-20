import {
    ArrowLeft,
    Ban,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    Phone,
    RotateCcw,
    Search,
    Star,
    Star as StarIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { useToast } from "../../components/UI/Toast";
import { useReactivateUser, useSuspendUser } from "../../hooks/mutations/allMutation";
import { parseApiError } from "../../hooks/parseapierror";
import {
    useGetPvoInspections,
    useGetPvoOverview,
    useGetSingleStaff,
} from "../../hooks/queries/allQueries";

/* ---------- Types & helpers ---------- */

type InspectionRecord = {
    id: string;
    display_id?: string;
    property_id?: string;
    property_title?: string;
    seeker_profile_id?: string;
    seeker_name?: string;
    staff_id?: string;
    pvo_name?: string;
    requested_date?: string;
    status?: string;
    feedback?: string;
    notes?: string;
    cancel_reason?: string;
    created_at?: string;
};

type ActivityRecord = {
    id: string;
    actor_id?: string;
    verb?: string;
    target_type?: string;
    target_id?: string;
    created_at?: string;
};

const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const d = new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
    const t = new Intl.DateTimeFormat("en-NG", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
    return `${d} • ${t}`;
};

const timeAgo = (value?: string) => {
    if (!value) return "";
    const then = new Date(value).getTime();
    if (Number.isNaN(then)) return "";
    const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
    const days = Math.round(hrs / 24);
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
    return formatDate(value);
};

const normalizeText = (value?: string | null) =>
    value && String(value).trim() ? String(value) : "N/A";

const humanize = (value?: string | null) =>
    value ? value.replace(/[_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

const genderLabel = (g?: string) =>
    g === "M" ? "Male" : g === "F" ? "Female" : normalizeText(g);

const statusStyles: Record<string, string> = {
    requested: "bg-blue-100 text-blue-700",
    assigned: "bg-blue-100 text-blue-700",
    scheduled: "bg-blue-100 text-blue-700",
    in_progress: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const InspectionStatus = ({ status }: { status?: string }) => (
    <span
        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status ?? ""] || "bg-slate-100 text-slate-700"
            }`}
    >
        {humanize(status)}
    </span>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex min-h-80 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white px-6 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                !
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const Field = ({
    label,
    value,
    className = "",
}: {
    label: string;
    value: string;
    className?: string;
}) => (
    <div className={`min-w-0 ${className}`}>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 break-all text-xs font-medium text-slate-800">{value}</p>
    </div>
);

const StatCard = ({
    label,
    value,
    icon,
    tint,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    tint: string;
}) => (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white p-4 shadow-sm">
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-extrabold text-slate-900">{value}</p>
        </div>
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tint}`}
        >
            {icon}
        </div>
    </div>
);

/* ---------- Page ---------- */

const SingleVerificationOfficer = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState<"overview" | "inspections">("overview");
    const [action, setAction] = useState<"suspend" | "reactivate" | null>(null);
    const [actionError, setActionError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { staffData, isLoading, isError, refetch } = useGetSingleStaff(id || "");
    const officer = (staffData?.data ?? staffData ?? {}) as Record<string, any>;
    const officerId: string = officer.id ?? id ?? "";

    const { overview, isLoading: overviewLoading } = useGetPvoOverview(officerId);
    const { inspections: inspectionsRes, isLoading: inspectionsLoading } =
        useGetPvoInspections(officerId, page);

    const suspendMutation = useSuspendUser();
    const reactivateMutation = useReactivateUser();

    const stats = (overview?.data ?? overview ?? {}) as Record<string, any>;
    const activity: ActivityRecord[] = Array.isArray(stats.recent_activity)
        ? stats.recent_activity
        : [];

    const inspPayload = (inspectionsRes?.data ?? inspectionsRes) as
        | { count?: number; next?: string | null; previous?: string | null; results?: InspectionRecord[] }
        | InspectionRecord[]
        | undefined;

    const inspections: InspectionRecord[] = useMemo(() => {
        const list = Array.isArray(inspPayload)
            ? inspPayload
            : Array.isArray(inspPayload?.results)
                ? inspPayload.results
                : [];
        // Safety net in case the API ignores the staff filter
        return list.filter((i) => !i.staff_id || i.staff_id === officerId);
    }, [inspPayload, officerId]);

    const hasNextPage = Boolean(
        inspPayload && !Array.isArray(inspPayload) && inspPayload.next
    );
    const hasPreviousPage = Boolean(
        inspPayload && !Array.isArray(inspPayload) && inspPayload.previous
    );

    const filteredInspections = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return inspections;
        return inspections.filter((i) =>
            `${i.display_id ?? ""} ${i.property_title ?? ""} ${i.seeker_name ?? ""} ${i.status ?? ""}`
                .toLowerCase()
                .includes(q)
        );
    }, [inspections, search]);

    const upcoming = useMemo(() => {
        const now = Date.now();
        return inspections
            .filter(
                (i) =>
                    i.requested_date &&
                    new Date(i.requested_date).getTime() >= now &&
                    i.status !== "completed" &&
                    i.status !== "cancelled"
            )
            .sort(
                (a, b) =>
                    new Date(a.requested_date as string).getTime() -
                    new Date(b.requested_date as string).getTime()
            )
            .slice(0, 5);
    }, [inspections]);

    const today = new Date();
    const calYear = today.getFullYear();
    const calMonth = today.getMonth();
    const monthLabel = new Intl.DateTimeFormat("en-NG", {
        month: "long",
        year: "numeric",
    }).format(today);
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstWeekday = new Date(calYear, calMonth, 1).getDay();
    const inspectionDays = useMemo(() => {
        const set = new Set<number>();
        inspections.forEach((i) => {
            if (!i.requested_date) return;
            const d = new Date(i.requested_date);
            if (d.getFullYear() === calYear && d.getMonth() === calMonth) set.add(d.getDate());
        });
        return set;
    }, [inspections, calYear, calMonth]);

    /* ----- actions ----- */

    const openAction = (type: "suspend" | "reactivate") => {
        setActionError("");
        setAction(type);
    };

    const closeAction = () => {
        if (suspendMutation.isPending || reactivateMutation.isPending) return;
        setAction(null);
        setActionError("");
    };

    const fullName =
        `${officer.first_name ?? ""} ${officer.last_name ?? ""}`.trim() || "Unknown Officer";

    const handleAction = async (reason: string) => {
        if (!action || !reason) return;
        const targetId = officer.user_id || officer.id;
        if (!targetId) return;

        const mutation = action === "suspend" ? suspendMutation : reactivateMutation;
        try {
            await mutation.mutateAsync({ id: targetId, reason });
            toast.success(action === "suspend" ? "Account suspended" : "Account reactivated", {
                message: fullName,
            });
            setAction(null);
            setActionError("");
            refetch();
        } catch (err) {
            const parsed = parseApiError(err, `Failed to ${action} account.`);
            setActionError(parsed.message);
            toast.error(`Could not ${action} account`, { message: parsed.message });
        }
    };

    /* ----- render guards ----- */

    if (!id) {
        return (
            <EmptyState
                title="Officer not found"
                description="No officer identifier was supplied in the page route."
            />
        );
    }

    if (isLoading) return <LoadingOverlay visible />;

    if (isError) {
        return (
            <EmptyState
                title="Could not load officer"
                description="The officer details could not be fetched from the server."
            />
        );
    }

    if (!officer || Object.keys(officer).length === 0) {
        return (
            <EmptyState
                title="No officer data available"
                description="This officer does not have any profile information yet."
            />
        );
    }

    const isActive =
        officer.account_status !== "suspended" && officer.is_active !== false;
    const rating = Number(stats.rating_avg ?? 0);
    const initials =
        `${(officer.first_name?.[0] ?? "").toUpperCase()}${(officer.last_name?.[0] ?? "").toUpperCase()}` ||
        "PV";

    return (
        <div className="min-h-screen bg-gray-50">
            <LoadingOverlay visible={overviewLoading || inspectionsLoading} />

            {/* Top bar */}
            <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate("/admin/verification-officers")}
                            className="shrink-0 rounded-lg p-1.5 hover:bg-slate-100"
                            aria-label="Back to verification officers"
                        >
                            <ArrowLeft size={18} className="text-slate-600" />
                        </button>

                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                        {fullName}
                                    </h1>
                                    <span
                                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-amber-500"
                                                }`}
                                        />
                                        {isActive ? "Active" : "Suspended"}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    P-Knock Verification Officer · {humanize(officer.staff_role).toUpperCase()}
                                    {officer.availability === false ? " · Unavailable" : ""}
                                </p>
                                <div className="mt-1 flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            className={
                                                i <= Math.round(rating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-slate-300"
                                            }
                                        />
                                    ))}
                                    <span className="ml-1 text-xs text-slate-600">
                                        {rating.toFixed(1)} rating
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:shrink-0">
                        <button className="flex-1 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 md:flex-none">
                            Reset Password
                        </button>
                        {isActive ? (
                            <button
                                onClick={() => openAction("suspend")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 md:flex-none"
                            >
                                <Ban size={14} /> Suspend
                            </button>
                        ) : (
                            <button
                                onClick={() => openAction("reactivate")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 md:flex-none"
                            >
                                <RotateCcw size={14} /> Reactivate
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 break-all">
                        <Mail size={14} className="shrink-0" />
                        {normalizeText(officer.email)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Phone size={14} className="shrink-0" />
                        {normalizeText(officer.phone)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="shrink-0" />
                        {normalizeText(officer.coverage_area)}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <StatCard
                        label="Assigned"
                        value={stats.assigned_total ?? 0}
                        tint="bg-green-50"
                        icon={<CheckCircle2 size={18} className="text-green-600" />}
                    />
                    <StatCard
                        label="Completed"
                        value={stats.completed ?? 0}
                        tint="bg-slate-50"
                        icon={<CheckCircle2 size={18} className="text-slate-400" />}
                    />
                    <StatCard
                        label="Pending"
                        value={stats.pending ?? 0}
                        tint="bg-amber-50"
                        icon={<Clock size={18} className="text-amber-500" />}
                    />
                    <StatCard
                        label="Rating"
                        value={rating.toFixed(1)}
                        tint="bg-purple-50"
                        icon={<StarIcon size={18} className="text-purple-500" />}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6">
                <div className="flex w-full gap-1 rounded-lg bg-slate-100 p-1 sm:w-fit">
                    {(["overview", "inspections"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 rounded-md px-4 py-1.5 text-xs font-medium capitalize transition-colors sm:flex-none ${activeTab === tab
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-5 sm:px-6">
                {activeTab === "overview" ? (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                        {/* Personal info */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                                <Field label="First Name" value={normalizeText(officer.first_name)} />
                                <Field label="Last Name" value={normalizeText(officer.last_name)} />
                                <Field label="Email Address" value={normalizeText(officer.email)} />
                                <Field label="Phone Number" value={normalizeText(officer.phone)} />
                                <Field label="Gender" value={genderLabel(officer.gender)} />
                                <Field label="Date of Birth" value={formatDate(officer.date_of_birth)} />
                                <Field label="State of Origin" value={normalizeText(officer.state_of_origin)} />
                                <Field label="Nationality" value={normalizeText(officer.nationality)} />
                                <Field label="Coverage Area" value={normalizeText(officer.coverage_area)} />
                                <Field label="Staff Role" value={humanize(officer.staff_role).toUpperCase()} />
                                <Field label="Staff Status" value={humanize(officer.staff_status)} />
                                <Field
                                    label="Availability"
                                    value={officer.availability ? "Available" : "Unavailable"}
                                />
                            </div>
                        </div>

                        {/* Activity log */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                            <h3 className="mb-4 text-sm font-semibold text-slate-900">Activity Log</h3>
                            {activity.length === 0 ? (
                                <p className="py-6 text-center text-xs text-slate-500">
                                    No recent activity yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {activity.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-slate-900">
                                                    {humanize(item.verb)}
                                                </p>
                                                <p className="truncate text-xs text-slate-500">
                                                    {humanize(item.target_type)}
                                                </p>
                                            </div>
                                            <p className="whitespace-nowrap text-[10px] text-slate-400">
                                                {timeAgo(item.created_at)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                        {/* Inspections list */}
                        <div className="min-w-0 rounded-xl bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
                            <div className="relative w-full sm:max-w-xs">
                                <Search
                                    size={16}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                                />
                            </div>

                            {!filteredInspections.length ? (
                                <EmptyState
                                    title="No inspections found"
                                    description={
                                        search
                                            ? "No inspections on this page match your search."
                                            : "This officer has no inspections yet."
                                    }
                                />
                            ) : (
                                <>
                                    {/* Desktop table */}
                                    <div className="mt-5 hidden overflow-x-auto md:block">
                                        <table className="w-full min-w-175 border-collapse">
                                            <thead>
                                                <tr className="whitespace-nowrap border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                                    <th className="pb-3 pr-4 font-medium">Inspection ID</th>
                                                    <th className="pb-3 pr-4 font-medium">Property</th>
                                                    <th className="pb-3 pr-4 font-medium">Seeker</th>
                                                    <th className="pb-3 pr-4 font-medium">Date & Time</th>
                                                    <th className="pb-3 font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredInspections.map((insp) => (
                                                    <tr
                                                        key={insp.id}
                                                        className="text-xs transition-colors hover:bg-slate-50"
                                                    >
                                                        <td className="whitespace-nowrap py-4 pr-4 text-slate-600">
                                                            {insp.display_id || "—"}
                                                        </td>
                                                        <td className="max-w-56 truncate py-4 pr-4 text-sm font-semibold text-slate-900">
                                                            {insp.property_title || "—"}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pr-4 text-slate-600">
                                                            {insp.seeker_name || "—"}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                                                            {formatDateTime(insp.requested_date)}
                                                        </td>
                                                        <td className="py-4">
                                                            <InspectionStatus status={insp.status} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile cards */}
                                    <div className="mt-4 grid grid-cols-1 gap-3 md:hidden">
                                        {filteredInspections.map((insp) => (
                                            <div
                                                key={insp.id}
                                                className="rounded-xl border border-slate-200 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="text-xs text-slate-500">
                                                        {insp.display_id || "—"}
                                                    </p>
                                                    <InspectionStatus status={insp.status} />
                                                </div>
                                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                                    {insp.property_title || "—"}
                                                </p>
                                                <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
                                                    <span className="text-slate-600">
                                                        {insp.seeker_name || "—"}
                                                    </span>
                                                    <span className="text-slate-500">
                                                        {formatDateTime(insp.requested_date)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Pagination */}
                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                <p className="text-xs text-slate-500">Page {page}</p>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={!hasPreviousPage || page <= 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="h-8 w-8 rounded-md text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                                    >
                                        ‹
                                    </button>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-medium text-white">
                                        {page}
                                    </span>
                                    <button
                                        disabled={!hasNextPage}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="h-8 w-8 rounded-md text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Calendar + upcoming */}
                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                                    {monthLabel}
                                </h3>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="py-1 font-medium text-slate-400">
                                            {d}
                                        </div>
                                    ))}
                                    {Array.from({ length: firstWeekday }).map((_, i) => (
                                        <div key={`pad-${i}`} />
                                    ))}
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                        const isToday = day === today.getDate();
                                        const hasDot = inspectionDays.has(day);
                                        return (
                                            <div
                                                key={day}
                                                className={`relative rounded-full py-1.5 ${isToday
                                                    ? "bg-slate-900 text-white"
                                                    : "text-slate-700 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {day}
                                                {hasDot && !isToday && (
                                                    <div className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                                <h3 className="mb-3 text-sm font-semibold text-slate-900">Upcoming</h3>
                                {upcoming.length === 0 ? (
                                    <p className="py-4 text-center text-xs text-slate-500">
                                        No upcoming inspections.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {upcoming.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3"
                                            >
                                                <div className="w-1 shrink-0 rounded-full bg-blue-500" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-slate-900">
                                                        {item.property_title || "Inspection"}
                                                    </p>
                                                    <p className="mt-0.5 text-[10px] text-slate-500">
                                                        {formatDateTime(item.requested_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={action === "suspend"}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="danger"
                icon={<Ban size={26} />}
                title="Suspend Account"
                description={
                    <>
                        Suspending{" "}
                        <span className="font-medium text-slate-800">{fullName}</span>
                        ’s account will block them from signing in and receiving new verification
                        assignments.
                    </>
                }
                reasonLabel="Reason for suspension"
                reasonPlaceholder="e.g. Multiple complaints received, pending investigation…"
                confirmLabel="Suspend Account"
                loadingLabel="Suspending…"
                loading={suspendMutation.isPending}
                error={actionError}
            />

            <ConfirmModal
                open={action === "reactivate"}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="success"
                icon={<RotateCcw size={26} />}
                title="Reactivate Account"
                description={
                    <>
                        Reactivating{" "}
                        <span className="font-medium text-slate-800">{fullName}</span>
                        ’s account will restore their access and let them receive new verification
                        assignments.
                    </>
                }
                reasonLabel="Reason for reactivating"
                reasonPlaceholder="e.g. Investigation completed, no further issues found…"
                confirmLabel="Reactivate Account"
                loadingLabel="Reactivating…"
                loading={reactivateMutation.isPending}
                error={actionError}
            />
        </div>
    );
};

export default SingleVerificationOfficer;