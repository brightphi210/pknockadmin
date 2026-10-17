import { ChevronDown, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetProperties, type PropertyRecord } from "../../hooks/queries/allQueries";

/* ---------- helpers ---------- */

const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const formatPrice = (value?: string | number) => {
    if (value === undefined || value === null || value === "") return "—";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(num)) return String(value);
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(num);
};

const normalizePropertyType = (type?: string) => {
    if (!type) return "—";
    return type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

/** Map API status → display label used in the UI */
const STATUS_LABEL: Record<string, string> = {
    pending_verification: "Awaiting Final Approval",
    pending_pvo_visit: "PVO Assigned",
    pvo_assigned: "PVO Assigned",
    published: "Published",
    approved: "Published",
    rejected: "Rejected",
    suspended: "Rejected",
    submitted: "Submitted",
    draft: "Submitted",
    archived: "Rejected",
};

const normalizeStatus = (status?: string): string => {
    if (!status) return "Submitted";
    const key = status.toLowerCase().replace(/\s+/g, "_");
    return STATUS_LABEL[key] ?? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const statusStyles: Record<string, string> = {
    "Awaiting Final Approval": "bg-amber-50 text-amber-600 border border-amber-100",
    "PVO Assigned": "bg-blue-50 text-blue-600 border border-blue-100",
    Published: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border border-rose-100",
    Submitted: "bg-slate-100 text-slate-600 border border-slate-200",
};

const getLocation = (p: PropertyRecord) => {
    const parts = [p.neighbourhood, p.city, p.state].filter(Boolean);
    if (parts.length) return parts.join(", ");
    if (p.street_address) return p.street_address;
    return "—";
};

const getOwnerName = (p: PropertyRecord) => {
    if (p.owner_name) return p.owner_name;
    if (typeof p.owner_profile === "object" && p.owner_profile) {
        const o = p.owner_profile;
        const name = `${o.first_name ?? ""} ${o.last_name ?? ""}`.trim();
        if (name) return name;
    }
    return "—";
};

const getPvoName = (p: PropertyRecord) => {
    if (p.pvo_name) return p.pvo_name;
    if (typeof p.assigned_pvo === "object" && p.assigned_pvo) {
        const o = p.assigned_pvo;
        const name = `${o.first_name ?? ""} ${o.last_name ?? ""}`.trim();
        if (name) return name;
    }
    if (p.assigned_pvo_id || p.assigned_pvo) return "Assigned";
    return "—";
};

const getTenantName = (p: PropertyRecord) => {
    // API sample does not expose tenant; fall back to dash
    return p.tenant_name || "—";
};

const propertyTypes = [
    "All Types",
    "Apartment",
    "Duplex",
    "Villa",
    "Flat",
    "Studio",
    "Bungalow",
    "Penthouse",
    "House",
    "Land",
];

const propertyStatuses = [
    "All Status",
    "Awaiting Final Approval",
    "PVO Assigned",
    "Published",
    "Rejected",
    "Submitted",
];

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

/* ---------- component ---------- */

const Property = () => {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [page, setPage] = useState(1);

    const { properties: response, isLoading, isError } = useGetProperties(page);
    console.log("properties response", response?.data?.results);

    const list = useMemo(() => {
        const payload = response?.data ?? response;
        const results = Array.isArray(payload?.results)
            ? payload.results
            : Array.isArray(payload)
                ? payload
                : [];
        return results as PropertyRecord[];
    }, [response]);

    const payload = (response?.data ?? response) as
        | {
            count?: number;
            previous?: string | null;
            next?: string | null;
            results?: PropertyRecord[];
        }
        | PropertyRecord[]
        | undefined;

    const totalCount = Number(
        payload && typeof payload === "object" && "count" in payload
            ? (payload.count ?? list.length)
            : (list.length ?? 0)
    );
    const hasPreviousPage = Boolean(
        payload && typeof payload === "object" && "previous" in payload && payload.previous
    );
    const hasNextPage = Boolean(
        payload && typeof payload === "object" && "next" in payload && payload.next
    );
    // Prefer real page size from results; fall back to 10 (common DRF default)
    const pageSize = list.length > 0 ? list.length : 10;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const filtered = useMemo(() => {
        return list.filter((p) => {
            const title = (p.title ?? "").toLowerCase();
            const owner = getOwnerName(p).toLowerCase();
            const location = getLocation(p).toLowerCase();
            const term = search.toLowerCase().trim();

            const matchesSearch =
                !term ||
                title.includes(term) ||
                owner.includes(term) ||
                location.includes(term);

            const displayType = normalizePropertyType(p.property_type);
            const matchesType =
                typeFilter === "All Types" ||
                displayType.toLowerCase() === typeFilter.toLowerCase() ||
                (p.property_type ?? "").toLowerCase() === typeFilter.toLowerCase();

            const displayStatus = normalizeStatus(p.status);
            const matchesStatus =
                statusFilter === "All Status" || displayStatus === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [list, search, typeFilter, statusFilter]);

    if (isError) {
        return (
            <EmptyState
                title="Could not load properties"
                description="Please refresh the page or try again in a few moments."
            />
        );
    }

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Properties</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        {totalCount} propert{totalCount === 1 ? "y" : "ies"} in the system
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    {/* Search + filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search
                                size={16}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    // keep page; client-side filter only on current page (same as Users)
                                }}
                                placeholder="Search"
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-xs text-slate-600 focus:border-blue-400 focus:outline-none"
                                >
                                    {propertyTypes.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-xs text-slate-600 focus:border-blue-400 focus:outline-none"
                                >
                                    {propertyStatuses.map((s) => (
                                        <option key={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table / empty */}
                    {!filtered.length ? (
                        <EmptyState
                            title="No properties found"
                            description={
                                search || typeFilter !== "All Types" || statusFilter !== "All Status"
                                    ? "No properties on this page match your filters."
                                    : "There are no properties in the system yet."
                            }
                        />
                    ) : (
                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                        <th className="pb-3 pr-4 font-medium">Property</th>
                                        <th className="pb-3 pr-4 font-medium">Owner</th>
                                        <th className="pb-3 pr-4 font-medium">Tenant</th>
                                        <th className="pb-3 pr-4 font-medium">Type</th>
                                        <th className="pb-3 pr-4 font-medium">Price/Yr</th>
                                        <th className="pb-3 pr-4 font-medium">Status</th>
                                        <th className="pb-3 pr-4 font-medium">PVO</th>
                                        <th className="pb-3 pr-4 font-medium">Submitted</th>
                                        <th className="pb-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((p) => {
                                        const id = p.id ?? "";
                                        const displayStatus = normalizeStatus(p.status);
                                        const style =
                                            statusStyles[displayStatus] ??
                                            "bg-slate-100 text-slate-600 border border-slate-200";

                                        return (
                                            <tr key={id || p.title} className="text-xs">
                                                <td className="max-w-[220px] py-4 pr-4">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {p.title || "Untitled"}
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-1 text-slate-400">
                                                        <MapPin size={12} /> {getLocation(p)}
                                                    </p>
                                                </td>
                                                <td className="py-4 pr-4 text-slate-700">
                                                    {getOwnerName(p)}
                                                </td>
                                                <td className="py-4 pr-4 text-slate-700">
                                                    {getTenantName(p)}
                                                </td>
                                                <td className="py-4 pr-4">
                                                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-600">
                                                        {normalizePropertyType(p.property_type)}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-4 font-medium text-slate-900">
                                                    {formatPrice(p.price)}
                                                </td>
                                                <td className="py-4 pr-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 font-medium ${style}`}
                                                    >
                                                        {displayStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-4 text-slate-700">
                                                    {getPvoName(p)}
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                                                    {formatDate(p.created_at ?? p.published_at)}
                                                </td>
                                                <td className="py-4">
                                                    <Link
                                                        to={`/admin/properties/${id}`}
                                                        className="font-medium text-blue-600 hover:text-blue-700"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination – same behaviour as Users */}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400">
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
                                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Property;