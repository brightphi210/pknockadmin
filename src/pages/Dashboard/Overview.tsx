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
} from 'lucide-react'
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
    YAxis
} from 'recharts'

/* ---------- Data ---------- */

interface StatCardData {
    title: string
    value: string
    icon: LucideIcon
    iconBg: string
    iconColor: string
    trendValue: string
    trendLabel: string
    trendDirection: 'up' | 'down'
}

const statCards: StatCardData[] = [
    { title: 'Total Properties', value: '1,248', icon: Building2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', trendValue: '+14.3%', trendLabel: 'vs last month', trendDirection: 'up' },
    { title: 'Verified Properties', value: '312', icon: ShieldCheck, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', trendValue: '+18.3%', trendLabel: 'vs last month', trendDirection: 'up' },
    { title: 'Pending Approval', value: '86', icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', trendValue: '+7.3%', trendLabel: 'vs last month', trendDirection: 'down' },
    { title: 'Inspection Completed', value: '402', icon: ClipboardCheck, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', trendValue: '+68.2%', trendLabel: 'of total', trendDirection: 'up' },
    { title: 'Total Revenue', value: '₦24.8M', icon: History, iconBg: 'bg-sky-50', iconColor: 'text-sky-600', trendValue: '+14.3%', trendLabel: 'vs last month', trendDirection: 'up' },
    { title: 'Total Users', value: '2,847', icon: Users2, iconBg: 'bg-sky-50', iconColor: 'text-sky-600', trendValue: '+124', trendLabel: 'this week', trendDirection: 'up' },
    { title: 'Active PVOs', value: '21/28', icon: CircleCheck, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', trendValue: '', trendLabel: '1 inactive', trendDirection: 'down' },
    { title: 'Complaints', value: '7', icon: MessageCircleWarning, iconBg: 'bg-rose-50', iconColor: 'text-rose-600', trendValue: '-7', trendLabel: 'vs last month', trendDirection: 'down' },
]

const revenueData = [
    { month: 'Jan', revenue: 1_500_000 },
    { month: 'Feb', revenue: 2_350_000 },
    { month: 'Mar', revenue: 2_650_000 },
    { month: 'April', revenue: 3_150_000 },
    { month: 'May', revenue: 2_950_000 },
    { month: 'June', revenue: 3_850_000 },
]

const propertiesData = [
    { month: 'Jan', date: 'Jan 4, 2026', published: 78, rejected: 150 },
    { month: 'Feb', date: 'Feb 10, 2026', published: 122, rejected: 118 },
    { month: 'Mar', date: 'Mar 15, 2026', published: 158, rejected: 82 },
    { month: 'April', date: 'April 20, 2026', published: 168, rejected: 55 },
    { month: 'May', date: 'May 22, 2026', published: 210, rejected: 8 },
    { month: 'June', date: 'June 18, 2026', published: 182, rejected: 12 },
]

const propertyTrend = [
    { name: 'Verified & Published', value: 842, percentage: '67.6%', color: '#3B82F6', percentageColor: 'text-emerald-600' },
    { name: 'Awaiting Approval', value: 86, percentage: '6.9%', color: '#0F172A', percentageColor: 'text-rose-600' },
]

const recentActivity = [
    { id: '1', dot: 'bg-emerald-500', message: 'Maya Singh updated lease agreement for unit 8A', timeAgo: '15 minutes ago' },
    { id: '2', dot: 'bg-blue-500', message: 'Liam Chen completed payment for apartment 4B', timeAgo: '30 minutes ago' },
    { id: '3', dot: 'bg-amber-500', message: 'Noah Kim reported noise complaint from neighbors', timeAgo: '45 minutes ago' },
    { id: '4', dot: 'bg-rose-500', message: 'Sophia Martinez requested maintenance for leaking faucet', timeAgo: '1 hour ago' },
    { id: '5', dot: 'bg-violet-500', message: 'Adaora Okafor registered as new property owner', timeAgo: '2 hours ago' },
    { id: '6', dot: 'bg-emerald-500', message: 'Olivia Brown scheduled inspection for rooftop repairs', timeAgo: '2 hours ago' },
    { id: '7', dot: 'bg-blue-500', message: 'Ethan Patel submitted rental application for unit 12C', timeAgo: '3 hours ago' },
]

/* ---------- Helpers ---------- */

const formatNaira = (value: number) => {
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`
    return `₦${value}`
}

const formatToday = () =>
    new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const RevenueTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="text-xs font-semibold text-slate-900">{formatNaira(payload[0].value as number)}</p>
        </div>
    )
}

const PropertiesTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const point = payload[0]?.payload as (typeof propertiesData)[number] | undefined
    if (!point) return null
    return (
        <div className="rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-lg">
            <p className="mb-2 text-xs font-medium text-slate-400">{point.date}</p>
            <p className="flex items-center justify-between gap-6 text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Published
                </span>
                <span className="font-semibold text-slate-900">{point.published}</span>
            </p>
            <p className="flex items-center justify-between gap-6 text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Rejected
                </span>
                <span className="font-semibold text-slate-900">{point.rejected}</span>
            </p>
        </div>
    )
}

/* ---------- Page ---------- */

const Overview = () => {
    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Good morning, Admin</h1>
                <p className="mt-1 text-xs text-slate-500">{formatToday()} · Here&apos;s what needs your attention today</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:gap-4 gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {statCards.map((card) => {
                    const isUp = card.trendDirection === 'up'
                    return (
                        <div key={card.title} className="flex flex-col justify-between rounded-2xl  bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between">
                                <p className="text-xs text-slate-500">{card.title}</p>
                                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${card.iconBg} ${card.iconColor}`}>
                                    <card.icon size={18} />
                                </span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-slate-900 ">{card.value}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {card.trendValue ? `${card.trendValue} ` : ''}
                                    {card.trendLabel}
                                </span>
                                <ArrowUpRightFromSquare size={14} className="text-slate-300" />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Revenue + Property trend */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl  bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
                    <p className="text-xs text-slate-400">Total rental income collected</p>
                    <div className="mt-4 h-72 w-full sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                    tickFormatter={formatNaira}
                                    domain={[0, 6_000_000]}
                                    ticks={[0, 1_500_000, 3_000_000, 4_500_000, 6_000_000]}
                                    width={56}
                                />
                                <Tooltip content={<RevenueTooltip />} />
                                <Line type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={3} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl  bg-white p-5 shadow-sm sm:p-6">
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
                                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                                    <div>
                                        <p className="text-xs text-slate-600">{slice.name}</p>
                                        <p className="text-2xl font-bold text-slate-900">{slice.value}</p>
                                        <p className={`text-xs font-medium ${slice.percentageColor}`}>{slice.percentage}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Properties + Recent activity */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl  bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900">Properties</h3>
                    <p className="text-xs text-slate-400">Published vs Rejected</p>
                    <div className="mt-4 h-72 w-full sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={propertiesData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[0, 300]} ticks={[0, 75, 150, 225, 300]} width={40} />
                                <Tooltip content={<PropertiesTooltip />} />
                                <Line type="monotone" dataKey="published" stroke="#22C55E" strokeWidth={3} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                                <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl  bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                            <p className="text-xs text-slate-400">Latest platform events</p>
                        </div>
                        <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                            View all
                        </button>
                    </div>
                    <ul className="mt-4 divide-y divide-slate-100">
                        {recentActivity.map((item) => (
                            <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.dot}`} />
                                <p className="flex-1 text-xs text-slate-700">{item.message}</p>
                                <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">{item.timeAgo}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Overview