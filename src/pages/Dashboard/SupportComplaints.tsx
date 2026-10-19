import { Paperclip, Search } from "lucide-react";
import { useMemo, useState } from "react";
import LoadingOverlay from "../../components/LoadingOverlay";
import Modal from "../../components/UI/Modal";
import { useToast } from "../../components/UI/Toast";
import { useReplyComplaint } from "../../hooks/mutations/allMutation";
import { parseApiError } from "../../hooks/parseapierror";
import { useGetComplaints } from "../../hooks/queries/allQueries";

type ComplaintRecord = {
    id?: string;
    display_id?: string;
    property_id?: string;
    seeker_profile_id?: string;
    category?: string;
    description?: string;
    has_evidence?: boolean;
    status?: string;
    sla_due_at?: string | null;
    resolved_at?: string | null;
    created_at?: string;
    updated_at?: string;
};

/* ---------- helpers ---------- */

const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
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

const humanize = (value?: string) => {
    if (!value) return "Unknown";
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const RESOLVED_STATUSES = ["resolved", "closed"];

const isOverdue = (c: ComplaintRecord) =>
    Boolean(c.sla_due_at) &&
    !RESOLVED_STATUSES.includes((c.status ?? "").toLowerCase()) &&
    new Date(c.sla_due_at as string).getTime() < Date.now();

const statusStyles: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-700",
    open: "bg-blue-100 text-blue-700",
    under_review: "bg-purple-100 text-purple-700",
    in_progress: "bg-purple-100 text-purple-700",
    replied: "bg-amber-100 text-amber-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
    rejected: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }: { status?: string }) => (
    <span
        className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[(status ?? "").toLowerCase()] || "bg-gray-100 text-gray-600"
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

const Detail = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <div className="mt-1 text-xs font-medium text-slate-800">{children}</div>
    </div>
);

const MAX_REPLY = 2000;

/* ---------- page ---------- */

