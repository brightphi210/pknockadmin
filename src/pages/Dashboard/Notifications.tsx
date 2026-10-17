import {
    Bell,
    Building2,
    CheckCheck,
    ClipboardList,
    CreditCard,
    MessageSquare,
    Search,
    Settings,
    ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useToast } from "../../components/UI/Toast";
import {
    useMarkAllNotificationsRead,
    useMarkNotificationRead,
} from "../../hooks/mutations/allMutation";
import { parseApiError } from "../../hooks/parseapierror";
import { useGetNotifications } from "../../hooks/queries/allQueries";

type NotificationRecord = {
    id?: string;
    notification_type?: string;
    title?: string;
    body?: string;
    link_type?: string | null;
    link_id?: string | null;
    read_at?: string | null;
    created_at?: string;
};

type CategoryId =
    | "all"
    | "inspection"
    | "verification"
    | "payments"
    | "listings"
    | "complaints"
    | "system";

const categories = [
    { id: "all", label: "All", icon: Bell },
    { id: "inspection", label: "Inspection", icon: ClipboardList },
    { id: "verification", label: "Verification", icon: ShieldCheck },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "listings", label: "Listings", icon: Building2 },
    { id: "complaints", label: "Complaints", icon: MessageSquare },
    { id: "system", label: "System", icon: Settings },
] as const;

const categoryStyles: Record<
    Exclude<CategoryId, "all">,
    { icon: typeof Bell; bg: string; color: string }
> = {
    payments: { icon: CreditCard, bg: "bg-green-50", color: "text-green-600" },
    listings: { icon: Building2, bg: "bg-purple-50", color: "text-purple-600" },
    inspection: { icon: ClipboardList, bg: "bg-amber-50", color: "text-amber-600" },
    complaints: { icon: MessageSquare, bg: "bg-red-50", color: "text-red-500" },
    verification: { icon: ShieldCheck, bg: "bg-blue-50", color: "text-blue-600" },
    system: { icon: Settings, bg: "bg-gray-100", color: "text-gray-500" },
};

/* Map the backend notification_type (e.g. "inspection_booking") to a category */
const getCategory = (type?: string): Exclude<CategoryId, "all"> => {
    const t = (type ?? "").toLowerCase();
    if (t.includes("inspection")) return "inspection";
    if (t.includes("verif") || t.includes("kyc")) return "verification";
    if (t.includes("payment") || t.includes("payout") || t.includes("withdraw") || t.includes("rent"))
        return "payments";
    if (t.includes("listing") || t.includes("property")) return "listings";
    if (t.includes("complaint") || t.includes("support")) return "complaints";
    return "system";
};

/* Where a notification should take the admin when clicked (adjust to your routes) */
const getLinkPath = (n: NotificationRecord): string | null => {
    if (!n.link_id) return null;
    switch ((n.link_type ?? "").toLowerCase()) {
        case "inspection":
            return `/admin/inspections/${n.link_id}`;
        case "user":
            return `/admin/users/${n.link_id}`;
        default:
            return null;
    }
};

