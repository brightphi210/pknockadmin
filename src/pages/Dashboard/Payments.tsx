import { Calendar, Search } from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 5;

type Tab = "rental" | "withdrawals";

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

/* ---------- small components ---------- */

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        Successful: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Failed: "bg-red-100 text-red-700",
    };
    return (
        <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"
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
        <dt className="flex-shrink-0 text-slate-500">{label}</dt>
        <dd className="min-w-0 break-words text-right text-slate-900">{children}</dd>
    </div>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex min-h-80 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white px-6 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                !
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const Pagination = ({
    page,
    totalPages,
    totalItems,
    pageSize,
    onChange,
}: {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onChange: (page: number) => void;
}) => {
    const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalItems);

    return (
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
                <span className="hidden sm:inline">
                    Showing {from}–{to} of {totalItems} ·{" "}
                </span>
                Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={() => onChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const matchesSearch = (row: Record<string, string>, keys: string[], term: string) =>
    !term || keys.some((k) => (row[k] ?? "").toLowerCase().includes(term));

/* ---------- page ---------- */

const Payments = () => {
    const [activeTab, setActiveTab] = useState<Tab>("rental");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [page, setPage] = useState(1);

    const term = search.trim().toLowerCase();

    const filteredRental = useMemo(
        () =>
            rentalPayments.filter(
                (r) =>
                    matchesSearch(r, ["id", "user", "property", "owner"], term) &&
                    (statusFilter === "All Status" || r.status === statusFilter)
            ),
        [term, statusFilter]
    );

    const filteredWithdrawals = useMemo(
        () =>
            withdrawals.filter(
                (r) =>
                    matchesSearch(r, ["id", "owner", "property", "bank"], term) &&
                    (statusFilter === "All Status" || r.status === statusFilter)
            ),
        [term, statusFilter]
    );

    const activeList = activeTab === "rental" ? filteredRental : filteredWithdrawals;
    const totalItems = activeList.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;

    const pagedRental = filteredRental.slice(start, start + PAGE_SIZE);
    const pagedWithdrawals = filteredWithdrawals.slice(start, start + PAGE_SIZE);

    const switchTab = (tab: Tab) => {
        setActiveTab(tab);
        setPage(1);
    };

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

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: "rental", label: "Rental Payments", count: rentalPayments.length },
        { key: "withdrawals", label: "Withdrawals", count: withdrawals.length },
    ];

    return (
        <div className="space-y-4 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Payments</h1>
                    <p className="mt-1 text-xs text-slate-500">Platform transaction monitoring</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 focus:border-blue-400 focus:outline-none"
                    >
                        <option>All Status</option>
                        <option>Successful</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>
                    <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 focus:border-blue-400 focus:outline-none">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>This month</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className={`rounded-xl bg-white p-4 shadow-sm ${i === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""
                            }`}
                    >
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="text-xs text-slate-500">{stat.label}</p>
                            <span className="text-base">{stat.icon}</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 sm:text-xl">{stat.value}</p>
                        <p className="mt-1 text-xs text-green-600">↑ +8.4% vs last month</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="inline-flex w-full items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => switchTab(tab.key)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold transition-colors sm:flex-none ${activeTab === tab.key
                            ? "bg-slate-900 text-white"
                            : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        {tab.label}
                        <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeTab === tab.key ? "bg-white/20" : "bg-blue-100 text-blue-700"
                                }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Table card */}
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-600">
                            <Calendar size={14} />
                            From
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-600">
                            <Calendar size={14} />
                            To
                        </div>
                    </div>
                </div>

                {totalItems === 0 ? (
                    <EmptyState
                        title={activeTab === "rental" ? "No payments found" : "No withdrawals found"}
                        description="No transactions match your current search or status filter."
                    />
                ) : activeTab === "rental" ? (
                    <>
                        {/* Desktop table */}
                        <div className="mt-5 hidden overflow-x-auto lg:block">
                            <table className="w-full min-w-225 border-collapse">
                                <thead>
                                    <tr className="whitespace-nowrap border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                        <th className="pb-3 pr-4 font-medium">Transaction ID</th>
                                        <th className="pb-3 pr-4 font-medium">User</th>
                                        <th className="pb-3 pr-4 font-medium">Property</th>
                                        <th className="pb-3 pr-4 font-medium">Owner</th>
                                        <th className="pb-3 pr-4 font-medium">Amount</th>
                                        <th className="pb-3 pr-4 font-medium">Platform Fees</th>
                                        <th className="pb-3 pr-4 font-medium">Owner Payout</th>
                                        <th className="pb-3 pr-4 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pagedRental.map((row) => (
                                        <tr key={row.id} className="text-xs transition-colors hover:bg-slate-50">
                                            <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">
                                                {row.id}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-slate-700">{row.user}</td>
                                            <td className="max-w-[200px] py-4 pr-4">
                                                <p className="truncate text-slate-900">{row.property}</p>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-slate-700">{row.owner}</td>
                                            <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-900">
                                                {row.amount}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-slate-600">{row.fee}</td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-slate-700">{row.payout}</td>
                                            <td className="py-4 pr-4">
                                                <StatusBadge status={row.status} />
                                            </td>
                                            <td className="whitespace-nowrap py-4 text-slate-500">{row.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile / tablet cards */}
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
                            {pagedRental.map((row) => (
                                <div key={row.id} className="rounded-xl border border-slate-200 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm font-semibold text-slate-900">{row.id}</p>
                                        <StatusBadge status={row.status} />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-900">{row.property}</p>
                                    <dl className="mt-3 space-y-1.5 text-xs">
                                        <Row label="User">{row.user}</Row>
                                        <Row label="Owner">{row.owner}</Row>
                                        <Row label="Amount">
                                            <span className="font-medium">{row.amount}</span>
                                        </Row>
                                        <Row label="Platform fee">{row.fee}</Row>
                                        <Row label="Owner payout">{row.payout}</Row>
                                    </dl>
                                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        {row.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="mt-5 hidden overflow-x-auto lg:block">
                            <table className="w-full min-w-225 border-collapse">
                                <thead>
                                    <tr className="whitespace-nowrap border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                        <th className="pb-3 pr-4 font-medium">Withdrawal ID</th>
                                        <th className="pb-3 pr-4 font-medium">Owner</th>
                                        <th className="pb-3 pr-4 font-medium">Property</th>
                                        <th className="pb-3 pr-4 font-medium">Bank</th>
                                        <th className="pb-3 pr-4 font-medium">Amount</th>
                                        <th className="pb-3 pr-4 font-medium">Transfer Fees</th>
                                        <th className="pb-3 pr-4 font-medium">Net Disbursed</th>
                                        <th className="pb-3 pr-4 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pagedWithdrawals.map((row) => (
                                        <tr key={row.id} className="text-xs transition-colors hover:bg-slate-50">
                                            <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">
                                                {row.id}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-slate-700">{row.owner}</td>
                                            <td className="max-w-[200px] py-4 pr-4">
                                                <p className="truncate text-slate-900">{row.property}</p>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4">
                                                <p className="text-slate-900">{row.bank}</p>
                                                <p className="text-xs text-slate-500">{row.account}</p>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-900">
                                                {row.amount}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-slate-600">{row.fee}</td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-slate-700">{row.net}</td>
                                            <td className="py-4 pr-4">
                                                <StatusBadge status={row.status} />
                                            </td>
                                            <td className="whitespace-nowrap py-4 text-slate-500">{row.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile / tablet cards */}
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
                            {pagedWithdrawals.map((row) => (
                                <div key={row.id} className="rounded-xl border border-slate-200 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-sm font-semibold text-slate-900">{row.id}</p>
                                        <StatusBadge status={row.status} />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-900">{row.property}</p>
                                    <dl className="mt-3 space-y-1.5 text-xs">
                                        <Row label="Owner">{row.owner}</Row>
                                        <Row label="Bank">
                                            {row.bank}
                                            <span className="block text-xs text-slate-500">{row.account}</span>
                                        </Row>
                                        <Row label="Amount">
                                            <span className="font-medium">{row.amount}</span>
                                        </Row>
                                        <Row label="Transfer fee">{row.fee}</Row>
                                        <Row label="Net disbursed">{row.net}</Row>
                                    </dl>
                                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        {row.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onChange={setPage}
                />
            </div>
        </div>
    );
};

export default Payments;