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
        className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[(status ?? "").toLowerCase()] || "bg-gray-100 text-gray-600"
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
        <dt className="text-gray-500 flex-shrink-0">{label}</dt>
        <dd className="text-gray-700 text-right min-w-0 break-words">{children}</dd>
    </div>
);

// ---------------- Main Component ----------------
const Inspection = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"property" | "tenant">("property");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

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

    return (
        <>
            <LoadingOverlay visible={activeTab === "property" && isLoading} />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                {/* Header */}
                <div className="mb-5 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Inspections
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalCount} inspection{totalCount === 1 ? "" : "s"} total
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit mb-5 sm:mb-6">
                    <button
                        onClick={() => setActiveTab("property")}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "property"
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Property Verification
                    </button>
                    <button
                        onClick={() => setActiveTab("tenant")}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "tenant"
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Tenant Inspection
                    </button>
                </div>

                {/* ===================== PROPERTY VERIFICATION TAB ===================== */}
                {activeTab === "property" && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Search */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative w-full md:max-w-md">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search by ID, property, seeker or PVO"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {isError ? (
                            <div className="pb-6">
                                <EmptyState
                                    title="Could not load inspections"
                                    description="Please refresh the page or try again in a few moments."
                                />
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => refetch()}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
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
                                <div className="hidden lg:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 text-left text-gray-500 font-medium whitespace-nowrap">
                                                <th className="px-6 py-3">Inspection ID</th>
                                                <th className="px-6 py-3">Property</th>
                                                <th className="px-6 py-3">Seeker</th>
                                                <th className="px-6 py-3">Date & Time</th>
                                                <th className="px-6 py-3">PVO</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filtered.map((item, index) => {
                                                const key = item.id ?? item.display_id ?? String(index);
                                                const assigned = Boolean(item.staff_id);
                                                return (
                                                    <tr key={key} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                            {item.display_id || "—"}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="font-medium text-gray-900 truncate max-w-[260px]">
                                                                {item.property_title || "—"}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                                                            {item.seeker_name || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                            {formatDateTime(item.requested_date)}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                                                            {item.pvo_name || (
                                                                <span className="text-gray-400">Unassigned</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <StatusBadge status={item.status} />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3 whitespace-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => assignPvo(item)}
                                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                                >
                                                                    {assigned ? "Re-assign" : "Assign PVO"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => viewInspection(item.id)}
                                                                    className="text-gray-600 hover:text-gray-800 font-medium"
                                                                >
                                                                    View
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile / tablet cards */}
                                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
                                    {filtered.map((item, index) => {
                                        const key = item.id ?? item.display_id ?? String(index);
                                        const assigned = Boolean(item.staff_id);
                                        return (
                                            <div
                                                key={key}
                                                className="rounded-xl border border-gray-200 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        {item.display_id || "—"}
                                                    </p>
                                                    <StatusBadge status={item.status} />
                                                </div>
                                                <p className="mt-2 font-medium text-gray-900">
                                                    {item.property_title || "—"}
                                                </p>

                                                <dl className="mt-3 space-y-1.5 text-sm">
                                                    <Row label="Seeker">{item.seeker_name || "—"}</Row>
                                                    <Row label="Date & time">
                                                        {formatDateTime(item.requested_date)}
                                                    </Row>
                                                    <Row label="PVO">
                                                        {item.pvo_name || (
                                                            <span className="text-gray-400">Unassigned</span>
                                                        )}
                                                    </Row>
                                                </dl>

                                                <div className="mt-4 flex items-center gap-5 border-t border-gray-100 pt-3 text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => assignPvo(item)}
                                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        {assigned ? "Re-assign" : "Assign PVO"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => viewInspection(item.id)}
                                                        className="text-gray-600 hover:text-gray-800 font-medium"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* Pagination */}
                        <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
                            <p className="text-sm text-gray-500">
                                Page {page} of {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                    disabled={!hasPreviousPage || page === 1}
                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPage((prev) => prev + 1)}
                                    disabled={!hasNextPage}
                                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300"
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
                        <div className="xl:col-span-2 min-w-0 space-y-4">
                            {/* Search */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="relative w-full md:max-w-md">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Cards */}
                            {tenantInspections.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                                        {/* Image */}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-44 sm:w-36 sm:h-28 object-cover rounded-lg flex-shrink-0"
                                        />

                                        {/* Main info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                                                <div className="min-w-0">
                                                    <span className="text-xs text-gray-500">{item.type}</span>
                                                    <h3 className="text-base font-semibold text-gray-900 mt-0.5">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin size={13} className="flex-shrink-0" />
                                                        {item.location}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between gap-3 sm:block sm:text-right sm:flex-shrink-0">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {item.price}
                                                        <span className="text-sm font-normal text-gray-500">
                                                            {item.period}
                                                        </span>
                                                    </p>
                                                    <button className="text-blue-600 text-sm font-medium flex items-center gap-1 sm:mt-1 hover:underline">
                                                        View Property
                                                        <ExternalLink size={13} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Specs */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-600">
                                                <span className="flex items-center gap-1.5">
                                                    <Bed size={15} />
                                                    {item.beds} bedrooms
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Bath size={15} />
                                                    {item.baths} bathrooms
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Maximize size={15} />
                                                    {item.size}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom meta */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-5 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <User size={15} className="text-gray-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.tenant}
                                                </p>
                                                <p className="text-xs text-gray-500">{item.tenantRole}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <Calendar size={15} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.date}
                                                </p>
                                                <p className="text-xs text-gray-500">{item.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <User size={15} className="text-gray-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.officer}
                                                </p>
                                                <p className="text-xs text-gray-500">{item.officerRole}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <FileText size={15} className="text-gray-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900">Notes</p>
                                                <p className="text-xs text-gray-500">{item.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right column – Calendar + Upcoming */}
                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            {/* Calendar */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">July 2025</h3>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="py-1 text-gray-400 font-medium">
                                            {d}
                                        </div>
                                    ))}
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                        const isSelected = day === 28;
                                        const hasDot = [2, 11, 30].includes(day);
                                        return (
                                            <div
                                                key={day}
                                                className={`relative py-1.5 rounded-full cursor-pointer ${isSelected
                                                    ? "bg-gray-900 text-white"
                                                    : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {day}
                                                {hasDot && !isSelected && (
                                                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Upcoming */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <h3 className="font-semibold text-gray-900 mb-3">Upcoming</h3>
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
                                            className="flex gap-3 p-3 rounded-lg bg-blue-50/60 border border-blue-100"
                                        >
                                            <div className="w-1 rounded-full bg-blue-500 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
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