const timeAgo = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    }
    return new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex min-h-80 items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
        <div className="w-full max-w-md px-6 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                !
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const Notifications = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { notifications: response, isLoading, isError, refetch } = useGetNotifications(page);
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const items = useMemo(() => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload?.results)
            ? payload.results
            : Array.isArray(payload)
                ? payload
                : [];
        return list as NotificationRecord[];
    }, [response]);

    const payload = (response?.data ?? response) as
        | { count?: number; previous?: string | null; next?: string | null; results?: NotificationRecord[] }
        | NotificationRecord[]
        | undefined;
    const totalCount = Number(
        payload && typeof payload === "object" && "count" in payload
            ? (payload.count ?? items.length)
            : (items.length ?? 0)
    );
    const hasPreviousPage = Boolean(
        payload && typeof payload === "object" && "previous" in payload && payload.previous
    );
    const hasNextPage = Boolean(
        payload && typeof payload === "object" && "next" in payload && payload.next
    );
    const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(items.length || 1, 1)));
    const unreadCount = items.filter((n) => !n.read_at).length;

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return items.filter((n) => {
            const matchCategory =
                activeCategory === "all" || getCategory(n.notification_type) === activeCategory;
            const matchSearch =
                !term ||
                (n.title ?? "").toLowerCase().includes(term) ||
                (n.body ?? "").toLowerCase().includes(term);
            return matchCategory && matchSearch;
        });
    }, [items, activeCategory, search]);

    /* ----- actions ----- */

    const handleOpen = async (n: NotificationRecord) => {
        if (n.id && !n.read_at && !markRead.isPending) {
            try {
                await markRead.mutateAsync(n.id);
            } catch (err) {
                const parsed = parseApiError(err, "Failed to mark notification as read.");
                toast.error("Could not update notification", { message: parsed.message });
            }
        }
        const path = getLinkPath(n);
        if (path) navigate(path);
    };

    const handleMarkAll = async () => {
        try {
            await markAllRead.mutateAsync();
            toast.success("All notifications marked as read");
        } catch (err) {
            const parsed = parseApiError(err, "Failed to mark notifications as read.");
            toast.error("Could not mark all as read", { message: parsed.message });
        }
    };

    /* ----- render ----- */

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                {/* Header */}
                <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                            Notifications
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"} on this page
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleMarkAll}
                        disabled={markAllRead.isPending || isLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
                    >
                        <CheckCheck size={16} />
                        {markAllRead.isPending ? "Marking…" : "Mark all as read"}
                    </button>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                    {/* Categories: horizontal scroll on mobile, sidebar on desktop */}
                    <div className="w-full lg:w-56 lg:flex-shrink-0">
                        <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2 lg:flex-col lg:gap-0.5 lg:overflow-visible">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:w-full lg:py-2.5 ${isActive
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notifications list */}
                    <div className="min-w-0 flex-1 space-y-3">
                        {/* Search */}
                        <div className="relative mb-1 w-full sm:mb-4 sm:ml-auto sm:max-w-sm">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {isError ? (
                            <div className="space-y-4">
                                <EmptyState
                                    title="Could not load notifications"
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
                                title="No notifications"
                                description={
                                    search || activeCategory !== "all"
                                        ? "No notifications on this page match your filter."
                                        : "You're all caught up. New notifications will appear here."
                                }
                            />
                        ) : (
                            filtered.map((n, index) => {
                                const style = categoryStyles[getCategory(n.notification_type)];
                                const Icon = style.icon;
                                const unread = !n.read_at;
                                return (
                                    <button
                                        key={n.id ?? index}
                                        type="button"
                                        onClick={() => handleOpen(n)}
                                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-shadow hover:shadow-sm sm:gap-4 sm:p-4 ${unread
                                            ? "border-blue-100 bg-blue-50/30"
                                            : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        <div
                                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${style.bg}`}
                                        >
                                            <Icon size={18} className={style.color} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-gray-900 ${unread ? "font-semibold" : "font-medium"
                                                            }`}
                                                    >
                                                        {n.title || "Notification"}
                                                    </p>
                                                    <p className="mt-0.5 break-words text-sm text-gray-500">
                                                        {n.body}
                                                    </p>
                                                </div>
                                                <div className="mt-1 flex flex-shrink-0 items-center gap-2 sm:mt-0">
                                                    {unread && (
                                                        <span
                                                            className="h-2 w-2 rounded-full bg-green-500"
                                                            aria-label="Unread"
                                                        />
                                                    )}
                                                    <span className="whitespace-nowrap text-xs text-gray-400">
                                                        {timeAgo(n.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}

                        {/* Pagination */}
                        {!isError && (
                            <div className="flex items-center justify-between gap-3 pt-2">
                                <p className="text-sm text-gray-500">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                        disabled={!hasPreviousPage || page === 1}
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notifications;