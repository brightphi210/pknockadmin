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

const activityLog = [
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
];

const inspections = [
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
];

const upcoming = [
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
];

const locationOf = (property: string) =>
    property.includes("Lekki")
        ? "Lekki Phase 1, Lagos"
        : property.includes("Ikeja")
            ? "Ikeja, Lagos"
            : property.includes("Surulere")
                ? "Surulere, Lagos"
                : property.includes("Apapa")
                    ? "Apapa, Lagos"
                    : "Wuse, Abuja";

const InspectionStatus = ({ status }: { status: string }) => (
    <span
        className={`inline-flex whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "Completed"
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
            }`}
    >
        {status}
    </span>
);

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
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <button
                            className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>

                        <div className="flex items-start gap-3 min-w-0">
                            <img
                                src="https://i.pravatar.cc/100?img=12"
                                alt="Marcus Adeyemi"
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
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

                    <div className="flex items-center gap-3 md:flex-shrink-0">
                        <button className="flex-1 md:flex-none px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg whitespace-nowrap">
                            Reset Password
                        </button>
                        {isSuspended ? (
                            <button
                                onClick={() => setShowReactivateModal(true)}
                                className="flex-1 md:flex-none justify-center px-4 py-2 border border-green-200 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg flex items-center gap-1.5"
                            >
                                <span className="text-lg leading-none">↻</span>
                                Reactivate
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSuspendModal(true)}
                                className="flex-1 md:flex-none justify-center px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg flex items-center gap-1.5"
                            >
                                <span className="text-lg leading-none">⊘</span>
                                Suspend
                            </button>
                        )}
                    </div>
                </div>

                {/* Contact info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5 break-all">
                        <Mail size={16} className="flex-shrink-0" />
                        m.adeyemi@pknock.com
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Phone size={16} className="flex-shrink-0" />
                        +234 801 234 5678
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="flex-shrink-0" />
                        Lagos Island, Victoria Island
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="px-4 sm:px-6 py-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">50</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={20} className="text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">47</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={20} className="text-gray-400" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">3</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <Clock size={20} className="text-amber-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">4.8</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <StarIcon size={20} className="text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6">
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
                {activeTab === "overview" ? (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                        {/* Personal Info */}
                        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
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
                                    <p className="font-medium text-gray-900 mt-0.5">Lagos State</p>
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
                            <h3 className="font-semibold text-gray-900 mb-4">Activity Log</h3>
                            <div className="space-y-4">
                                {activityLog.map((item, i) => (
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
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                        {/* Inspections List */}
                        <div className="xl:col-span-2 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <div className="relative w-full sm:max-w-sm">
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

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-gray-500 font-medium whitespace-nowrap">
                                            <th className="px-5 py-3">Inspection ID</th>
                                            <th className="px-5 py-3">Property</th>
                                            <th className="px-5 py-3">Type</th>
                                            <th className="px-5 py-3">Date & Time</th>
                                            <th className="px-5 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {inspections.map((insp, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                                                    {insp.id}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <p className="text-gray-900 font-medium truncate max-w-[200px]">
                                                        {insp.property}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin size={12} />
                                                        {locationOf(insp.property)}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="inline-flex whitespace-nowrap px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs">
                                                        {insp.type}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                                                    {insp.date}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <InspectionStatus status={insp.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                                {inspections.map((insp, i) => (
                                    <div key={i} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-medium text-gray-500">
                                                {insp.id}
                                            </p>
                                            <InspectionStatus status={insp.status} />
                                        </div>
                                        <p className="mt-2 font-medium text-gray-900">
                                            {insp.property}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <MapPin size={12} className="flex-shrink-0" />
                                            {locationOf(insp.property)}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
                                            <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                                {insp.type}
                                            </span>
                                            <span className="text-gray-500">{insp.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calendar + Upcoming */}
                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">July 2025</h3>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                        <div key={i} className="py-1 text-gray-400 font-medium">
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

                            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                                <h3 className="font-semibold text-gray-900 mb-3">Upcoming</h3>
                                <div className="space-y-3">
                                    {upcoming.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100"
                                        >
                                            <div className="w-1 rounded-full bg-blue-500 flex-shrink-0" />
                                            <div className="min-w-0">
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
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
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

export default SingleVerificationOfficer;