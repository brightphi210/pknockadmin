import {
    Bath,
    Bed,
    Calendar,
    ExternalLink,
    FileText,
    MapPin,
    Maximize,
    Search,
    User,
} from "lucide-react";
import { useState } from "react";

// ---------------- Dummy Data ----------------
const propertyVerifications = [
    {
        id: "INS – 001",
        property: "3 Bedroom Apartment at Lekki Phase 1, Lagos",
        location: "Lekki Phase 1, Lagos",
        type: "Apartment",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Olumide Fashola",
        status: "Upcoming Inspection",
    },
    {
        id: "INS – 002",
        property: "Modern Office Space in Victoria Island, Lagos",
        location: "Victoria Island, Lagos",
        type: "Office",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Amaka Obi",
        status: "Unassigned",
    },
    {
        id: "INS – 003",
        property: "Cozy Studio in Yaba",
        location: "Yaba, Lagos",
        type: "Studio",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Chinedu Eze",
        status: "In Progress",
    },
    {
        id: "INS – 004",
        property: "Luxury 5 Bedroom Duplex in Ikoyi",
        location: "Ikoyi, Lagos",
        type: "Duplex",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Tola Adeyemi",
        status: "Unassigned",
    },
    {
        id: "INS – 005",
        property: "Retail Shop at Ikeja City Mall",
        location: "Ikeja, Lagos",
        type: "Retail",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Funmi Balogun",
        status: "Upcoming Inspection",
    },
    {
        id: "INS – 006",
        property: "2 Bedroom Flat in Surulere",
        location: "Surulere, Lagos",
        type: "Flat",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Emeka Nwosu",
        status: "Upcoming Inspection",
    },
    {
        id: "INS – 007",
        property: "Industrial Warehouse in Apapa",
        location: "Apapa, Lagos",
        type: "Warehouse",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Ngozi Okafor",
        status: "Approved",
    },
    {
        id: "INS – 008",
        property: "Serviced 1 Bedroom Apartment",
        location: "Ikeja GRA, Lagos",
        type: "Apartment",
        date: "Jul 25, 2026 • 09:03am",
        pvo: "Bola Johnson",
        status: "Approved",
    },
];

const tenantInspections = [
    {
        id: 1,
        image:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
        type: "Apartment",
        title: "Victoria Island Duplex",
        location: "Lekki Phase 1, Lagos",
        price: "₦450k",
        period: "/year",
        beds: 3,
        baths: 3,
        size: "185 m²",
        tenant: "Emeka Nwosu",
        tenantRole: "Prospective Tenant",
        officer: "Chidi Okafor",
        officerRole: "Assigned P-Knock Officer",
        date: "July 30, 2025",
        time: "10:00 AM",
        notes: "Visitor is interested in a 2-year tenancy.",
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        type: "Apartment",
        title: "Marina View Apartment",
        location: "Lekki Phase 1, Lagos",
        price: "₦450k",
        period: "/year",
        beds: 3,
        baths: 3,
        size: "185 m²",
        tenant: "Emeka Nwosu",
        tenantRole: "Prospective Tenant",
        officer: "Chidi Okafor",
        officerRole: "Assigned P-Knock Officer",
        date: "August 2, 2025",
        time: "2:00 PM",
        notes: "Visitor is interested in a 2-year tenancy.",
    },
    {
        id: 3,
        image:
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
        type: "Apartment",
        title: "Sunrise Court Apartment",
        location: "Lekki Phase 1, Lagos",
        price: "₦450k",
        period: "/year",
        beds: 3,
        baths: 3,
        size: "185 m²",
        tenant: "Emeka Nwosu",
        tenantRole: "Prospective Tenant",
        officer: "Chidi Okafor",
        officerRole: "Assigned P-Knock Officer",
        date: "August 11, 2025",
        time: "5:00 PM",
        notes: "Visitor is interested in a 2-year tenancy.",
    },
];

// ---------------- Status Badge ----------------
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        "Upcoming Inspection": "bg-blue-100 text-blue-700",
        Unassigned: "bg-gray-100 text-gray-600",
        "In Progress": "bg-purple-100 text-purple-700",
        Approved: "bg-green-100 text-green-700",
    };

    return (
        <span
            className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
};

const Row = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex items-start justify-between gap-4">
        <dt className="text-gray-500 flex-shrink-0">{label}</dt>
        <dd className="text-gray-700 text-right min-w-0 break-words">{children}</dd>
    </div>
);

