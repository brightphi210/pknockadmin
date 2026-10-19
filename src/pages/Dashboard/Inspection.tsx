import {
    Bath,
    Bed,
    Calendar,
    ExternalLink,
    FileText,
    MapPin,
    Maximize,
    Search,
    User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import ActionsMenu from "../../components/UI/ActionMenu";
import { useGetInspections } from "../../hooks/queries/allQueries";

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

// ---------------- Dummy Data (Tenant Inspection tab) ----------------
const tenantInspections = [
    {
        id: 1,
        image:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
        type: "Apartment",
        title: "Victoria Island Duplex",
        location: "Lekki Phase 1, Lagos",
        price: "₦450k",
        period: "/year",
        beds: 3,
        baths: 3,
        size: "185 m²",
        tenant: "Emeka Nwosu",
        tenantRole: "Prospective Tenant",
        officer: "Chidi Okafor",
        officerRole: "Assigned P-Knock Officer",
        date: "July 30, 2025",
        time: "10:00 AM",
        notes: "Visitor is interested in a 2-year tenancy.",
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        type: "Apartment",
        title: "Marina View Apartment",
        location: "Lekki Phase 1, Lagos",
        price: "₦450k",
        period: "/year",
        beds: 3,
        baths: 3,
        size: "185 m²",
        tenant: "Emeka Nwosu",
        tenantRole: "Prospective Tenant",
        officer: "Chidi Okafor",
        officerRole: "Assigned P-Knock Officer",
        date: "August 2, 2025",
        time: "2:00 PM",
        notes: "Visitor is interested in a 2-year tenancy.",
    },
    {
        id: 3,
        image:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        type: "Apartment",
        title: "Sunrise Court Apartment",
        location: "Lekki Phase 1, Lagos",
        price: "₦450k",
        period: "/year",
        beds: 3,
        baths: 3,
        size: "185 m²",
        tenant: "Emeka Nwosu",
        tenantRole: "Prospective Tenant",
        officer: "Chidi Okafor",
        officerRole: "Assigned P-Knock Officer",
        date: "August 11, 2025",
        time: "5:00 PM",
        notes: "Visitor is interested in a 2-year tenancy.",
    },
];

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

// ---------------- Status Badge ----------------
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

const EmptyState = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => (
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

const Row = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-start justify-between gap-4">
        <dt className="flex-shrink-0 text-slate-500">{label}</dt>
        <dd className="min-w-0 break-words text-right text-slate-700">{children}</dd>
    </div>
);

// ---------------- Main Component ----------------
const Inspection = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"property" | "tenant">("property");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const { inspections: response, isLoading, isError, refetch } = useGetInspections(page);

    const inspections = useMemo(() => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload?.results)
            ? payload.results
            : Array.isArray(payload)
                ? payload
                : [];
        return list as InspectionRecord[];
    }, [response]);

    const payload = (response?.data ?? response) as
        | { count?: number; previous?: string | null; next?: string | null; results?: InspectionRecord[] }
        | InspectionRecord[]
        | undefined;
    const totalCount = Number(
        payload && typeof payload === "object" && "count" in payload
            ? (payload.count ?? inspections.length)
            : (inspections.length ?? 0)
    );
    const hasPreviousPage = Boolean(
        payload && typeof payload === "object" && "previous" in payload && payload.previous
    );
    const hasNextPage = Boolean(
        payload && typeof payload === "object" && "next" in payload && payload.next
    );
    const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(inspections.length || 1, 1)));

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return inspections;
        return inspections.filter((item) =>
            `${item.display_id ?? ""} ${item.property_title ?? ""} ${item.seeker_name ?? ""} ${item.pvo_name ?? ""} ${item.status ?? ""}`
                .toLowerCase()
                .includes(term)
        );
    }, [inspections, search]);

    const viewInspection = (id?: string) => {
        if (!id) return;
        navigate(`/admin/inspections/${id}`);
    };

    // TODO: open your assign-PVO modal here once the assign endpoint is ready
    const assignPvo = (_item: InspectionRecord) => { };

    const getMenuItems = (item: InspectionRecord): any[] => [
        { label: "View", onClick: () => viewInspection(item.id) },
        {
            label: item.staff_id ? "Re-assign PVO" : "Assign PVO",
            onClick: () => assignPvo(item),
            tone: "primary",
        },
    ];

    return (
        <>
            <LoadingOverlay visible={activeTab === "property" && isLoading} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Inspections</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        {totalCount} inspection{totalCount === 1 ? "" : "s"} total
                    </p>
                </div>

                {/* Tabs */}
                <div className="inline-flex w-full items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-auto">
                    {(
                        [
                            ["property", "Property Verification"],
                            ["tenant", "Tenant Inspection"],
                        ] as const
                    ).map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 rounded-xl px-5 py-2 text-xs font-semibold transition-colors sm:flex-none ${activeTab === key
                                ? "bg-slate-900 text-white"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* ===================== PROPERTY VERIFICATION TAB ===================== */}
                {activeTab === "property" && (
                    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                        {/* Search */}
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

                        {isError ? (
                            <div className="pb-2">
                                <EmptyState
                                    title="Could not load inspections"
                                    description="Please refresh the page or try again in a few moments."
                                />
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => refetch()}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        ) : !filtered.length ? (
                            <EmptyState
                                title="No inspections found"
                                description={
                                    search
                                        ? "No inspections on this page match your search."
                                        : "There are no inspections to display yet."
                                }
                            />
                        ) : (
                            <>
                                {/* Desktop table */}
                                <div className="mt-5 hidden overflow-x-auto lg:block">
                                    <table className="w-full min-w-225 border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                                <th className="pb-3 pr-4 font-medium">Inspection ID</th>
                                                <th className="pb-3 pr-4 font-medium">Property</th>
                                                <th className="pb-3 pr-4 font-medium">Seeker</th>
                                                <th className="pb-3 pr-4 font-medium">Date & Time</th>
                                                <th className="pb-3 pr-4 font-medium">PVO</th>
                                                <th className="pb-3 pr-4 font-medium">Status</th>
                                                <th className="pb-3 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filtered.map((item, index) => {
                                                const key = item.id ?? item.display_id ?? String(index);
                                                const menuId = `table-${key}`;
                                                return (
                                                    <tr key={key} className="text-xs transition-colors hover:bg-slate-50">
                                                        <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">
                                                            {item.display_id || "—"}
                                                        </td>
                                                        <td className="max-w-[260px] py-4 pr-4">
                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {item.property_title || "—"}
                                                            </p>
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pr-4 text-slate-700">
                                                            {item.seeker_name || "—"}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                                                            {formatDateTime(item.requested_date)}
                                                        </td>
                                                        <td className="whitespace-nowrap py-4 pr-4 text-slate-700">
                                                            {item.pvo_name || (
                                                                <span className="text-slate-400">Unassigned</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 pr-4">
                                                            <StatusBadge status={item.status} />
                                                        </td>
                                                        <td className="py-4">
                                                            <ActionsMenu
                                                                open={openMenuId === menuId}
                                                                onToggle={() =>
                                                                    setOpenMenuId((prev) => (prev === menuId ? null : menuId))
                                                                }
                                                                onClose={() => setOpenMenuId(null)}
                                                                items={getMenuItems(item)}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile / tablet cards */}
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
                                    {filtered.map((item, index) => {
                                        const key = item.id ?? item.display_id ?? String(index);
                                        const menuId = `card-${key}`;
                                        return (
                                            <div key={key} className="rounded-xl border border-slate-200 p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-slate-500">{item.display_id || "—"}</p>
                                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                                            {item.property_title || "—"}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-shrink-0 items-center gap-1">
                                                        <StatusBadge status={item.status} />
                                                        <ActionsMenu
                                                            open={openMenuId === menuId}
                                                            onToggle={() =>
                                                                setOpenMenuId((prev) => (prev === menuId ? null : menuId))
                                                            }
                                                            onClose={() => setOpenMenuId(null)}
                                                            items={getMenuItems(item)}
                                                        />
                                                    </div>
                                                </div>

                                                <dl className="mt-3 space-y-1.5 text-xs">
                                                    <Row label="Seeker">{item.seeker_name || "—"}</Row>
                                                    <Row label="Date & time">{formatDateTime(item.requested_date)}</Row>
                                                    <Row label="PVO">
                                                        {item.pvo_name || (
                                                            <span className="text-slate-400">Unassigned</span>
                                                        )}
                                                    </Row>
                                                </dl>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                            <p className="text-xs text-slate-500">
                                Page {page} of {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={!hasPreviousPage || page === 1}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPage((prev) => prev + 1)}
                                    disabled={!hasNextPage}
                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===================== TENANT INSPECTION TAB ===================== */}
                {activeTab === "tenant" && (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                        {/* Left column – Inspection cards */}
                        <div className="min-w-0 space-y-4 xl:col-span-2">
                            {/* Search */}
                            <div className="rounded-xl bg-white p-4 shadow-sm">
                                <div className="relative w-full sm:max-w-xs">
                                    <Search
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Cards */}
                            {tenantInspections.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-44 w-full flex-shrink-0 rounded-lg object-cover sm:h-28 sm:w-36"
                                        />

                                        {/* Main info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                                                <div className="min-w-0">
                                                    <span className="text-xs text-slate-500">{item.type}</span>
                                                    <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                                        <MapPin size={12} className="flex-shrink-0" />
                                                        {item.location}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between gap-3 sm:block sm:flex-shrink-0 sm:text-right">
                                                    <p className="text-base font-bold text-slate-900">
                                                        {item.price}
                                                        <span className="text-xs font-normal text-slate-500">
                                                            {item.period}
                                                        </span>
                                                    </p>
                                                    <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline sm:mt-1">
                                                        View Property
                                                        <ExternalLink size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Specs */}
                                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                                                <span className="flex items-center gap-1.5">
                                                    <Bed size={14} />
                                                    {item.beds} bedrooms
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Bath size={14} />
                                                    {item.baths} bathrooms
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Maximize size={14} />
                                                    {item.size}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom meta */}
                                    <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <User size={14} className="text-slate-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-900">{item.tenant}</p>
                                                <p className="text-xs text-slate-500">{item.tenantRole}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <Calendar size={14} className="text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-900">{item.date}</p>
                                                <p className="text-xs text-slate-500">{item.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <User size={14} className="text-slate-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-900">{item.officer}</p>
                                                <p className="text-xs text-slate-500">{item.officerRole}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <FileText size={14} className="text-slate-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-900">Notes</p>
                                                <p className="text-xs text-slate-500">{item.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right column – Calendar + Upcoming */}
                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            {/* Calendar */}
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                                <h3 className="mb-4 text-sm font-bold text-slate-900">July 2025</h3>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="py-1 font-medium text-slate-400">
                                            {d}
                                        </div>
                                    ))}
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                        const isSelected = day === 28;
                                        const hasDot = [2, 11, 30].includes(day);
                                        return (
                                            <div
                                                key={day}
                                                className={`relative cursor-pointer rounded-full py-1.5 ${isSelected
                                                    ? "bg-slate-900 text-white"
                                                    : "text-slate-700 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {day}
                                                {hasDot && !isSelected && (
                                                    <div className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Upcoming */}
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                                <h3 className="mb-3 text-sm font-bold text-slate-900">Upcoming</h3>
                                <div className="space-y-3">
                                    {[
                                        {
                                            title: "Victoria Island Duplex",
                                            time: "Jul 30, 2025 • 10:00 AM",
                                        },
                                        {
                                            title: "Marina View Apartment",
                                            time: "Aug 2, 2025 • 2:00 PM",
                                        },
                                        {
                                            title: "Sunrise Court Apartment",
                                            time: "Aug 11, 2025 • 5:00 PM",
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50/60 p-3"
                                        >
                                            <div className="w-1 flex-shrink-0 rounded-full bg-blue-500" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Inspection;