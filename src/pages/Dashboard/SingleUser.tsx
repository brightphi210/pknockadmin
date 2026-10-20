import { ArrowLeft, Ban, CheckCircle2, Mail, MapPin, Phone, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { useToast } from "../../components/UI/Toast";
import { useReactivateUser, useSuspendUser } from "../../hooks/mutations/allMutation";
import { parseApiError } from "../../hooks/parseapierror";
import { useGetSingleUser } from "../../hooks/queries/allQueries";

type Inspection = {
    id: string;
    display_id?: string;
    property_id?: string;
    property_title?: string;
    status?: string;
    requested_date?: string;
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

const normalizeText = (value?: string | null) =>
    value && value.trim() ? value : "N/A";

const normalizeStatus = (status?: string | null) => {
    if (!status) return "Not Verified";
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const kycStyles: Record<string, string> = {
    Verified: "bg-green-100 text-green-700",
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-red-100 text-red-700",
    "Not Verified": "bg-slate-100 text-slate-700",
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

const SingleUser = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<"overview" | "inspections">("overview");
    const [action, setAction] = useState<"suspend" | "reactivate" | null>(null);
    const [actionError, setActionError] = useState("");

    const { userData, isLoading, isError, refetch } = useGetSingleUser(id || "");
    const suspendMutation = useSuspendUser();
    const reactivateMutation = useReactivateUser();

    const data = userData?.data ?? userData ?? {};
    const profile = data?.profile ?? {};
    const emailCard = data?.email_card ?? null;
    const kycCard = data?.kyc_card ?? null;
    const stats = data?.stats ?? {};
    const inspections: Inspection[] = Array.isArray(data?.inspections) ? data.inspections : [];

    if (!id) {
        return (
            <EmptyState
                title="User not found"
                description="No user identifier was supplied in the page route."
            />
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-xs text-slate-500">
                Loading user details...
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                title="Could not load user"
                description="The user details could not be fetched from the server."
            />
        );
    }

    if (!profile || Object.keys(profile).length === 0) {
        return (
            <EmptyState
                title="No user data available"
                description="This user does not have any profile information yet."
            />
        );
    }

    const fullName =
        `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Unknown User";
    const kycLabel = normalizeStatus(kycCard?.status);
    const isActive =
        typeof profile.is_active === "boolean"
            ? profile.is_active
            : profile.account_status !== "suspended";
    const emailVerified = Boolean(emailCard?.verified_via);
    const phoneVerified = Boolean(profile.phone_verified);
    const inspectionCount = Number(stats.inspections_requested ?? inspections.length ?? 0);

    const openAction = (type: "suspend" | "reactivate") => {
        setActionError("");
        setAction(type);
    };

    const closeAction = () => {
        if (suspendMutation.isPending || reactivateMutation.isPending) return;
        setAction(null);
        setActionError("");
    };

    const handleAction = async (reason: string) => {
        if (!action || !reason) return;
        const profileId = profile.seeker_profile_id ?? id;
        const mutation = action === "suspend" ? suspendMutation : reactivateMutation;

        try {
            await mutation.mutateAsync({ id: profileId, reason });
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="shrink-0 rounded-lg p-1.5 hover:bg-slate-100"
                            aria-label="Back to users"
                        >
                            <ArrowLeft size={18} className="text-slate-600" />
                        </button>

                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                {(profile.first_name?.[0] ?? "").toUpperCase()}
                                {(profile.last_name?.[0] ?? "").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                        {fullName}
                                    </h1>
                                    <span
                                        className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${kycStyles[kycLabel] || "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {kycLabel}
                                    </span>
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
                                    {profile.display_id || "User"} · Joined{" "}
                                    {formatDate(profile.member_since)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:shrink-0">
                        <button className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 md:flex-none">
                            Approve KYC
                        </button>
                        {isActive ? (
                            <button
                                onClick={() => openAction("suspend")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 md:flex-none"
                            >
                                <Ban size={14} /> Suspend
                            </button>
                        ) : (
                            <button
                                onClick={() => openAction("reactivate")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50 md:flex-none"
                            >
                                <RotateCcw size={14} /> Reactivate
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 break-all">
                        <Mail size={14} className="shrink-0" /> {normalizeText(profile.email)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Phone size={14} className="shrink-0" /> {normalizeText(profile.phone)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="shrink-0" />{" "}
                        {normalizeText(profile.current_address || profile.state_of_origin)}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-5 sm:px-6">
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
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                        <div className="min-w-0 space-y-5 xl:col-span-2">
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                                    <Field label="First Name" value={normalizeText(profile.first_name)} />
                                    <Field label="Last Name" value={normalizeText(profile.last_name)} />
                                    <Field label="Email Address" value={normalizeText(profile.email)} />
                                    <Field label="Phone Number" value={normalizeText(profile.phone)} />
                                    <Field label="Gender" value={normalizeText(profile.gender)} />
                                    <Field label="Date of Birth" value={formatDate(profile.date_of_birth)} />
                                    <Field
                                        label="State of Origin"
                                        value={normalizeText(profile.state_of_origin)}
                                    />
                                    <Field label="Nationality" value={normalizeText(profile.nationality)} />
                                    <Field
                                        label="Current Address"
                                        value={normalizeText(profile.current_address)}
                                    />
                                    <Field label="Member Since" value={formatDate(profile.member_since)} />
                                    <Field
                                        label="Budget Range"
                                        value={
                                            profile.price_min != null && profile.price_max != null
                                                ? `₦${Number(profile.price_min).toLocaleString("en-NG")} – ₦${Number(
                                                    profile.price_max
                                                ).toLocaleString("en-NG")}`
                                                : "N/A"
                                        }
                                    />
                                    <Field
                                        label="Inspections Requested"
                                        value={String(inspectionCount)}
                                    />
                                    <Field className="sm:col-span-2" label="Bio" value={normalizeText(profile.bio)} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className={emailVerified ? "text-green-600" : "text-slate-400"}
                                        />
                                        <span className="text-sm font-semibold text-slate-900">
                                            Email Address
                                        </span>
                                    </div>
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${emailVerified
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {emailVerified ? "Verified" : "Pending"}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {emailVerified
                                        ? `Verified via ${normalizeStatus(emailCard?.verified_via)}`
                                        : "Not yet verified"}
                                </p>
                                <p className="mt-1 break-all text-xs font-medium text-slate-800">
                                    {normalizeText(emailCard?.email ?? profile.email)}
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className={phoneVerified ? "text-green-600" : "text-slate-400"}
                                        />
                                        <span className="text-sm font-semibold text-slate-900">
                                            Phone Number
                                        </span>
                                    </div>
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${phoneVerified
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {phoneVerified ? "Verified" : "Pending"}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">Phone verification status</p>
                                <p className="mt-1 break-all text-xs font-medium text-slate-800">
                                    {normalizeText(profile.phone)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "inspections" && (
                    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                        {inspections.length === 0 ? (
                            <p className="py-6 text-center text-xs text-slate-500">
                                No inspection records found for this user yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-150 border-collapse">
                                    <thead>
                                        <tr className="whitespace-nowrap border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                            <th className="pb-3 pr-4 font-medium">Inspection ID</th>
                                            <th className="pb-3 pr-4 font-medium">Property</th>
                                            <th className="pb-3 pr-4 font-medium">Requested Date</th>
                                            <th className="pb-3 pr-4 font-medium">Created</th>
                                            <th className="pb-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {inspections.map((item) => (
                                            <tr key={item.id} className="text-xs hover:bg-slate-50">
                                                <td className="whitespace-nowrap py-4 pr-4 text-slate-600">
                                                    {item.display_id || "—"}
                                                </td>
                                                <td className="py-4 pr-4 text-sm font-semibold text-slate-900">
                                                    {item.property_title || "—"}
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                                                    {formatDate(item.requested_date)}
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="py-4">
                                                    <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        {normalizeStatus(item.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
        </div>
    );
};

export default SingleUser;