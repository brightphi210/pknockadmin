import { Download } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const verificationData = [
    { month: "Jan", Approved: 80, Verifications: 110, Rejected: 150 },
    { month: "Feb", Approved: 120, Verifications: 145, Rejected: 120 },
    { month: "Mar", Approved: 140, Verifications: 70, Rejected: 95 },
    { month: "Apr", Approved: 155, Verifications: 130, Rejected: 75 },
    { month: "May", Approved: 150, Verifications: 230, Rejected: 55 },
    { month: "June", Approved: 185, Verifications: 205, Rejected: 60 },
];

const userGrowthData = [
    { month: "Jan", User: 95, "Property Owner": 40, PVO: 10 },
    { month: "Feb", User: 75, "Property Owner": 20, PVO: 55 },
    { month: "Mar", User: 125, "Property Owner": 85, PVO: 15 },
    { month: "Apr", User: 155, "Property Owner": 15, PVO: 35 },
    { month: "May", User: 155, "Property Owner": 45, PVO: 25 },
    { month: "June", User: 75, "Property Owner": 45, PVO: 45 },
];

const propertyTypeData = [
    { name: "Apartment", value: 58, color: "#3B82F6" },
    { name: "House", value: 22, color: "#22C55E" },
    { name: "Studio", value: 11, color: "#F59E0B" },
    { name: "Duplex", value: 5, color: "#8B5CF6" },
    { name: "Villa", value: 3, color: "#EF4444" },
    { name: "Commercial", value: 1, color: "#06B6D4" },
];

const topPVOs = [
    { rank: 1, name: "James Ebube", rating: 4.8, progress: 95 },
    { rank: 2, name: "Sophia Martinez", rating: 4.6, progress: 82 },
    { rank: 3, name: "Liam O'Connor", rating: 4.9, progress: 78 },
    { rank: 4, name: "Ava Chen", rating: 4.7, progress: 65 },
    { rank: 5, name: "Noah Patel", rating: 4.5, progress: 52 },
];

const stats = [
    {
        label: "Total Properties",
        value: "1,248",
        change: "+14.3% vs last month",
        icon: "🏢",
        positive: true,
    },
    {
        label: "Published Properties",
        value: "312",
        change: "+18.3% vs last month",
        icon: "✅",
        positive: true,
    },
    {
        label: "Pending Approval",
        value: "86",
        change: "+7.3% vs last month",
        icon: "⏳",
        positive: false,
    },
    {
        label: "Inspection Completed",
        value: "402",
        change: "+68.2% of total",
        icon: "📋",
        positive: true,
    },
    {
        label: "Verification Rate",
        value: "84%",
        change: "+3.2% vs last month",
        icon: "%",
        positive: true,
    },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
                <p className="font-medium text-gray-900 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Analytics = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5 sm:mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Analytics
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Platform performance overview
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Last 6 Months</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                    <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto">
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-5 sm:mb-6">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className={`bg-white rounded-xl border border-gray-200 p-4 ${i === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""
                            }`}
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <span className="text-lg flex-shrink-0">{stat.icon}</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                            {stat.value}
                        </p>
                        <p
                            className={`text-xs mt-1 ${stat.positive ? "text-green-600" : "text-red-500"
                                }`}
                        >
                            {stat.positive ? "↑" : "↓"} {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">
                {/* Verification Activity - Line Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
                    <h3 className="font-semibold text-gray-900">Verification Activity</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Track your verification activities here
                    </p>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={verificationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis width={36} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Approved"
                                stroke="#22C55E"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Verifications"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Rejected"
                                stroke="#EF4444"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* User Growth - Bar Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
                    <h3 className="font-semibold text-gray-900">User Growth</h3>
                    <p className="text-sm text-gray-500 mb-4">Monthly users growth</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis width={36} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="User" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            <Bar
                                dataKey="Property Owner"
                                fill="#1E293B"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar dataKey="PVO" fill="#22C55E" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Properties Donut */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
                    <h3 className="font-semibold text-gray-900">Properties</h3>
                    <p className="text-sm text-gray-500 mb-4">Published vs Rejected</p>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                        <div className="w-[200px] h-[200px] flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={propertyTypeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {propertyTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full sm:block sm:w-auto sm:space-y-2">
                            {propertyTypeData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2 text-sm">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-600 flex-1 sm:flex-none sm:w-24">
                                        {item.name}
                                    </span>
                                    <span className="font-medium text-gray-900">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Performing PVO */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Top Performing PVO
                            </h3>
                            <p className="text-sm text-gray-500">By Completed Verification</p>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline whitespace-nowrap">
                            View all
                        </button>
                    </div>
                    <div className="space-y-4">
                        {topPVOs.map((pvo) => (
                            <div key={pvo.rank} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500 w-4 flex-shrink-0">
                                    {pvo.rank}
                                </span>
                                <img
                                    src={`https://i.pravatar.cc/40?img=${pvo.rank + 10}`}
                                    alt={pvo.name}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {pvo.name}
                                    </p>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${pvo.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-1 flex-shrink-0">
                                    {pvo.rating} <span className="text-amber-400">★</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;