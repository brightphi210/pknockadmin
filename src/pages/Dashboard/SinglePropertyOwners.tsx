import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    Ban,
    Building2,
    CheckCircle2,
    Clock,
    Landmark,
    Mail,
    Phone,
    RotateCcw,
    ShieldCheck,
    UserCheck,
    Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { useToast } from "../../components/UI/Toast";
import { useReactivateUser, useSuspendUser } from "../../hooks/mutations/allMutation";
import { parseApiError } from "../../hooks/parseapierror";
import { useGetSingleOwner } from "../../hooks/queries/allQueries";

type Tab = "Overview" | "Properties" | "Bank";

type OwnerProfile = {
    owner_profile_id?: string;
    user_id?: string;
    display_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    date_of_birth?: string | null;
    state_of_origin?: string;
    nationality?: string;
    kyc_status?: string;
    owner_verification?: string;
    is_active?: boolean;
    account_status?: string;
    member_since?: string;
    profile_image?: string | null;
};

type OwnerProperty = {
    id?: string;
    title?: string;
    city?: string;
    price?: string | number;
    status?: string;
    occupancy_status?: string;
    created_at?: string;
};

type BankAccount = {
    id?: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    is_default?: boolean;
    is_primary?: boolean;
    [key: string]: unknown;
};

type KycCard = {
    status?: string;
    document_type?: string;
    document_url?: string;
    image?: string;
    front_image?: string;
    submitted_at?: string;
    [key: string]: unknown;
} | null;

type OwnerDetail = {
    profile?: OwnerProfile;
    email_card?: { email?: string; verified_via?: string | null } | null;
    kyc_card?: KycCard;
    stats?: {
        total_properties?: number;
        verified_properties?: number;
        occupied_properties?: number;
        pending_properties?: number;
        total_earned?: string | number;
    };
    properties?: OwnerProperty[];
    bank_accounts?: BankAccount[];
};

/* ---------- helpers ---------- */

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex min-h-[320px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                !
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const formatMoney = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "₦0";
    const numericValue = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numericValue)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2,
    }).format(numericValue);
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

const normalizeText = (value?: string | null) => (value && value.trim() ? value : "N/A");

