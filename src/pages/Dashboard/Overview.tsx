import {
    ArrowDownRight,
    ArrowUpRight,
    ArrowUpRightFromSquare,
    Building2,
    CircleCheck,
    ClipboardCheck,
    Clock,
    History,
    MessageCircleWarning,
    ShieldCheck,
    Users2,
    type LucideIcon,
} from "lucide-react"
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import LoadingOverlay from "../../components/LoadingOverlay"
import {
    useGetAdminOverview,
    useGetAdminPropertyMix,
    useGetAdminRevenueSeries,
    useGetAdminVerificationFunnel,
    type AdminOverviewResponse,
} from "../../hooks/queries/allQueries"

/* ---------- Helpers ---------- */

interface StatCardData {
    title: string
    value: string
    icon: LucideIcon
    iconBg: string
    iconColor: string
    trendValue: string
    trendLabel: string
    trendDirection: "up" | "down"
}

const formatDelta = (delta: number | undefined) => {
    if (typeof delta !== "number" || Number.isNaN(delta)) return "0%"
    return `${delta > 0 ? "+" : ""}${delta}%`
}

const formatCompactNumber = (value: number | string | undefined) => {
    const numeric = Number(value ?? 0)
    if (Number.isNaN(numeric)) return "0"
    if (numeric >= 1_000_000) return `${(numeric / 1_000_000).toFixed(1)}M`
    if (numeric >= 1_000) return `${(numeric / 1_000).toFixed(1)}K`
    return String(Math.round(numeric))
}

const formatCurrency = (value: number | string | undefined) => {
    const numeric = Number(value ?? 0)
    if (Number.isNaN(numeric)) return "₦0"
    if (numeric >= 1_000_000) return `₦${(numeric / 1_000_000).toFixed(1)}M`
    if (numeric >= 1_000) return `₦${(numeric / 1_000).toFixed(1)}K`
    return `₦${numeric.toLocaleString("en-NG")}`
}