const SupportComplaints = () => {
    const toast = useToast();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [selected, setSelected] = useState<ComplaintRecord | null>(null);
    const [reply, setReply] = useState("");
    const [replyError, setReplyError] = useState("");

    const { complaints: response, isLoading, isError, refetch } = useGetComplaints(page);
    const replyMutation = useReplyComplaint();

    const complaints = useMemo(() => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload?.results)
            ? payload.results
            : Array.isArray(payload)
                ? payload
                : [];
        return list as ComplaintRecord[];
    }, [response]);

    const payload = (response?.data ?? response) as
        | { count?: number; previous?: string | null; next?: string | null; results?: ComplaintRecord[] }
        | ComplaintRecord[]
        | undefined;
    const totalCount = Number(
        payload && typeof payload === "object" && "count" in payload
            ? (payload.count ?? complaints.length)
            : (complaints.length ?? 0)
    );
    const hasPreviousPage = Boolean(
        payload && typeof payload === "object" && "previous" in payload && payload.previous
    );
    const hasNextPage = Boolean(
        payload && typeof payload === "object" && "next" in payload && payload.next
    );
    const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(complaints.length || 1, 1)));

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return complaints;
        return complaints.filter((c) =>
            `${c.display_id ?? ""} ${humanize(c.category)} ${c.description ?? ""} ${humanize(c.status)}`
                .toLowerCase()
                .includes(term)
        );
    }, [complaints, search]);

    /* ----- modal ----- */

    const openComplaint = (c: ComplaintRecord) => {
        setSelected(c);
        setReply("");
        setReplyError("");
    };

    const closeModal = () => {
        if (replyMutation.isPending) return;
        setSelected(null);
        setReply("");
        setReplyError("");
    };

    const handleSend = async () => {
        if (!selected?.id) return;
        const message = reply.trim();
        if (!message) {
            setReplyError("Please type a reply before sending.");
            return;
        }

        try {
            await replyMutation.mutateAsync({ id: selected.id, message });
            toast.success("Reply sent", {
                message: "The user will receive your reply by email.",
            });
            setSelected(null);
            setReply("");
            setReplyError("");
            refetch();
        } catch (err) {
            const parsed = parseApiError(err, "Failed to send reply.");
            setReplyError(parsed.message);
            toast.error("Could not send reply", { message: parsed.message });
        }
    };

    /* ----- render ----- */

    if (isError) {
        return (
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <EmptyState
                    title="Could not load complaints"
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
        );
    }

    const sending = replyMutation.isPending;

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                        Support & Complaints
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        {totalCount} complaint{totalCount === 1 ? "" : "s"} total
                    </p>
                </div>

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

                    {!filtered.length ? (
                        <EmptyState
                            title="No complaints found"
                            description={
                                search
                                    ? "No complaints on this page match your search."
                                    : "There are no complaints to display yet."
                            }
                        />
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="mt-5 hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-225 border-collapse">
                                    <thead>
                                        <tr className="whitespace-nowrap border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                            <th className="pb-3 pr-4 font-medium">Complaint ID</th>
                                            <th className="pb-3 pr-4 font-medium">Category</th>
                                            <th className="pb-3 pr-4 font-medium">Description</th>
                                            <th className="pb-3 pr-4 font-medium">Submitted</th>
                                            <th className="pb-3 pr-4 font-medium">SLA Due</th>
                                            <th className="pb-3 pr-4 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map((c, index) => {
                                            const overdue = isOverdue(c);
                                            return (
                                                <tr
                                                    key={c.id ?? c.display_id ?? index}
                                                    onClick={() => openComplaint(c)}
                                                    className="cursor-pointer text-xs transition-colors hover:bg-slate-50"
                                                >
                                                    <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            {c.display_id || "—"}
                                                            {c.has_evidence && (
                                                                <Paperclip
                                                                    size={13}
                                                                    className="text-slate-400"
                                                                    aria-label="Has evidence"
                                                                />
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pr-4">
                                                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                                                            {humanize(c.category)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <p className="max-w-xs truncate text-slate-600">
                                                            {c.description || "—"}
                                                        </p>
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                                                        {formatDateTime(c.created_at)}
                                                    </td>
                                                    <td
                                                        className={`whitespace-nowrap py-4 pr-4 ${overdue ? "font-medium text-red-600" : "text-slate-500"
                                                            }`}
                                                    >
                                                        {formatDateTime(c.sla_due_at)}
                                                        {overdue && " (overdue)"}
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <StatusBadge status={c.status} />
                                                    </td>
                                                    <td className="py-4">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openComplaint(c);
                                                            }}
                                                            className="font-medium text-blue-600 hover:text-blue-700"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
                                {filtered.map((c, index) => {
                                    const overdue = isOverdue(c);
                                    return (
                                        <button
                                            key={c.id ?? c.display_id ?? index}
                                            type="button"
                                            onClick={() => openComplaint(c)}
                                            className="rounded-xl border border-slate-200 p-4 text-left transition-colors hover:bg-slate-50"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                                                    {c.display_id || "—"}
                                                    {c.has_evidence && (
                                                        <Paperclip size={13} className="text-slate-400" />
                                                    )}
                                                </p>
                                                <StatusBadge status={c.status} />
                                            </div>
                                            <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                                                {humanize(c.category)}
                                            </span>
                                            <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                                                {c.description || "—"}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                                                <span className="text-slate-500">
                                                    {formatDateTime(c.created_at)}
                                                </span>
                                                {overdue && (
                                                    <span className="font-medium text-red-600">SLA overdue</span>
                                                )}
                                            </div>
                                        </button>
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
            </div>

            {/* Complaint details + reply */}
            <Modal
                open={!!selected}
                onClose={closeModal}
                locked={sending}
                size="lg"
                title={selected?.display_id ? `Complaint ${selected.display_id}` : "Complaint"}
                description="Your reply will be sent to the user's email address."
                footer={
                    <>
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={sending}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={sending || !reply.trim()}
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
                        >
                            {sending ? "Sending…" : "Send Reply"}
                        </button>
                    </>
                }
            >
                {selected && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <Detail label="Category">{humanize(selected.category)}</Detail>
                            <Detail label="Status">
                                <StatusBadge status={selected.status} />
                            </Detail>
                            <Detail label="Evidence">
                                {selected.has_evidence ? "Attached" : "None"}
                            </Detail>
                            <Detail label="Submitted">{formatDateTime(selected.created_at)}</Detail>
                            <Detail label="SLA due">
                                <span className={isOverdue(selected) ? "font-medium text-red-600" : ""}>
                                    {formatDateTime(selected.sla_due_at)}
                                </span>
                            </Detail>
                            <Detail label="Resolved">{formatDateTime(selected.resolved_at)}</Detail>
                        </div>

                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Description
                            </p>
                            <div className="mt-1.5 max-h-56 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-800">
                                {selected.description || "No description provided."}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="complaint-reply"
                                className="text-[11px] font-medium uppercase tracking-wide text-slate-400"
                            >
                                Your reply
                            </label>
                            <textarea
                                id="complaint-reply"
                                rows={5}
                                maxLength={MAX_REPLY}
                                value={reply}
                                disabled={sending}
                                onChange={(e) => {
                                    setReply(e.target.value);
                                    setReplyError("");
                                }}
                                placeholder="Type your reply to the user…"
                                className={`mt-1.5 w-full resize-none rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 disabled:bg-slate-50 ${replyError
                                    ? "border-red-300 focus:ring-red-400"
                                    : "border-slate-200 focus:ring-blue-500"
                                    }`}
                            />
                            <div className="mt-1 flex items-start justify-between gap-3">
                                {replyError ? (
                                    <p className="text-xs text-red-600">{replyError}</p>
                                ) : (
                                    <span />
                                )}
                                <p className="flex-shrink-0 text-xs text-slate-400">
                                    {reply.length}/{MAX_REPLY}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default SupportComplaints;