const humanize = (value?: string | null) => {
    if (!value) return "N/A";
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatGender = (value?: string) => {
    const v = (value ?? "").trim().toLowerCase();
    if (!v) return "N/A";
    if (v === "m" || v === "male") return "Male";
    if (v === "f" || v === "female") return "Female";
    return humanize(value);
};

const initials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("") || "?";

const PROPERTY_STATUS_LABEL: Record<string, string> = {
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

const PROPERTY_STATUS_STYLE: Record<string, string> = {
    "Awaiting Final Approval": "bg-amber-50 text-amber-600 border border-amber-100",
    "PVO Assigned": "bg-blue-50 text-blue-600 border border-blue-100",
    Published: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border border-rose-100",
    Submitted: "bg-slate-100 text-slate-600 border border-slate-200",
};

const getPropertyStatus = (status?: string) => {
    if (!status) return "Submitted";
    const key = status.toLowerCase().replace(/\s+/g, "_");
    return PROPERTY_STATUS_LABEL[key] ?? humanize(status);
};

const isVerifiedValue = (value?: string | null) =>
    ["verified", "approved", "passed"].some((t) => (value ?? "").toLowerCase().includes(t));

const maskAccount = (value?: string) => {
    if (!value) return "N/A";
    return value.length > 4 ? `${"•".repeat(value.length - 4)}${value.slice(-4)}` : value;
};

/* ---------- page ---------- */

const SinglePropertyOwners = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState<Tab>("Overview");
    const [showAction, setShowAction] = useState(false);
    const [actionError, setActionError] = useState("");

    const { ownerData, isLoading, isError } = useGetSingleOwner(id || "");
    const suspendMutation = useSuspendUser();
    const reactivateMutation = useReactivateUser();

    const data = (ownerData?.data ?? ownerData ?? {}) as OwnerDetail;
    const profile = data.profile;

    if (!id) {
        return <EmptyState title="Owner not found" description="No owner identifier was included in the route." />;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-sm text-slate-500">
                Loading owner details...
            </div>
        );
    }

    if (isError) {
        return <EmptyState title="Could not load owner" description="The owner details could not be retrieved from the API." />;
    }

    if (!profile) {
        return <EmptyState title="No owner data available" description="This owner does not have a profile record yet." />;
    }

    /* ----- derived values ----- */

    const stats = data.stats ?? {};
    const properties = data.properties ?? [];
    const bankAccounts = data.bank_accounts ?? [];
    const emailCard = data.email_card;
    const kycCard = data.kyc_card;

    const ownerName = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Unknown Owner";
    const memberSince = formatDate(profile.member_since);

    const ownerVerified = isVerifiedValue(profile.owner_verification);
    const ownerVerificationLabel = ownerVerified ? "Verified" : humanize(profile.owner_verification || "Not Verified");

    const kycRaw = (kycCard?.status ?? profile.kyc_status ?? "").toLowerCase();
    const kycLabel = !kycCard && (kycRaw === "" || kycRaw === "none") ? "Not Submitted" : humanize(kycCard?.status ?? profile.kyc_status);
    const kycStyle = isVerifiedValue(kycRaw)
        ? "border-emerald-100 bg-emerald-50 text-emerald-600"
        : kycRaw === "pending" || kycRaw === "submitted"
            ? "border-amber-100 bg-amber-50 text-amber-600"
            : kycRaw === "rejected"
                ? "border-rose-100 bg-rose-50 text-rose-600"
                : "border-slate-200 bg-slate-100 text-slate-600";
    const kycImage = kycCard?.document_url ?? kycCard?.front_image ?? kycCard?.image;

    const emailAddress = emailCard?.email || profile.email;
    const emailVerifiedVia = emailCard?.verified_via;

    const isActive = (profile.account_status ?? "active").toLowerCase() !== "suspended" && profile.is_active !== false;
    const action: "suspend" | "reactivate" = isActive ? "suspend" : "reactivate";
    const actionPending = suspendMutation.isPending || reactivateMutation.isPending;

    const tabs: Tab[] = ["Overview", "Properties", "Bank"];

    const statCards = [
        { label: "Total Earned", value: formatMoney(stats.total_earned), icon: Wallet, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
        { label: "Total Properties", value: String(stats.total_properties ?? 0), icon: Building2, iconBg: "bg-slate-100", iconColor: "text-slate-600" },
        { label: "Verified & Published", value: String(stats.verified_properties ?? 0), icon: ShieldCheck, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
        { label: "Currently Occupied", value: String(stats.occupied_properties ?? 0), icon: UserCheck, iconBg: "bg-violet-50", iconColor: "text-violet-600" },
        { label: "Pending Review", value: String(stats.pending_properties ?? 0), icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    ];

    const personalDetails = [
        { label: "Owner ID", value: normalizeText(profile.display_id) },
        { label: "First Name", value: normalizeText(profile.first_name) },
        { label: "Last Name", value: normalizeText(profile.last_name) },
        { label: "Email Address", value: normalizeText(profile.email) },
        { label: "Phone Number", value: normalizeText(profile.phone) },
        { label: "Gender", value: formatGender(profile.gender) },
        { label: "Date of Birth", value: formatDate(profile.date_of_birth) },
        { label: "State of Origin", value: normalizeText(profile.state_of_origin) },
        { label: "Nationality", value: normalizeText(profile.nationality) },
        { label: "Member Since", value: memberSince },
    ];

    /* ----- suspend / reactivate ----- */

    const closeAction = () => {
        if (actionPending) return;
        setShowAction(false);
        setActionError("");
    };

    const handleAction = async (reason: string) => {
        const userId = profile.user_id;
        if (!userId || !reason) return;

        const mutation = action === "suspend" ? suspendMutation : reactivateMutation;
        try {
            await mutation.mutateAsync({ id: userId, reason });
            toast.success(action === "suspend" ? "Account suspended" : "Account reactivated", {
                message: ownerName,
            });
            setShowAction(false);
            setActionError("");
            queryClient.invalidateQueries();
        } catch (err) {
            const parsed = parseApiError(err, `Failed to ${action} account.`);
            setActionError(parsed.message);
            toast.error(`Could not ${action} account`, { message: parsed.message });
        }
    };

    return (
        <>
            <div className="space-y-4 p-4 sm:p-6 lg:p-8" data-owner-id={id}>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        {profile.profile_image ? (
                            <img
                                src={profile.profile_image}
                                alt={ownerName}
                                className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16"
                            />
                        ) : (
                            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white sm:h-16 sm:w-16">
                                {initials(ownerName)}
                            </span>
                        )}
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <h1 className="text-base font-extrabold text-slate-900 sm:text-lg">{ownerName}</h1>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${ownerVerified
                                        ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                                        : "border-slate-200 bg-slate-100 text-slate-600"
                                        }`}
                                >
                                    {ownerVerificationLabel}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                        }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-amber-500"}`} />
                                    {isActive ? "Active" : "Suspended"}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Property Owner &bull; {profile.display_id ? `${profile.display_id} • ` : ""}Member since {memberSince}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5 break-all">
                                    <Mail size={13} className="flex-shrink-0" /> {normalizeText(profile.email)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Phone size={13} className="flex-shrink-0" /> {normalizeText(profile.phone)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setActionError("");
                            setShowAction(true);
                        }}
                        disabled={!profile.user_id}
                        className={`flex h-fit w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-shrink-0 ${isActive
                            ? "border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"
                            : "border-green-100 bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                    >
                        {isActive ? <Ban size={14} /> : <RotateCcw size={14} />}
                        {isActive ? "Suspend" : "Reactivate"}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {statCards.map((s, i) => (
                        <div
                            key={s.label}
                            className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-slate-500">{s.label}</p>
                                <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}>
                                    <s.icon size={16} />
                                </span>
                            </div>
                            <p className="mt-2 break-words text-lg font-bold text-slate-900 sm:text-xl">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="inline-flex w-full items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 rounded-xl px-5 py-2 text-xs font-semibold transition-colors sm:flex-none ${activeTab === tab ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            {tab}
                            {tab === "Properties" && properties.length > 0 ? ` (${properties.length})` : ""}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === "Overview" && (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                                {personalDetails.map((detail) => (
                                    <div key={detail.label} className="min-w-0">
                                        <p className="text-xs text-slate-400">{detail.label}</p>
                                        <p className="mt-1 break-words text-sm font-semibold text-slate-900">{detail.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            {/* Email card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <CheckCircle2 size={16} className="text-slate-900" /> Email Address
                                    </h3>
                                    <span
                                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${emailVerifiedVia
                                            ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                                            : "border-slate-200 bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {emailVerifiedVia ? "Verified" : "Unverified"}
                                    </span>
                                </div>
                                <p className="mt-3 text-xs text-slate-400">
                                    {emailVerifiedVia ? `Verified via ${humanize(emailVerifiedVia)}` : "Email not verified yet"}
                                </p>
                                <p className="mt-1 break-all text-sm font-semibold text-slate-900">{normalizeText(emailAddress)}</p>
                            </div>

                            {/* KYC card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <ShieldCheck size={16} className="text-blue-600" /> KYC / Identity
                                    </h3>
                                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${kycStyle}`}>
                                        {kycLabel}
                                    </span>
                                </div>

                                {kycCard ? (
                                    <>
                                        <p className="mt-3 text-xs text-slate-400">
                                            {kycCard.submitted_at
                                                ? `Submitted ${formatDate(kycCard.submitted_at)}`
                                                : "Identity documents submitted for review"}
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">
                                            {humanize(kycCard.document_type) !== "N/A"
                                                ? humanize(kycCard.document_type)
                                                : "Identity document"}
                                        </p>
                                        {kycImage && (
                                            <img
                                                src={kycImage}
                                                alt="Identity document"
                                                className="mt-3 w-full rounded-xl border border-slate-100 object-cover"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <p className="mt-3 rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
                                        This owner has not submitted any identity documents yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Properties */}
                {activeTab === "Properties" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Properties</h3>
                            <span className="text-xs text-slate-500">{stats.total_properties ?? properties.length} total</span>
                        </div>

                        {properties.length === 0 ? (
                            <div className="mt-4 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                                This owner has not listed any properties yet.
                            </div>
                        ) : (
                            <>
                                {/* Desktop table */}
                                <div className="mt-4 hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[640px] border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                                <th className="pb-3 pr-4 font-medium">Property</th>
                                                <th className="pb-3 pr-4 font-medium">City</th>
                                                <th className="pb-3 pr-4 font-medium">Price</th>
                                                <th className="pb-3 pr-4 font-medium">Status</th>
                                                <th className="pb-3 pr-4 font-medium">Occupancy</th>
                                                <th className="pb-3 pr-4 font-medium">Submitted</th>
                                                <th className="pb-3 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {properties.map((p, index) => {
                                                const status = getPropertyStatus(p.status);
                                                return (
                                                    <tr key={p.id ?? index} className="text-xs">
                                                        <td className="max-w-[240px] py-4 pr-4">
                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {p.title || "Untitled"}
                                                            </p>
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-700">{normalizeText(p.city)}</td>
                                                        <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-900">
                                                            {formatMoney(p.price)}
                                                        </td>
                                                        <td className="py-4 pr-4">
                                                            <span
                                                                className={`whitespace-nowrap rounded-full px-2.5 py-1 font-medium ${PROPERTY_STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600 border border-slate-200"}`}
                                                            >
                                                                {status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 pr-4 text-slate-700">{humanize(p.occupancy_status)}</td>
                                                        <td className="whitespace-nowrap py-4 pr-4 text-slate-500">
                                                            {formatDate(p.created_at)}
                                                        </td>
                                                        <td className="py-4">
                                                            {p.id && (
                                                                <Link
                                                                    to={`/admin/properties/${p.id}`}
                                                                    className="font-medium text-blue-600 hover:text-blue-700"
                                                                >
                                                                    View
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile cards */}
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
                                    {properties.map((p, index) => {
                                        const status = getPropertyStatus(p.status);
                                        return (
                                            <div key={p.id ?? index} className="rounded-xl border border-slate-200 p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="min-w-0 text-sm font-semibold text-slate-900">
                                                        {p.title || "Untitled"}
                                                    </p>
                                                    <span
                                                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${PROPERTY_STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600 border border-slate-200"}`}
                                                    >
                                                        {status}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">{normalizeText(p.city)}</p>
                                                <p className="mt-2 text-sm font-medium text-slate-900">{formatMoney(p.price)}</p>
                                                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                                                    <span className="text-slate-500">
                                                        {humanize(p.occupancy_status)} · {formatDate(p.created_at)}
                                                    </span>
                                                    {p.id && (
                                                        <Link
                                                            to={`/admin/properties/${p.id}`}
                                                            className="font-medium text-blue-600 hover:text-blue-700"
                                                        >
                                                            View
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Bank */}
                {activeTab === "Bank" && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        {bankAccounts.length === 0 ? (
                            <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                                No bank account information is available for this owner yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {bankAccounts.map((acct, index) => (
                                    <div key={acct.id ?? index} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                            <Landmark size={18} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {normalizeText(acct.bank_name)}
                                                </p>
                                                {(acct.is_default || acct.is_primary) && (
                                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500">{normalizeText(acct.account_name)}</p>
                                            <p className="mt-1 font-mono text-sm tracking-wide text-slate-800">
                                                {maskAccount(acct.account_number)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Suspend / Reactivate */}
            <ConfirmModal
                open={showAction && action === "suspend"}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="danger"
                icon={<Ban size={26} />}
                title="Suspend Account"
                description={
                    <>
                        Suspending <span className="font-medium text-slate-800">{ownerName}</span>
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
                open={showAction && action === "reactivate"}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="success"
                icon={<RotateCcw size={26} />}
                title="Reactivate Account"
                description={
                    <>
                        Reactivating <span className="font-medium text-slate-800">{ownerName}</span>
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

export default SinglePropertyOwners;