// ---------------- Main Component ----------------
const Inspection = () => {
    const [activeTab, setActiveTab] = useState<"property" | "tenant">("property");
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Inspections
                </h1>
                <p className="text-sm text-gray-500 mt-1">5 inspections this week</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit mb-5 sm:mb-6">
                <button
                    onClick={() => setActiveTab("property")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "property"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Property Verification
                </button>
                <button
                    onClick={() => setActiveTab("tenant")}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "tenant"
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    Tenant Inspection
                </button>
            </div>

            {/* ===================== PROPERTY VERIFICATION TAB ===================== */}
            {activeTab === "property" && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative w-full md:max-w-md">
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

                    {/* Desktop table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-500 font-medium whitespace-nowrap">
                                    <th className="px-6 py-3">Inspection ID</th>
                                    <th className="px-6 py-3">Property</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Date & Time</th>
                                    <th className="px-6 py-3">PVO</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {propertyVerifications.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {item.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 truncate max-w-[220px]">
                                                {item.property}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <MapPin size={12} />
                                                {item.location}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                                            {item.pvo}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 whitespace-nowrap">
                                                {item.status === "Unassigned" ? (
                                                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                                                        Assign PVO
                                                    </button>
                                                ) : (
                                                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                                                        Re-assign
                                                    </button>
                                                )}
                                                <button className="text-gray-600 hover:text-gray-800 font-medium">
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile / tablet cards */}
                    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
                        {propertyVerifications.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-gray-200 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-medium text-gray-500">{item.id}</p>
                                    <StatusBadge status={item.status} />
                                </div>
                                <p className="mt-2 font-medium text-gray-900">{item.property}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPin size={12} className="flex-shrink-0" />
                                    {item.location}
                                </p>

                                <dl className="mt-3 space-y-1.5 text-sm">
                                    <Row label="Type">
                                        <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs">
                                            {item.type}
                                        </span>
                                    </Row>
                                    <Row label="Date & time">{item.date}</Row>
                                    <Row label="PVO">{item.pvo}</Row>
                                </dl>

                                <div className="mt-4 flex items-center gap-5 border-t border-gray-100 pt-3 text-sm">
                                    {item.status === "Unassigned" ? (
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                                            Assign PVO
                                        </button>
                                    ) : (
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                                            Re-assign
                                        </button>
                                    )}
                                    <button className="text-gray-600 hover:text-gray-800 font-medium">
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
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
            )}

            {/* ===================== TENANT INSPECTION TAB ===================== */}
            {activeTab === "tenant" && (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-6">
                    {/* Left column – Inspection cards */}
                    <div className="xl:col-span-2 min-w-0 space-y-4">
                        {/* Search */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="relative w-full md:max-w-md">
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
                        </div>

                        {/* Cards */}
                        {tenantInspections.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                                    {/* Image */}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-44 sm:w-36 sm:h-28 object-cover rounded-lg flex-shrink-0"
                                    />

                                    {/* Main info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                                            <div className="min-w-0">
                                                <span className="text-xs text-gray-500">{item.type}</span>
                                                <h3 className="text-base font-semibold text-gray-900 mt-0.5">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin size={13} className="flex-shrink-0" />
                                                    {item.location}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 sm:block sm:text-right sm:flex-shrink-0">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {item.price}
                                                    <span className="text-sm font-normal text-gray-500">
                                                        {item.period}
                                                    </span>
                                                </p>
                                                <button className="text-blue-600 text-sm font-medium flex items-center gap-1 sm:mt-1 hover:underline">
                                                    View Property
                                                    <ExternalLink size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Specs */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <Bed size={15} />
                                                {item.beds} bedrooms
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Bath size={15} />
                                                {item.baths} bathrooms
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Maximize size={15} />
                                                {item.size}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom meta */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-5 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <User size={15} className="text-gray-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.tenant}
                                            </p>
                                            <p className="text-xs text-gray-500">{item.tenantRole}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <Calendar size={15} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.date}
                                            </p>
                                            <p className="text-xs text-gray-500">{item.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <User size={15} className="text-gray-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.officer}
                                            </p>
                                            <p className="text-xs text-gray-500">{item.officerRole}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <FileText size={15} className="text-gray-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">Notes</p>
                                            <p className="text-xs text-gray-500">{item.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right column – Calendar + Upcoming */}
                    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                        {/* Calendar */}
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
                                            className={`relative py-1.5 rounded-full cursor-pointer ${isSelected
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

                        {/* Upcoming */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                            <h3 className="font-semibold text-gray-900 mb-3">Upcoming</h3>
                            <div className="space-y-3">
                                {[
                                    {
                                        title: "Victoria Island Duplex",
                                        time: "Jul 30, 2025 • 10:00 AM",
                                    },
                                    {
                                        title: "Marina View Apartment",
                                        time: "Aug 2, 2025 • 2:00 PM",
                                    },
                                    {
                                        title: "Sunrise Court Apartment",
                                        time: "Aug 11, 2025 • 5:00 PM",
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-3 p-3 rounded-lg bg-blue-50/60 border border-blue-100"
                                    >
                                        <div className="w-1 rounded-full bg-blue-500 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inspection;