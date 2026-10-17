import { Ban, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import ActionsMenu from "../../components/UI/ActionMenu";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { useToast } from "../../components/UI/Toast";
import { useReactivateUser, useSuspendUser } from "../../hooks/mutations/allMutation";
import { parseApiError } from "../../hooks/parseapierror";
import { useGetUsers } from "../../hooks/queries/allQueries";

type UserRecord = {
    id?: string;
    user_id?: string;
    display_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    registered_at?: string;
    inspection_count?: number;
    kyc_status?: string;
    role?: string;
    is_active?: boolean;
    active?: boolean;
};

const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const normalizeStatus = (status?: string) => {
    if (!status) return "Unknown";
    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const isUserActive = (user: UserRecord) => {
    if (typeof user.is_active === "boolean") return user.is_active;
    if (typeof user.active === "boolean") return user.active;
    return true;
};

const getUserKey = (user: UserRecord) =>
    user?.user_id ?? user?.id ?? user?.display_id ?? "";

const getFullName = (user?: UserRecord | null) =>
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

const KycBadge = ({ status }: { status?: string }) => {
    const value = normalizeStatus(status);
    const styles: Record<string, string> = {
        Verified: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Rejected: "bg-red-100 text-red-700",
        Approved: "bg-green-100 text-green-700",
        "Not Verified": "bg-slate-100 text-slate-700",
    };

    return (
        <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[value] || "bg-gray-100 text-gray-600"
                }`}
        >
            {value}
        </span>
    );
};

const StatusBadge = ({ active }: { active: boolean }) => (
    <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${active ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
    >
        <span
            className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green-500" : "bg-amber-500"}`}
        />
        {active ? "Active" : "Suspended"}
    </span>
);

const EmptyState = ({
    title,
    description,
}: {
    title: string;
    description: string;
    onAction?: () => void;
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


const Users = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [action, setAction] = useState<"suspend" | "reactivate" | null>(null);
    const [actionError, setActionError] = useState("");

    const { users: response, isLoading, isError, refetch } = useGetUsers(page);
    const suspendMutation = useSuspendUser();
    const reactivateMutation = useReactivateUser();
    console.log("users response", response?.data);

    const users = useMemo(() => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload?.results)
            ? payload.results
            : Array.isArray(payload)
                ? payload
                : [];
        return list as UserRecord[];
    }, [response]);

    const payload = (response?.data ?? response) as
        | { count?: number; previous?: string | null; next?: string | null; results?: UserRecord[] }
        | UserRecord[]
        | undefined;
    const totalUsers = Number(
        payload && typeof payload === "object" && "count" in payload
            ? (payload.count ?? users.length)
            : (users.length ?? 0)
    );
    const hasPreviousPage = Boolean(
        payload && typeof payload === "object" && "previous" in payload && payload.previous
    );
    const hasNextPage = Boolean(
        payload && typeof payload === "object" && "next" in payload && payload.next
    );
    const totalPages = Math.max(1, Math.ceil(totalUsers / Math.max(users.length || 1, 1)));
    const suspendedCount = users.filter((u) => !isUserActive(u)).length;

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const term = search.toLowerCase();
        return users.filter((user) => {
            const name = getFullName(user).toLowerCase();
            const match = `${name} ${user?.email ?? ""} ${user?.phone ?? ""}`.toLowerCase();
            return match.includes(term);
        });
    }, [search, users]);

    const viewUser = (id?: string) => {
        if (!id) return;
        navigate(`/admin/users/${id}`);
    };

    /* ----- suspend / reactivate ----- */

    const openAction = (user: UserRecord, type: "suspend" | "reactivate") => {
        setSelectedUser(user);
        setActionError("");
        setAction(type);
    };

    const closeAction = () => {
        if (suspendMutation.isPending || reactivateMutation.isPending) return;
        setAction(null);
        setSelectedUser(null);
        setActionError("");
    };

    const handleAction = async (reason: string) => {
        if (!selectedUser || !action || !reason) return;

        // Prefer user_id (accounts/users/:id), fall back to id
        const id = selectedUser.user_id ?? selectedUser.id;
        if (!id) return;

        const mutation = action === "suspend" ? suspendMutation : reactivateMutation;
        const fullName = getFullName(selectedUser) || "User";

        try {
            await mutation.mutateAsync({ id, reason });
            toast.success(action === "suspend" ? "Account suspended" : "Account reactivated", {
                message: fullName,
            });
            setAction(null);
            setSelectedUser(null);
            setActionError("");
            refetch();
        } catch (err) {
            const parsed = parseApiError(err, `Failed to ${action} account.`);
            setActionError(parsed.message);
            toast.error(`Could not ${action} account`, { message: parsed.message });
        }
    };

    /* ----- render ----- */

    if (isError) {
        return (
            <EmptyState
                title="Could not load users"
                description="Please refresh the page or try again in a few moments."
                onAction={() => refetch()}
            />
        );
    }

    const selectedName = getFullName(selectedUser) || "this user";

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="mb-5 sm:mb-6">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Users</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {totalUsers} registered user{totalUsers === 1 ? "" : "s"}
                        {suspendedCount > 0 && <> · {suspendedCount} suspended (this page)</>}
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b border-gray-100 p-4">
                        <div className="relative w-full md:max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {!filteredUsers.length ? (
                        <EmptyState
                            title="No users found"
                            description={
                                search
                                    ? "No users on this page match your search."
                                    : "There are no registered users in the system yet."
                            }
                        />
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="whitespace-nowrap bg-gray-50 text-left font-medium text-gray-500">
                                            <th className="px-6 py-3">User ID</th>
                                            <th className="px-6 py-3">Name</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Phone Number</th>
                                            <th className="px-6 py-3">Registered</th>
                                            <th className="px-6 py-3 text-center">Inspections</th>
                                            <th className="px-6 py-3">KYC Status</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map((user) => {
                                            const userKey = getUserKey(user);
                                            const menuId = `table-${userKey}`;
                                            const fullName = getFullName(user) || "Unknown User";
                                            const active = isUserActive(user);

                                            return (
                                                <tr
                                                    key={userKey || fullName}
                                                    className={`transition-colors hover:bg-gray-50 ${active ? "" : "bg-gray-50/60"
                                                        }`}
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                                        {user?.display_id || "—"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                                        {fullName}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user?.email || "—"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                                                        {user?.phone || "—"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                                                        {formatDate(user?.registered_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-700">
                                                        {user?.inspection_count ?? 0}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <KycBadge status={user?.kyc_status} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge active={active} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <ActionsMenu
                                                            open={openMenuId === menuId}
                                                            onToggle={() =>
                                                                setOpenMenuId((prev) =>
                                                                    prev === menuId ? null : menuId
                                                                )
                                                            }
                                                            onClose={() => setOpenMenuId(null)}
                                                            onView={() =>
                                                                viewUser(user?.id ?? user?.user_id)
                                                            }
                                                            onSuspend={() =>
                                                                openAction(user, "suspend")
                                                            }
                                                            onReactivate={() =>
                                                                openAction(user, "reactivate")
                                                            }
                                                            isActive={active}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
                                {filteredUsers.map((user) => {
                                    const userKey = getUserKey(user);
                                    const menuId = `card-${userKey}`;
                                    const fullName = getFullName(user) || "Unknown User";
                                    const active = isUserActive(user);

                                    return (
                                        <div
                                            key={userKey || fullName}
                                            className={`rounded-xl border border-gray-200 p-4 ${active ? "" : "bg-gray-50/60"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {fullName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {user?.email || "No email"}
                                                    </p>
                                                </div>
                                                <ActionsMenu
                                                    open={openMenuId === menuId}
                                                    onToggle={() =>
                                                        setOpenMenuId((prev) =>
                                                            prev === menuId ? null : menuId
                                                        )
                                                    }
                                                    onClose={() => setOpenMenuId(null)}
                                                    onView={() => viewUser(user?.id ?? user?.user_id)}
                                                    onSuspend={() => openAction(user, "suspend")}
                                                    onReactivate={() => openAction(user, "reactivate")}
                                                    isActive={active}
                                                />
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <KycBadge status={user?.kyc_status} />
                                                <StatusBadge active={active} />
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                                        User ID
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-800">
                                                        {user?.display_id ?? (userKey || "—")}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                                        Registered
                                                    </p>
                                                    <p className="mt-1 font-medium text-gray-800">
                                                        {formatDate(user?.registered_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-sm">
                                                <span className="text-gray-500">
                                                    {user?.inspection_count ?? 0} inspections
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-4">
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
            </div>

            {/* Suspend */}
            <ConfirmModal
                open={action === "suspend" && !!selectedUser}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="danger"
                icon={<Ban size={26} />}
                title="Suspend Account"
                description={
                    <>
                        Suspending{" "}
                        <span className="font-medium text-slate-800">{selectedName}</span>
                        ’s account will block them from signing in.
                    </>
                }
                reasonLabel="Reason for suspension"
                reasonPlaceholder="e.g. Multiple complaints received, pending investigation…"
                confirmLabel="Suspend Account"
                loadingLabel="Suspending…"
                loading={suspendMutation.isPending}
                error={actionError}
            />

            {/* Reactivate */}
            <ConfirmModal
                open={action === "reactivate" && !!selectedUser}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="success"
                icon={<RotateCcw size={26} />}
                title="Reactivate Account"
                description={
                    <>
                        Reactivating{" "}
                        <span className="font-medium text-slate-800">{selectedName}</span>
                        ’s account will restore their access.
                    </>
                }
                reasonLabel="Reason for reactivating"
                reasonPlaceholder="e.g. Investigation completed, no further issues found…"
                confirmLabel="Reactivate Account"
                loadingLabel="Reactivating…"
                loading={reactivateMutation.isPending}
                error={actionError}
            />
        </>
    );
};

export default Users;