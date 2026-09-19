import {
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    Mail,
    MapPin,
    Phone,
    Star,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const KycActions = () => (
    <div className="grid grid-cols-3 gap-2">
        <button className="py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg">
            Approve
        </button>
        <button className="py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs sm:text-sm font-medium rounded-lg">
            Reject
        </button>
        <button className="py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs sm:text-sm font-medium rounded-lg">
            Need Info
        </button>
    </div>
);

const SingleUser = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"overview" | "inspections">(
        "overview"
    );
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);

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
                                alt="Amara Okonkwo"
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        Amara Okonkwo
                                    </h1>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                        Pending
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    USR–001 · Joined Mar 12, 2026
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
                                    <span className="text-sm text-gray-600 ml-1">4.9 rating</span>
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
                        <Mail size={16} className="flex-shrink-0" /> amara@gmail.com
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Phone size={16} className="flex-shrink-0" /> +234 801 234 5678
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="flex-shrink-0" /> Lagos Island, Victoria Island
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
                        {/* Left – Personal info + Activity */}
                        <div className="xl:col-span-2 space-y-5 min-w-0">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                    <div>
                                        <p className="text-sm text-gray-500">First Name</p>
                                        <p className="font-medium text-gray-900 mt-0.5">Adewale</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Name</p>
                                        <p className="font-medium text-gray-900 mt-0.5">Okonkwo</p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-500">Email Address</p>
                                        <p className="font-medium text-gray-900 mt-0.5 break-all">
                                            adewale@example.com
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            +234 800 000 0000
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Gender</p>
                                        <p className="font-medium text-gray-900 mt-0.5">Male (M)</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Date of Birth (Optional)
                                        </p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            23 May, 1998
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">State of Origin</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            Lagos State
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nationality</p>
                                        <p className="font-medium text-gray-900 mt-0.5">Nigeria</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-gray-500">Residential Address</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            14 Adeola Hopewell, Victoria Island, Lagos
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="font-medium text-gray-900 mt-0.5">
                                            Nov 20, 2023
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Log */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Activity Log
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            title: "Verification completed",
                                            desc: "3BR Lekki Phase 1 — passed all checks",
                                        },
                                        {
                                            title: "Property assigned",
                                            desc: "2BR Flat, Yaba — new inspection request",
                                        },
                                        {
                                            title: "Verification completed",
                                            desc: "3BR Lekki Phase 1 — passed all checks",
                                        },
                                        {
                                            title: "Verification completed",
                                            desc: "3BR Lekki Phase 1 — passed all checks",
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500">{item.desc}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 whitespace-nowrap">
                                                2 hrs ago
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right – KYC sections */}
                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            {/* Email */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-green-600" />
                                        <span className="font-medium text-gray-900">
                                            Email Address
                                        </span>
                                    </div>
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        Verified
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Verified via OTP</p>
                                <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                                    adewale@example.com
                                </p>
                            </div>

                            {/* Government ID */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-blue-600" />
                                        <span className="font-medium text-gray-900">
                                            Government ID
                                        </span>
                                    </div>
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                        Pending
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">
                                    Identity documents submitted for review
                                </p>
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="font-medium text-gray-900">
                                        National Identity Card
                                    </span>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=250&fit=crop"
                                    alt="ID Card"
                                    className="w-full rounded-lg border border-gray-200 mb-4"
                                />
                                <KycActions />
                            </div>

                            {/* Photo */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:col-span-2 xl:col-span-1">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-blue-600" />
                                        <span className="font-medium text-gray-900">Photo</span>
                                    </div>
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                        Pending
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">Submitted for review</p>
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="font-medium text-gray-900">Photo</span>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </div>
                                <img
                                    src="https://i.pravatar.cc/300?img=12"
                                    alt="User photo"
                                    className="w-full max-w-[200px] mx-auto rounded-lg border border-gray-200 mb-4"
                                />
                                <div className="md:max-w-sm md:mx-auto xl:max-w-none">
                                    <KycActions />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "inspections" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center text-gray-500">
                        Inspections list for this user will appear here.
                    </div>
                )}
            </div>

            {/* Suspend Modal */}
            {showSuspendModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-red-600">⊘</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Suspend Account
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-5">
                            The user will be blocked from the platform and notified by email.
                        </p>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Reason for suspension <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                placeholder="State the reason for suspension"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            />
                        </div>
                        <div className="flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                onClick={() => setShowSuspendModal(false)}
                                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsSuspended(true);
                                    setShowSuspendModal(false);
                                }}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                            >
                                Suspend Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reactivate Modal */}
            {showReactivateModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-green-600">👍</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Reactivate Account
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-5">
                            The user's account will be reactivated and can perform all
                            activities on the platform.
                        </p>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Reason for reactivating <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                placeholder="State reason for reactivating"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            />
                        </div>
                        <div className="flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                onClick={() => setShowReactivateModal(false)}
                                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsSuspended(false);
                                    setShowReactivateModal(false);
                                }}
                                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                            >
                                Reactivate Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SingleUser;