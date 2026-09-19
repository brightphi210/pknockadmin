import { Calendar, Search } from "lucide-react";
import { useState } from "react";

const rentalPayments = [
    {
        id: "TXN-2026-001",
        user: "Amara Okonkwo",
        property: "3 Bedroom Apartment at Lekki Phase 1, Lagos",
        owner: "Kunle Adebayo",
        amount: "₦650,000",
        fee: "₦32,500",
        payout: "₦617,500",
        status: "Successful",
        date: "Aug 25, 2026 • 09:03am",
    },
    {
        id: "TXN-2026-003",
        user: "Ibrahim Musa",
        property: "Luxury Studio at Ikoyi",
        owner: "Tolu Akinyemi",
        amount: "₦780,000",
        fee: "₦39,000",
        payout: "₦741,000",
        status: "Successful",
        date: "Aug 26, 2026 • 02:45pm",
    },
    {
        id: "TXN-2026-002",
        user: "Chinonso Ejike",
        property: "2 Bedroom Flat at Victoria Island, Lagos",
        owner: "Ngozi Emeka",
        amount: "₦480,000",
        fee: "₦24,000",
        payout: "₦456,000",
        status: "Pending",
        date: "Aug 26, 2026 • 11:15am",
    },
    {
        id: "TXN-2026-004",
        user: "Folake Adeyemi",
        property: "4 Bedroom Duplex at Banana Island, Lagos",
        owner: "Emeka Obi",
        amount: "₦1,200,000",
        fee: "₦60,000",
        payout: "₦1,140,000",
        status: "Failed",
        date: "Aug 27, 2026 • 08:20am",
    },
    {
        id: "TXN-2026-005",
        user: "Nkechi Nwosu",
        property: "1 Bedroom Flat at Yaba",
        owner: "Seyi Balogun",
        amount: "₦350,000",
        fee: "₦17,500",
        payout: "₦332,500",
        status: "Successful",
        date: "Aug 27, 2026 • 04:10pm",
    },
    {
        id: "TXN-2026-006",
        user: "Tunde Alabi",
        property: "3 Bedroom Bungalow at Surulere, Lagos",
        owner: "Chika Okafor",
        amount: "₦540,000",
        fee: "₦27,000",
        payout: "₦513,000",
        status: "Pending",
        date: "Aug 28, 2026 • 10:05am",
    },
    {
        id: "TXN-2026-007",
        user: "Amaka Eze",
        property: "Studio Apartment at Ikeja",
        owner: "Femi Ojo",
        amount: "₦420,000",
        fee: "₦21,000",
        payout: "₦399,000",
        status: "Successful",
        date: "Aug 28, 2026 • 03:33pm",
    },
];

const withdrawals = [
    {
        id: "WDR-2026-001",
        owner: "Kunle Adebayo",
        property: "3 Bedroom Apartment at Lekki Phase 1, Lagos",
        bank: "GT Bank",
        account: "0123456789",
        amount: "₦650,000",
        fee: "₦100",
        net: "₦649,900",
        status: "Successful",
        date: "Aug 25, 2026 • 09:03am",
    },
    {
        id: "WDR-2026-002",
        owner: "Adanna Nwosu",
        property: "2 Bedroom Flat at Ikeja GRA",
        bank: "Access Bank",
        account: "08012345678",
        amount: "₦450,000",
        fee: "₦50",
        net: "₦449,950",
        status: "Pending",
        date: "Sep 2, 2026 • 11:15am",
    },
    {
        id: "WDR-2026-003",
        owner: "Chinonso Eze",
        property: "4 Bedroom Duplex at Victoria Island, Lagos",
        bank: "First Bank",
        account: "07098765432",
        amount: "₦1,200,000",
        fee: "₦150",
        net: "₦1,199,850",
        status: "Successful",
        date: "Sep 5, 2026 • 02:45pm",
    },
    {
        id: "WDR-2026-004",
        owner: "Bola Akinyemi",
        property: "Studio Apartment at Yaba",
        bank: "UBA",
        account: "08123456789",
        amount: "₦300,000",
        fee: "₦30",
        net: "₦299,970",
        status: "Failed",
        date: "Sep 10, 2026 • 08:00am",
    },
    {
        id: "WDR-2026-005",
        owner: "Emeka Okafor",
        property: "3 Bedroom Townhouse at Lekki Phase 2, Lagos",
        bank: "Zenith Bank",
        account: "09087654321",
        amount: "₦700,000",
        fee: "₦120",
        net: "₦699,880",
        status: "Successful",
        date: "Sep 12, 2026 • 04:30pm",
    },
    {
        id: "WDR-2026-006",
        owner: "Ifunanya Obi",
        property: "1 Bedroom Flat at Surulere",
        bank: "Fidelity Bank",
        account: "08109876543",
        amount: "₦350,000",
        fee: "₦75",
        net: "₦349,925",
        status: "Pending",
        date: "Sep 15, 2026 • 10:20am",
    },
    {
        id: "WDR-2026-007",
        owner: "Tunde Balogun",
        property: "5 Bedroom Mansion at Banana Island, Lagos",
        bank: "Stanbic IBTC",
        account: "07012349876",
        amount: "₦5,000,000",
        fee: "₦500",
        net: "₦4,999,500",
        status: "Successful",
        date: "Sep 20, 2026 • 01:00pm",
    },
    {
        id: "WDR-2026-008",
        owner: "Amara Uche",
        property: "2 Bedroom Apartment at Maryland, Lagos",
        bank: "Keystone Bank",
        account: "08087654321",
        amount: "₦400,000",
        fee: "₦65",
        net: "₦399,935",
        status: "Failed",
        date: "Sep 22, 2026 • 09:45am",
    },
    {
        id: "WDR-2026-009",
        owner: "Yusuf Abdullahi",
        property: "3 Bedroom Flat at Magodo",
        bank: "Polaris Bank",
        account: "08176543210",
        amount: "₦600,000",
        fee: "₦90",
        net: "₦599,910",
        status: "Successful",
        date: "Sep 25, 2026 • 03:15pm",
    },
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        Successful: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Failed: "bg-red-100 text-red-700",
    };
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
};

