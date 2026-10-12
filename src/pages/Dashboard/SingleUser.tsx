import {
    ArrowLeft,
    CheckCircle2,
    Mail,
    MapPin,
    Phone,
    Star,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/UI/ConfirmModal";
import { useGetSingleUser } from "../../hooks/queries/allQueries";

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

const normalizeText = (value?: string | null) =>
    value && value.trim() ? value : "N/A";

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex min-h-[360px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                !
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const SingleUser = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<"overview" | "inspections">("overview");
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);

    const { userData, isLoading, isError } = useGetSingleUser(id || "");
    const user = userData?.data ?? userData ?? {};

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
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-sm text-slate-500">
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

    if (!user || Object.keys(user).length === 0) {
        return (
            <EmptyState
                title="No user data available"
                description="This user does not have any profile information yet."
            />
        );
    }

    const fullName =
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Unknown User";
    const kycStatus = user?.kyc_status ? user.kyc_status : "Pending";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"
                            aria-label="Back to users"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>

                        <div className="flex items-start gap-3 min-w-0">
                            <img
                                src="https://i.pravatar.cc/100?img=33"
                                alt={fullName}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        {fullName}
                                    </h1>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                        {kycStatus}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {user?.display_id || user?.id || "User"} · Joined{" "}
                                    {formatDate(user?.registered_at || user?.last_seen_at)}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={
                                                i <= 4
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">
                                        4.9 rating
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:flex-shrink-0">
                        <button className="flex-1 md:flex-none px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg">
                            Approve KYC
                        </button>
                        {isSuspended ? (
                            <button
                                onClick={() => setShowReactivateModal(true)}
                                className="flex-1 md:flex-none px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg"
                            >
                                Reactivate
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSuspendModal(true)}
                                className="flex-1 md:flex-none justify-center px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg flex items-center gap-1.5"
                            >
                                <span>⊘</span> Suspend
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5 break-all">
                        <Mail size={16} className="flex-shrink-0" />{" "}
                        {normalizeText(user?.email)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Phone size={16} className="flex-shrink-0" />{" "}
                        {normalizeText(user?.phone)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="flex-shrink-0" />{" "}
                        {normalizeText(user?.state_of_origin)}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6 pt-5">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "overview"
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("inspections")}
                        className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "inspections"
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Inspections
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 py-5">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                        <div className="xl:col-span-2 space-y-5 min-w-0">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                    <div>
                                        <p className="text-sm text-gray-500">First Name</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {normalizeText(user?.first_name)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Name</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {normalizeText(user?.last_name)}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-500">Email Address</p>
                                        <p className="font-medium text-gray-900 mt-0.5 break-all">
                                            {normalizeText(user?.email)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {normalizeText(user?.phone)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Gender</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {normalizeText(user?.gender)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date of Birth</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {formatDate(user?.date_of_birth)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">State of Origin</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {normalizeText(user?.state_of_origin)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nationality</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {normalizeText(user?.nationality)}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            {formatDate(user?.registered_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-green-600" />
                                        <span className="font-medium text-gray-900">
                                            Email Address
                                        </span>
                                    </div>
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        {user?.email_verified ? "Verified" : "Pending"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Verified via OTP</p>
                                <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                                    {normalizeText(user?.email)}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-blue-600" />
                                        <span className="font-medium text-gray-900">
                                            Phone Number
                                        </span>
                                    </div>
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                        {user?.phone_verified ? "Verified" : "Pending"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Phone verification status</p>
                                <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                                    {normalizeText(user?.phone)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "inspections" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center text-gray-500">
                        {Number(user?.inspection_count ?? 0) > 0
                            ? `${user.inspection_count} inspections recorded for this user.`
                            : "No inspection records found for this user yet."}
                    </div>
                )}
            </div>

            <ConfirmModal
                open={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                onConfirm={() => {
                    setIsSuspended(true);
                    setShowSuspendModal(false);
                }}
                title="Suspend Account"
                description="The user will be blocked from the platform and notified by email."
                icon={<span className="text-2xl text-red-600">⊘</span>}
                tone="danger"
                confirmLabel="Suspend Account"
                reasonLabel="Reason for suspension"
                reasonPlaceholder="State the reason for suspension"
            />

            <ConfirmModal
                open={showReactivateModal}
                onClose={() => setShowReactivateModal(false)}
                onConfirm={() => {
                    setIsSuspended(false);
                    setShowReactivateModal(false);
                }}
                title="Reactivate Account"
                description="The user's account will be reactivated and can perform all activities on the platform."
                icon={<span className="text-2xl text-emerald-600">👍</span>}
                tone="success"
                confirmLabel="Reactivate Account"
                reasonLabel="Reason for reactivating"
                reasonPlaceholder="State the reason for reactivating"
            />
        </div>
    );
};

export default SingleUser;