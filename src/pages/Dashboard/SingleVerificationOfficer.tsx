import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    Phone,
    Search,
    Star,
    Star as StarIcon,
} from "lucide-react";
import { useState } from "react";

const SingleVerificationOfficer = () => {
    const [activeTab, setActiveTab] = useState<"overview" | "inspections">(
        "overview"
    );
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showReactivateModal, setShowReactivateModal] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>

                        <div className="flex items-center gap-3">
                            <img
                                src="https://i.pravatar.cc/100?img=12"
                                alt="Marcus Adeyemi"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-semibold text-gray-900">
                                        Marcus Adeyemi
                                    </h1>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isSuspended
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {isSuspended ? "Suspended" : "Active"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    P-Knock Verification Officer · PVO since Nov 20, 2023
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

                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg">
                            Reset Password
                        </button>
                        {isSuspended ? (
                            <button
                                onClick={() => setShowReactivateModal(true)}
                                className="px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg flex items-center gap-1.5"
                            >
                                <span className="text-lg leading-none">↻</span>
                                Reactivate
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSuspendModal(true)}
                                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg flex items-center gap-1.5"
                            >
                                <span className="text-lg leading-none">⊘</span>
                                Suspend
                            </button>
                        )}
                    </div>
                </div>

                {/* Contact info */}
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Mail size={16} />
                        m.adeyemi@pknock.com
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Phone size={16} />
                        +234 801 234 5678
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} />
                        Lagos Island, Victoria Island
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-5">
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">50</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">47</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-gray-400" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">3</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <Clock size={20} className="text-amber-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">4.8</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                            <StarIcon size={20} className="text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "overview"
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("inspections")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "inspections"
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Inspections
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
                {activeTab === "overview" ? (
                    <div className="grid grid-cols-3 gap-6">
                        {/* Personal Info */}
                        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                <div>
                                    <p className="text-sm text-gray-500">First Name</p>
                                    <p className="font-medium text-gray-900 mt-0.5">Adewale</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Name</p>
                                    <p className="font-medium text-gray-900 mt-0.5">Okonkwo</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-900 mt-0.5">
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
                                    <p className="font-medium text-gray-900 mt-0.5">Lagos State</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nationality</p>
                                    <p className="font-medium text-gray-900 mt-0.5">Nigeria</p>
                                </div>
                                <div className="col-span-2">
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
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Activity Log</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Verification completed",
                                        desc: "3BR Lekki Phase 1 — passed all checks",
                                        time: "2 hrs ago",
                                    },
                                    {
                                        title: "Property assigned",
                                        desc: "2BR Flat, Yaba — new inspection request",
                                        time: "2 hrs ago",
                                    },
                                    {
                                        title: "Verification completed",
                                        desc: "3BR Lekki Phase 1 — passed all checks",
                                        time: "2 hrs ago",
                                    },
                                    {
                                        title: "Verification completed",
                                        desc: "3BR Lekki Phase 1 — passed all checks",
                                        time: "2 hrs ago",
                                    },
                                    {
                                        title: "Verification completed",
                                        desc: "3BR Lekki Phase 1 — passed all checks",
                                        time: "2 hrs ago",
                                    },
                                    {
                                        title: "Verification completed",
                                        desc: "3BR Lekki Phase 1 — passed all checks",
                                        time: "2 hrs ago",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-400 whitespace-nowrap">
                                            {item.time}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Inspections Tab */
                    <div className="grid grid-cols-3 gap-6">
                        {/* Inspections List */}
                        <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <div className="relative max-w-sm">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-gray-500 font-medium">
                                        <th className="px-5 py-3">Inspection ID</th>
                                        <th className="px-5 py-3">Property</th>
                                        <th className="px-5 py-3">Type</th>
                                        <th className="px-5 py-3">Date & Time</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        {
                                            id: "INS – 001",
                                            property: "3 Bedroom Apartment at Lekki Phase 1, Lagos",
                                            type: "Apartment",
                                            date: "Jul 25, 2026 • 09:03am",
                                            status: "Upcoming Inspection",
                                        },
                                        {
                                            id: "INS – 005",
                                            property: "Retail Shop at Ikeja City Mall",
                                            type: "Retail",
                                            date: "Aug 2, 2025 • 02:00pm",
                                            status: "Upcoming Inspection",
                                        },
                                        {
                                            id: "INS – 006",
                                            property: "2 Bedroom Flat in Surulere",
                                            type: "Flat",
                                            date: "Aug 11, 2025 • 05:00pm",
                                            status: "Upcoming Inspection",
                                        },
                                        {
                                            id: "INS – 007",
                                            property: "Industrial Warehouse in Apapa",
                                            type: "Warehouse",
                                            date: "Jul 25, 2026 • 09:03am",
                                            status: "Completed",
                                        },
                                        {
                                            id: "INS – 008",
                                            property: "Serviced 1 Bedroom Apartment",
                                            type: "Apartment",
                                            date: "Jul 25, 2026 • 09:03am",
                                            status: "Completed",
                                        },
                                        {
                                            id: "INS – 009",
                                            property: "Spacious Conference Hall in Wuse, Abuja",
                                            type: "Conference Hall",
                                            date: "Jul 25, 2026 • 09:03am",
                                            status: "Completed",
                                        },
                                    ].map((insp, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-5 py-3.5 font-medium text-gray-900">
                                                {insp.id}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-gray-900 font-medium truncate max-w-[200px]">
                                                    {insp.property}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin size={12} />
                                                    {insp.property.includes("Lekki")
                                                        ? "Lekki Phase 1, Lagos"
                                                        : insp.property.includes("Ikeja")
                                                            ? "Ikeja, Lagos"
                                                            : insp.property.includes("Surulere")
                                                                ? "Surulere, Lagos"
                                                                : insp.property.includes("Apapa")
                                                                    ? "Apapa, Lagos"
                                                                    : "Wuse, Abuja"}
                                                </p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs">
                                                    {insp.type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">{insp.date}</td>
                                            <td className="px-5 py-3.5">
                                                <span
                                                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${insp.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {insp.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Calendar + Upcoming */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">July 2025</h3>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                                        <div key={d} className="py-1 text-gray-400 font-medium">
                                            {d}
                                        </div>
                                    ))}
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                        const isSelected = day === 28;
                                        const hasDot = [2, 11, 30].includes(day);
                                        return (
                                            <div
                                                key={day}
                                                className={`relative py-1.5 rounded-full ${isSelected
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

                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-3">Upcoming</h3>
                                <div className="space-y-3">
                                    {[
                                        {
                                            title: "3 Bedroom Apartment at Lekki Phase 1",
                                            time: "Jul 25, 2026 • 09:03 AM",
                                        },
                                        {
                                            title: "Retail Shop at Ikeja City Mall",
                                            time: "Aug 2, 2025 • 2:00 PM",
                                        },
                                        {
                                            title: "2 Bedroom Flat in Surulere",
                                            time: "Aug 11, 2025 • 5:00 PM",
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100"
                                        >
                                            <div className="w-1 rounded-full bg-blue-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {item.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Suspend Modal */}
            {showSuspendModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-red-600">⊘</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Suspend Account
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-5">
                            Suspending Emeka Nwosu's account will hide all their properties
                            from the platform and prevent them from submitting new listings.
                        </p>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Reason for suspension <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                placeholder="e.g. Multiple complaints received, pending investigation..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
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
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-green-600">✓</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Reactivate Account
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-5">
                            Reactivating Emeka Nwosu's account will display all their
                            properties on the platform and they can now submit new listings.
                        </p>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Reason for reactivating <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                placeholder="e.g. Multiple complaints received, pending investigation..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
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

export default SingleVerificationOfficer;