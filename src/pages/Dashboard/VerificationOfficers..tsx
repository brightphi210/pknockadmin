import { Plus, Search } from "lucide-react";
import { useState } from "react";

const officers = [
    {
        id: "PVO-2024-001",
        name: "Olumide Fashola",
        coverage: "Lagos Island, Victoria Island",
        status: "Suspended",
        assigned: 4,
        completed: 25,
        pending: 2,
        lastActive: "2 hours ago",
    },
    {
        id: "PVO-2024-001",
        name: "Olumide Fashola",
        coverage: "Lagos Island, Victoria Island",
        status: "Active",
        assigned: 4,
        completed: 25,
        pending: 2,
        lastActive: "2 hours ago",
    },
    {
        id: "PVO-2024-002",
        name: "Ifeoma Okoye",
        coverage: "Ikeja, Allen Avenue",
        status: "Active",
        assigned: 3,
        completed: 40,
        pending: 1,
        lastActive: "30 minutes ago",
    },
    {
        id: "PVO-2024-003",
        name: "Chinedu Eze",
        coverage: "Surulere, Ojuelegba",
        status: "Active",
        assigned: 5,
        completed: 10,
        pending: 0,
        lastActive: "1 hour ago",
    },
    {
        id: "PVO-2024-004",
        name: "Amara Nwosu",
        coverage: "Ajah, Lekki",
        status: "Suspended",
        assigned: 2,
        completed: 18,
        pending: 3,
        lastActive: "3 hours ago",
    },
    {
        id: "PVO-2024-005",
        name: "Tunde Balogun",
        coverage: "Yaba, Tech Hub",
        status: "Active",
        assigned: 6,
        completed: 55,
        pending: 4,
        lastActive: "45 minutes ago",
    },
    {
        id: "PVO-2024-006",
        name: "Ngozi Okafor",
        coverage: "Maryland, Ikeja",
        status: "Active",
        assigned: 7,
        completed: 70,
        pending: 2,
        lastActive: "15 minutes ago",
    },
    {
        id: "PVO-2024-007",
        name: "Emeka Obi",
        coverage: "Festac Town, Amuwo-Odofin",
        status: "Suspended",
        assigned: 1,
        completed: 5,
        pending: 0,
        lastActive: "4 hours ago",
    },
    {
        id: "PVO-2024-008",
        name: "Halima Yusuf",
        coverage: "Gbagada, Lagos Mainland",
        status: "Active",
        assigned: 3,
        completed: 30,
        pending: 1,
        lastActive: "20 minutes ago",
    },
    {
        id: "PVO-2024-009",
        name: "Bukola Ade",
        coverage: "Ikeja GRA, Ikeja",
        status: "Suspended",
        assigned: 4,
        completed: 22,
        pending: 2,
        lastActive: "5 hours ago",
    },
    {
        id: "PVO-2024-010",
        name: "Segun Ajayi",
        coverage: "Victoria Island, Lagos",
        status: "Active",
        assigned: 5,
        completed: 33,
        pending: 1,
        lastActive: "10 minutes ago",
    },
];

const StatusBadge = ({ status }: { status: string }) => {
    const isActive = status === "Active";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
                }`}
        >
            {status}
        </span>
    );
};

const VerificationOfficers = () => {
    const [search, setSearch] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Verification Officers
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        5 officers total · 4 active · 1 inactive
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={18} />
                    Create Verification Officer
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-500 font-medium">
                                <th className="px-6 py-3">Officer</th>
                                <th className="px-6 py-3">PVO ID</th>
                                <th className="px-6 py-3">Coverage Area</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Assigned</th>
                                <th className="px-6 py-3 text-center">Completed</th>
                                <th className="px-6 py-3 text-center">Pending</th>
                                <th className="px-6 py-3">Last Active</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {officers.map((officer, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {officer.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{officer.id}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {officer.coverage}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={officer.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-700">
                                        {officer.assigned}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-700">
                                        {officer.completed}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-700">
                                        {officer.pending}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {officer.lastActive}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                                                View
                                            </button>
                                            {officer.status === "Active" ? (
                                                <button className="text-red-600 hover:text-red-700 font-medium">
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button className="text-green-600 hover:text-green-700 font-medium">
                                                    Reactivate
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">1 of 10 pages</p>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 rounded-md bg-gray-900 text-white text-sm font-medium">
                            1
                        </button>
                        <button className="w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 text-sm">
                            2
                        </button>
                        <button className="w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 text-sm">
                            3
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
                        <div className="flex items-center justify-between p-5 border-b">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Create Verification Officer
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    PVO accounts can only be created by administrators.
                                    <br />
                                    Login credentials will be generated automatically.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Avatar placeholder */}
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-semibold">
                                    SK
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter First Name"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Last Name"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="officer@example.com"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+234 000 0000 000"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        PVO ID
                                    </label>
                                    <input
                                        type="text"
                                        value="Auto-Generated"
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State of Origin
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select</option>
                                        <option>Lagos</option>
                                        <option>Abuja</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nationality
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select</option>
                                        <option>Nigeria</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coverage Area
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Select</option>
                                    <option>Lagos Island, Victoria Island</option>
                                    <option>Ikeja, Allen Avenue</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-5 border-t">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setShowSuccessModal(true);
                                }}
                                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            PVO Account Created Successfully
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Login credentials have been sent to the email address provided
                            during account creation.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left mb-6">
                            <p className="text-sm text-amber-800">
                                <span className="font-medium">Security notice</span>
                                <br />
                                The temporary password has been sent to the officer's email. For
                                security reasons, it is not displayed here.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationOfficers;