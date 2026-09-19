import {
    Bell,
    Building2,
    CheckCheck,
    ClipboardList,
    CreditCard,
    MessageSquare,
    Search,
    Settings,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const categories = [
    { id: "all", label: "All", icon: Bell },
    { id: "inspection", label: "Inspection", icon: ClipboardList },
    { id: "verification", label: "Verification", icon: ShieldCheck },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "listings", label: "Listings", icon: Building2 },
    { id: "complaints", label: "Complaints", icon: MessageSquare },
    { id: "system", label: "System", icon: Settings },
];

const notifications = [
    {
        id: 1,
        type: "payments",
        title: "Payment Received",
        message:
            "₦850,000 rent payment received for Victoria Island Duplex.",
        time: "1 min ago",
        unread: true,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: 2,
        type: "listings",
        title: "Listing Published",
        message:
            "3-Bedroom Apartment on Lekki Phase 1 has dropped its monthly rent from ₦500,000 to ₦450,000.",
        time: "2 hours ago",
        unread: true,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        id: 3,
        type: "listings",
        title: "Listing Published",
        message:
            "3-Bedroom Apartment on Lekki Phase 1 has dropped its monthly rent from ₦500,000 to ₦450,000.",
        time: "4 hours ago",
        unread: true,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 4,
        type: "inspection",
        title: "New Inspection Request",
        message:
            "Fatima Aliyu has requested to inspect Marina View Apartment on Aug 2, 2025 at 2:00 PM.",
        time: "Yesterday",
        unread: false,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        id: 5,
        type: "complaints",
        title: "Complaint Resolved",
        message:
            "Complaint #CPL-2025-034 for Green Terrace Self-Contain has been resolved by P-Knock support.",
        time: "3 days ago",
        unread: false,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
    },
    {
        id: 6,
        type: "system",
        title: "Platform Maintenance",
        message:
            "Scheduled maintenance on Jul 30, 2025 from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.",
        time: "1 week ago",
        unread: false,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-500",
    },
];

const Notifications = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = notifications.filter((n) => {
        const matchCategory =
            activeCategory === "all" || n.type === activeCategory;
        const matchSearch =
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.message.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Notifications
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        4 unread notifications
                    </p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto">
                    <CheckCheck size={16} />
                    Mark as read
                </button>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                {/* Categories: horizontal scroll on mobile, sidebar on desktop */}
                <div className="w-full lg:w-56 lg:flex-shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 p-2 flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2 lg:py-2.5 lg:w-full rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-sm sm:ml-auto mb-1 sm:mb-4">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>

                    {filtered.map((n) => (
                        <div
                            key={n.id}
                            className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex items-start gap-3 sm:gap-4 hover:shadow-sm transition-shadow"
                        >
                            <div
                                className={`w-10 h-10 rounded-lg ${n.iconBg} flex items-center justify-center flex-shrink-0`}
                            >
                                {n.type === "payments" && (
                                    <CreditCard size={18} className={n.iconColor} />
                                )}
                                {n.type === "listings" && (
                                    <Building2 size={18} className={n.iconColor} />
                                )}
                                {n.type === "inspection" && (
                                    <ClipboardList size={18} className={n.iconColor} />
                                )}
                                {n.type === "complaints" && (
                                    <MessageSquare size={18} className={n.iconColor} />
                                )}
                                {n.type === "system" && (
                                    <Settings size={18} className={n.iconColor} />
                                )}
                                {n.type === "verification" && (
                                    <ShieldCheck size={18} className={n.iconColor} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900">{n.title}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-0">
                                        {n.unread && (
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                        )}
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {n.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;