const formatNaira = (value: number) => {
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`
    return `₦${value}`
}

const formatToday = () =>
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })

const buildStatCards = (overview?: AdminOverviewResponse | null): StatCardData[] => {
    const data = overview ?? {}

    return [
        {
            title: "Total Properties",
            value: formatCompactNumber(data.total_properties?.value),
            icon: Building2,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            trendValue: formatDelta(data.total_properties?.delta_pct),
            trendLabel: "vs last month",
            trendDirection: (data.total_properties?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
        {
            title: "Verified Properties",
            value: formatCompactNumber(data.verified_properties?.value),
            icon: ShieldCheck,
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            trendValue: formatDelta(data.verified_properties?.delta_pct),
            trendLabel: "vs last month",
            trendDirection: (data.verified_properties?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
        {
            title: "Pending Approval",
            value: formatCompactNumber(data.pending_approval?.value),
            icon: Clock,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
            trendValue: formatDelta(data.pending_approval?.delta_pct),
            trendLabel: "vs last month",
            trendDirection: (data.pending_approval?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
        {
            title: "Inspection Completed",
            value: formatCompactNumber(data.inspections_completed?.value),
            icon: ClipboardCheck,
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600",
            trendValue: formatDelta(data.inspections_completed?.delta_pct),
            trendLabel: "vs last month",
            trendDirection: (data.inspections_completed?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(data.total_revenue?.value),
            icon: History,
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
            trendValue: formatDelta(data.total_revenue?.delta_pct),
            trendLabel: "vs last month",
            trendDirection: (data.total_revenue?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
        {
            title: "Total Users",
            value: formatCompactNumber(data.total_users?.value),
            icon: Users2,
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
            trendValue: formatDelta(data.total_users?.delta_pct),
            trendLabel: data.total_users?.new_this_week
                ? `+${data.total_users.new_this_week} this week`
                : "this week",
            trendDirection: (data.total_users?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
        {
            title: "Active PVOs",
            value: formatCompactNumber(data.active_pvos?.value),
            icon: CircleCheck,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            trendValue: formatDelta(data.active_pvos?.delta_pct),
            trendLabel: "vs last month",
            trendDirection: (data.active_pvos?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
        {
            title: "Complaints",
            value: formatCompactNumber(data.open_complaints?.value),
            icon: MessageCircleWarning,
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
            trendValue: formatDelta(data.open_complaints?.delta_pct),
            trendLabel: "vs last month",
            trendDirection: (data.open_complaints?.delta_pct ?? 0) >= 0 ? "up" : "down",
        },
    ]
}

/* ---------- Dummy data for Property Trend ---------- */
const propertyTrend = [
    {
        name: "Verified & Published",
        value: 842,
        percentage: "67.6%",
        color: "#3B82F6",
        percentageColor: "text-emerald-600",
    },
    {
        name: "Awaiting Approval",
        value: 86,
        percentage: "6.9%",
        color: "#0F172A",
        percentageColor: "text-rose-600",
    },
]

/* ---------- Chart tooltips ---------- */

const RevenueTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="text-xs font-semibold text-slate-900">
                {formatNaira(Number(payload[0].value))}
            </p>
        </div>
    )
}

const PropertiesTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const point = payload[0]?.payload
    if (!point) return null
    return (
        <div className="rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-lg">
            <p className="mb-2 text-xs font-medium text-slate-400">{point.month}</p>
            <p className="flex items-center justify-between gap-6 text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Approved
                </span>
                <span className="font-semibold text-slate-900">{point.approved}</span>
            </p>
            <p className="flex items-center justify-between gap-6 text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Submitted
                </span>
                <span className="font-semibold text-slate-900">{point.submitted}</span>
            </p>
        </div>
    )
}

/* ---------- Page ---------- */

const Overview = () => {
    const { overview, isLoading: overviewLoading, isError, refetch } = useGetAdminOverview()
    const { revenueSeries, isLoading: revenueLoading } = useGetAdminRevenueSeries()
    const { propertyMix, isLoading: mixLoading } = useGetAdminPropertyMix()
    const { verificationFunnel, isLoading: funnelLoading } = useGetAdminVerificationFunnel()

    const isLoading = overviewLoading || revenueLoading || mixLoading || funnelLoading
    const statCards = buildStatCards(overview)

    // Transform API → chart data
    const revenueData =
        revenueSeries?.series?.map((item) => ({
            month: item.month,
            revenue: Number(item.value) || 0,
        })) ?? []

    const propertiesData =
        verificationFunnel?.activity?.map((item) => ({
            month: item.month,
            approved: item.approved ?? 0,
            submitted: item.submitted ?? 0,
        })) ?? []

    if (isError) {
        return (
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">Could not load overview</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Please refresh the page to reload the dashboard summary.
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Greeting */}
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Good morning, Admin</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        {formatToday()} · Here&apos;s what needs your attention today
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
                    {statCards.map((card) => {
                        const isUp = card.trendDirection === "up"
                        return (
                            <div
                                key={card.title}
                                className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-xs text-slate-500">{card.title}</p>
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded-full ${card.iconBg} ${card.iconColor}`}
                                    >
                                        <card.icon size={18} />
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span
                                        className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-600" : "text-rose-600"
                                            }`}
                                    >
                                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {card.trendValue ? `${card.trendValue} ` : ""}
                                        {card.trendLabel}
                                    </span>
                                    <ArrowUpRightFromSquare size={14} className="text-slate-300" />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Revenue + Property Trend */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* Revenue Overview */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
                        <p className="text-xs text-slate-400">Total rental income collected</p>
                        <div className="mt-4 h-72 w-full sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                                        tickFormatter={formatNaira}
                                        width={56}
                                    />
                                    <Tooltip content={<RevenueTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#22C55E"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Property Trend – dummy data */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <h3 className="text-lg font-bold text-slate-900">Property Trend</h3>
                        <p className="text-xs text-slate-400">occupancy</p>

                        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="h-64 w-64 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={propertyTrend}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="65%"
                                            outerRadius="95%"
                                            paddingAngle={2}
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="none"
                                        >
                                            {propertyTrend.map((slice) => (
                                                <Cell key={slice.name} fill={slice.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <ul className="w-full space-y-5 sm:w-auto">
                                {propertyTrend.map((slice) => (
                                    <li key={slice.name} className="flex items-start gap-2">
                                        <span
                                            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: slice.color }}
                                        />
                                        <div>
                                            <p className="text-xs text-slate-600">{slice.name}</p>
                                            <p className="text-2xl font-bold text-slate-900">{slice.value}</p>
                                            <p className={`text-xs font-medium ${slice.percentageColor}`}>
                                                {slice.percentage}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Verification activity + Recent Activity */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <h3 className="text-lg font-bold text-slate-900">Verification Activity</h3>
                        <p className="text-xs text-slate-400">Approved vs Submitted</p>
                        <div className="mt-4 h-72 w-full sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={propertiesData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#94A3B8", fontSize: 12 }}
                                        width={40}
                                    />
                                    <Tooltip content={<PropertiesTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="approved"
                                        stroke="#22C55E"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="submitted"
                                        stroke="#EF4444"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity – empty state */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                                <p className="text-xs text-slate-400">Latest platform events</p>
                            </div>
                            <button
                                type="button"
                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                                View all
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-slate-400"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-slate-900">No recent activity</h4>
                            <p className="mt-2 max-w-xs text-sm text-slate-500">
                                Your latest actions and updates will appear here as you verify PVOs,
                                manage properties, and complete other activities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview