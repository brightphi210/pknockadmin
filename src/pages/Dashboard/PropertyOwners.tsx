import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetOwners } from "../../hooks/queries/allQueries";

type OwnerRecord = {
    owner_profile_id?: string;
    user_id?: string;
    display_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    kyc_status?: string;
    owner_verification?: string;
    total_properties?: number;
    verified_properties?: number;
    occupied_properties?: number;
    pending_properties?: number;
    total_earned?: string | number;
    account_status?: string;
    member_since?: string;
};

const normalizeLabel = (value?: string) => {
    if (!value) return "Unknown";
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getKycStatus = (record: OwnerRecord) => {
    const value = record.kyc_status || record.owner_verification || "Not Verified";
    const normalized = value.toLowerCase();
    return ["verified", "approved", "passed"].some((term) => normalized.includes(term)) ? "Verified" : "Not Verified";
};

const formatCurrency = (value?: string | number) => {
    if (value === null || value === undefined || value === "") return "₦0";
    const numberValue = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numberValue)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2,
    }).format(numberValue);
};

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

const PropertyOwners = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const { owners: response, isLoading, isError, refetch } = useGetOwners(page);

    const owners = useMemo(() => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload?.results)
            ? payload.results
            : Array.isArray(payload)
                ? payload
                : [];
        return list as OwnerRecord[];
    }, [response]);

    const payload = (response?.data ?? response) as { count?: number; previous?: string | null; next?: string | null; results?: OwnerRecord[] } | OwnerRecord[] | undefined;
    const totalOwners = Number(payload && typeof payload === "object" && "count" in payload ? payload.count ?? owners.length : owners.length ?? 0);
    const hasPreviousPage = Boolean(payload && typeof payload === "object" && "previous" in payload && payload.previous);
    const hasNextPage = Boolean(payload && typeof payload === "object" && "next" in payload && payload.next);
    const totalPages = Math.max(1, Math.ceil(totalOwners / Math.max(owners.length || 1, 1)));

    const filtered = useMemo(() => {
        if (!search.trim()) return owners;
        const term = search.toLowerCase();
        return owners.filter((owner) => {
            const fullName = `${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim().toLowerCase();
            const combined = `${fullName} ${owner.email ?? ""} ${owner.phone ?? ""}`.toLowerCase();
            return combined.includes(term);
        });
    }, [owners, search]);

    const kycStyles: Record<string, string> = {
        Verified: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        "Not Verified": "bg-rose-50 text-rose-600 border border-rose-100",
    };

    const statusStyles: Record<string, string> = {
        Active: "bg-amber-50 text-amber-600 border border-amber-100",
        Suspended: "bg-rose-50 text-rose-600 border border-rose-100",
        Inactive: "bg-slate-100 text-slate-600 border border-slate-200",
    };

    if (isError) {
        return (
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <EmptyState
                    title="Could not load owners"
                    description="Please try refreshing this page to reload the owner list."
                />
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Property Owners</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        {totalOwners} registered property owner{totalOwners === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                    <div className="relative w-full sm:max-w-xs">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search"
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                        />
                    </div>

                    {!filtered.length ? (
                        <EmptyState
                            title="No property owners found"
                            description="There are no owners to display for the current search or filter."
                        />
                    ) : (
                        <>
                            <div className="mt-5 hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-225 border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                            <th className="pb-3 pr-4 font-medium">Owner</th>
                                            <th className="pb-3 pr-4 font-medium">KYC</th>
                                            <th className="pb-3 pr-4 font-medium">Total Property</th>
                                            <th className="pb-3 pr-4 font-medium">Verified Property</th>
                                            <th className="pb-3 pr-4 font-medium">Occupied Property</th>
                                            <th className="pb-3 pr-4 font-medium">Pending Property</th>
                                            <th className="pb-3 pr-4 font-medium">Earnings</th>
                                            <th className="pb-3 pr-4 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map((owner, index) => {
                                            const ownerId = owner.owner_profile_id ?? owner.user_id ?? owner.display_id ?? String(index);
                                            const ownerName = `${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim() || owner.display_id || `Owner ${index + 1}`;
                                            const kyc = getKycStatus(owner);
                                            const status = normalizeLabel(owner.account_status || "Active");
                                            return (
                                                <tr key={ownerId} className="text-xs">
                                                    <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">{ownerName}</td>
                                                    <td className="py-4 pr-4">
                                                        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-medium ${kycStyles[kyc]}`}>{kyc}</span>
                                                    </td>
                                                    <td className="py-4 pr-4 text-slate-700">{owner.total_properties ?? 0}</td>
                                                    <td className="py-4 pr-4 text-slate-700">{owner.verified_properties ?? 0}</td>
                                                    <td className="py-4 pr-4 text-slate-700">{owner.occupied_properties ?? 0}</td>
                                                    <td className="py-4 pr-4 text-slate-700">{owner.pending_properties ?? 0}</td>
                                                    <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-900">{formatCurrency(owner.total_earned)}</td>
                                                    <td className="py-4 pr-4">
                                                        <span className={`rounded-full px-2.5 py-1 font-medium ${statusStyles[status] || "bg-slate-100 text-slate-600 border border-slate-200"}`}>{status}</span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Link to={`/admin/property-owners/${ownerId}`} className="font-medium text-blue-600 hover:text-blue-700">
                                                                View
                                                            </Link>
                                                            <button type="button" className="font-medium text-rose-600 hover:text-rose-700">
                                                                {status === "Suspended" ? "Reinstate" : "Suspend"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
                                {filtered.map((owner, index) => {
                                    const ownerId = owner.owner_profile_id ?? owner.user_id ?? owner.display_id ?? String(index);
                                    const ownerName = `${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim() || owner.display_id || `Owner ${index + 1}`;
                                    const kyc = getKycStatus(owner);
                                    const status = normalizeLabel(owner.account_status || "Active");
                                    return (
                                        <div key={ownerId} className="rounded-xl border border-slate-200 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{ownerName}</p>
                                                    <p className="mt-1 text-sm font-medium text-slate-900">{formatCurrency(owner.total_earned)}</p>
                                                </div>
                                                <div className="flex shrink-0 flex-col items-end gap-1.5 text-xs">
                                                    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-medium ${kycStyles[kyc]}`}>{kyc}</span>
                                                    <span className={`rounded-full px-2.5 py-1 font-medium ${statusStyles[status] || "bg-slate-100 text-slate-600 border border-slate-200"}`}>{status}</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 grid grid-cols-4 gap-2 rounded-lg bg-slate-50 p-3 text-center">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{owner.total_properties ?? 0}</p>
                                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Total</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{owner.verified_properties ?? 0}</p>
                                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Verified</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{owner.occupied_properties ?? 0}</p>
                                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Occupied</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{owner.pending_properties ?? 0}</p>
                                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Pending</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-3 text-xs">
                                                <Link to={`/admin/property-owners/${ownerId}`} className="font-medium text-blue-600 hover:text-blue-700">
                                                    View
                                                </Link>
                                                <button type="button" className="font-medium text-rose-600 hover:text-rose-700">
                                                    {status === "Suspended" ? "Reinstate" : "Suspend"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
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
            </div>
        </>
    );
};

export default PropertyOwners;
