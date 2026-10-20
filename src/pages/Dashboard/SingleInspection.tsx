import {
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    FileText,
    MessageSquare,
    User,
    UserCheck,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetInspection } from "../../hooks/queries/allQueries";

type InspectionRecord = {
    id?: string;
    display_id?: string;
    property_id?: string;
    property_title?: string;
    seeker_profile_id?: string;
    seeker_name?: string;
    staff_id?: string | null;
    pvo_name?: string | null;
    requested_date?: string;
    status?: string;
    feedback?: string;
    notes?: string;
    cancel_reason?: string;
    created_at?: string;
    updated_at?: string;
};

// ---------------- Helpers ----------------
const formatDateTime = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const day = new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
    const time = new Intl.DateTimeFormat("en-NG", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
    return `${day} • ${time}`;
};

const normalizeStatus = (status?: string) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const statusStyles: Record<string, string> = {
    requested: "bg-gray-100 text-gray-600",
    pending: "bg-amber-100 text-amber-700",
    assigned: "bg-blue-100 text-blue-700",
    scheduled: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }: { status?: string }) => (
    <span
        className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[(status ?? "").toLowerCase()] || "bg-gray-100 text-gray-600"
            }`}
    >
        {normalizeStatus(status)}
    </span>
);

const Section = ({
    title,
    icon,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) => (
    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
            {icon}
            {title}
        </h2>
        {children}
    </div>
);

const Row = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-start justify-between gap-4 text-xs">
        <dt className="flex-shrink-0 text-slate-500">{label}</dt>
        <dd className="min-w-0 break-words text-right font-medium text-slate-800">{children}</dd>
    </div>
);

const PersonRow = ({
    name,
    role,
    placeholder,
}: {
    name?: string | null;
    role: string;
    placeholder?: string;
}) => (
    <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
            <User size={16} className="text-slate-500" />
        </div>
        <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${name ? "text-slate-900" : "text-slate-400"}`}>
                {name || placeholder || "—"}
            </p>
            <p className="text-xs text-slate-500">{role}</p>
        </div>
    </div>
);

// ---------------- Main Component ----------------
const SingleInspection = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { inspection: response, isLoading, isError, refetch } = useGetInspection(id);
    const inspection = (response?.data ?? response) as InspectionRecord | undefined;

    const goBack = () => navigate("/admin/inspections");

    // TODO: open your assign-PVO modal here once the assign endpoint is ready
    const assignPvo = () => { };

    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    if (isError || !inspection) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <button
                    type="button"
                    onClick={goBack}
                    className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={14} />
                    Back to inspections
                </button>
                <div className="mx-auto max-w-md rounded-xl bg-white px-6 py-10 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                        !
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Could not load this inspection
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        It may have been removed, or something went wrong. Try again in a few moments.
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const isCancelled =
        (inspection.status ?? "").toLowerCase() === "cancelled" || Boolean(inspection.cancel_reason);

    return (
        <div className="space-y-4 p-4 sm:p-6 lg:p-8">
            {/* Back + header */}
            <div>
                <button
                    type="button"
                    onClick={goBack}
                    className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={14} />
                    Back to inspections
                </button>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                            Inspection {inspection.display_id || ""}
                        </h1>
                        <p className="mt-1 truncate text-xs text-slate-500">
                            {inspection.property_title || "Untitled property"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={inspection.status} />
                        <button
                            type="button"
                            onClick={assignPvo}
                            className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800"
                        >
                            {inspection.staff_id ? "Re-assign PVO" : "Assign PVO"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                {/* Left column */}
                <div className="min-w-0 space-y-4 xl:col-span-2">
                    <Section title="Inspection details" icon={<Building2 size={16} className="text-slate-500" />}>
                        <dl className="space-y-3">
                            <Row label="Inspection ID">{inspection.display_id || "—"}</Row>
                            <Row label="Property">{inspection.property_title || "—"}</Row>
                            <Row label="Requested date & time">
                                {formatDateTime(inspection.requested_date)}
                            </Row>
                            <Row label="Status">
                                <StatusBadge status={inspection.status} />
                            </Row>
                        </dl>
                    </Section>

                    <Section title="Notes" icon={<FileText size={16} className="text-slate-500" />}>
                        <p
                            className={`whitespace-pre-wrap break-words text-sm ${inspection.notes ? "text-slate-700" : "text-slate-400"
                                }`}
                        >
                            {inspection.notes || "No notes were added to this inspection."}
                        </p>
                    </Section>

                    <Section title="PVO feedback" icon={<MessageSquare size={16} className="text-slate-500" />}>
                        <p
                            className={`whitespace-pre-wrap break-words text-sm ${inspection.feedback ? "text-slate-700" : "text-slate-400"
                                }`}
                        >
                            {inspection.feedback || "No feedback has been submitted yet."}
                        </p>
                    </Section>

                    {isCancelled && (
                        <div className="rounded-xl border border-red-100 bg-red-50 p-4 sm:p-5">
                            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-700">
                                <XCircle size={16} />
                                Cancellation reason
                            </h2>
                            <p className="whitespace-pre-wrap break-words text-sm text-red-700">
                                {inspection.cancel_reason || "No reason was given."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                    <Section title="Seeker" icon={<User size={16} className="text-slate-500" />}>
                        <PersonRow name={inspection.seeker_name} role="Property seeker" />
                    </Section>

                    <Section title="Assigned PVO" icon={<UserCheck size={16} className="text-slate-500" />}>
                        <PersonRow
                            name={inspection.pvo_name}
                            role="Property verification officer"
                            placeholder="Unassigned"
                        />
                    </Section>

                    <Section title="Activity" icon={<Clock size={16} className="text-slate-500" />}>
                        <dl className="space-y-3">
                            <Row label="Requested for">
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar size={12} className="text-slate-400" />
                                    {formatDateTime(inspection.requested_date)}
                                </span>
                            </Row>
                            <Row label="Created">{formatDateTime(inspection.created_at)}</Row>
                            <Row label="Last updated">{formatDateTime(inspection.updated_at)}</Row>
                        </dl>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default SingleInspection;