import {
    Bell,
    Building,
    LayoutDashboard,
    LineChart,
    LogOut,
    MessagesSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
    Settings,
    ShieldCheck,
    ShieldQuestion,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navGroups = [
    {
        label: 'Overview',
        items: [{ label: 'Dashboard', to: '/admin/overview', icon: LayoutDashboard }],
    },
    {
        label: 'Property Operations',
        items: [
            { label: 'Properties', to: '/admin/properties', icon: Building, badge: 7 },
            { label: 'Property Owners', to: '/admin/property-owners', icon: UserRound },
            { label: 'Verification Officers', to: '/admin/verification-officers', icon: ShieldQuestion },
            { label: 'Inspections', to: '/admin/inspections', icon: Search },
        ],
    },
    {
        label: 'User Management',
        items: [{ label: 'Users', to: '/admin/users', icon: Users, badge: 4 }],
    },
    {
        label: 'Finance & Support',
        items: [
            { label: 'Payments', to: '/admin/payments', icon: Wallet },
            { label: 'Complaints', to: '/admin/complaints', icon: MessagesSquare },
        ],
    },
    {
        label: 'System',
        items: [
            { label: 'Analytics', to: '/admin/analytics', icon: LineChart },
            { label: 'Notifications', to: '/admin/notifications', icon: Bell },
            { label: 'Settings', to: '/admin/settings', icon: Settings },
        ],
    },
]

interface DashSideBarProps {
    mobileOpen: boolean
    onCloseMobile: () => void
}

const DashSideBar = ({ mobileOpen, onCloseMobile }: DashSideBarProps) => {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white
                    transition-transform duration-200 ease-in-out
                    lg:sticky lg:top-0 lg:translate-x-0
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${collapsed ? 'lg:w-20' : 'lg:w-64'}
                `}
            >
                {/* Logo row */}
                <div className="flex h-20 shrink-0 items-center justify-between px-5">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <ShieldCheck size={20} strokeWidth={2.5} />
                        </span>
                        {!collapsed && (
                            <span className="truncate text-lg font-extrabold tracking-tight text-slate-900">
                                P-KNOCK
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setCollapsed((c) => !c)}
                        className="hidden shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:inline-flex"
                        aria-label="Toggle sidebar"
                    >
                        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                </div>

                {/* Nav groups */}
                <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
                    {navGroups.map((group) => (
                        <div key={group.label}>
                            {!collapsed && (
                                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    {group.label}
                                </p>
                            )}
                            <ul className="space-y-1">
                                {group.items.map((item) => (
                                    <li key={item.to}>
                                        <NavLink
                                            to={item.to}
                                            onClick={onCloseMobile}
                                            className={({ isActive }) =>
                                                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <item.icon size={18} className="shrink-0" />
                                                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                                                    {!collapsed && item.badge ? (
                                                        <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                                                            {item.badge}
                                                        </span>
                                                    ) : null}
                                                    {isActive && (
                                                        <span className="absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-l-full bg-blue-600" />
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer / user */}
                <div className="shrink-0 border-t border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/64?img=12"
                            alt="Sunday Kingsley"
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900">Sunday Kingsley</p>
                                <p className="truncate text-xs text-slate-400">kj****998@gmail.com</p>
                            </div>
                        )}
                        <button
                            type="button"
                            className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Log out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default DashSideBar