const Payments = () => {
    const [activeTab, setActiveTab] = useState<"rental" | "withdrawals">("rental");

    const stats =
        activeTab === "rental"
            ? [
                { label: "Total Revenue", value: "₦10.1M", icon: "💰" },
                { label: "Successful", value: "₦6.15M", icon: "✅" },
                { label: "Pending", value: "₦2.5M", icon: "⏳" },
                { label: "Failed", value: "₦3.12M", icon: "❌" },
                { label: "Platform Fees", value: "₦509K", icon: "💳" },
            ]
            : [
                { label: "Total Withdrawal", value: "₦9.52M", icon: "💰" },
                { label: "Successful", value: "₦5.5M", icon: "✅" },
                { label: "Pending", value: "₦3.2M", icon: "⏳" },
                { label: "Failed", value: "₦1.12M", icon: "❌" },
                { label: "Platform Fees", value: "₦509K", icon: "💳" },
            ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Platform transaction monitoring
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>All Status</option>
                        <option>Successful</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>This month</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <span className="text-lg">{stat.icon}</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-1">↑ +8.4% vs last month</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-5">
                <button
                    onClick={() => setActiveTab("rental")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === "rental"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Rental Payments
                    <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "rental" ? "bg-white/20" : "bg-blue-100 text-blue-700"
                            }`}
                    >
                        3
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("withdrawals")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === "withdrawals"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Withdrawals
                    <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "withdrawals"
                            ? "bg-white/20"
                            : "bg-blue-100 text-blue-700"
                            }`}
                    >
                        7
                    </span>
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            From
                        </div>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            To
                        </div>
                    </div>
                </div>

                {activeTab === "rental" ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-500 font-medium">
                                    <th className="px-5 py-3">Transaction ID</th>
                                    <th className="px-5 py-3">User</th>
                                    <th className="px-5 py-3">Property</th>
                                    <th className="px-5 py-3">Owner</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Platform Fees</th>
                                    <th className="px-5 py-3">Owner Payout</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rentalPayments.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3.5 font-medium text-gray-900">
                                            {row.id}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-700">{row.user}</td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-gray-900 truncate max-w-[180px]">
                                                {row.property}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-700">{row.owner}</td>
                                        <td className="px-5 py-3.5 font-medium text-gray-900">
                                            {row.amount}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-600">{row.fee}</td>
                                        <td className="px-5 py-3.5 text-gray-700">{row.payout}</td>
                                        <td className="px-5 py-3.5">
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-500 font-medium">
                                    <th className="px-5 py-3">Withdrawal ID</th>
                                    <th className="px-5 py-3">Owner</th>
                                    <th className="px-5 py-3">Property</th>
                                    <th className="px-5 py-3">Bank</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Transfer Fees</th>
                                    <th className="px-5 py-3">Net Disbursed</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {withdrawals.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3.5 font-medium text-gray-900">
                                            {row.id}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-700">{row.owner}</td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-gray-900 truncate max-w-[180px]">
                                                {row.property}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-gray-900">{row.bank}</p>
                                            <p className="text-xs text-gray-500">{row.account}</p>
                                        </td>
                                        <td className="px-5 py-3.5 font-medium text-gray-900">
                                            {row.amount}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-600">{row.fee}</td>
                                        <td className="px-5 py-3.5 text-gray-700">{row.net}</td>
                                        <td className="px-5 py-3.5">
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;