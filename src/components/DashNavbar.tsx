import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DashNavbarProps {
    onOpenMobileSidebar: () => void
}

const DashNavbar = ({ onOpenMobileSidebar }: DashNavbarProps) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const notificationCount = 15

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button
                type="button"
                onClick={onOpenMobileSidebar}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                aria-label="Open sidebar"
            >
                <Menu size={20} />
            </button>

            <div className="ml-auto flex items-center gap-3 sm:gap-4">
                <button
                    type="button"
                    className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    {notificationCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                            {notificationCount > 99 ? '99+' : notificationCount}
                        </span>
                    )}
                </button>

                <div className="h-6 w-px bg-slate-200" />

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100"
                    >
                        <img
                            src="https://i.pravatar.cc/64?img=12"
                            alt="Sunday Kingsley"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <ChevronDown
                            size={16}
                            className={`hidden text-slate-400 transition-transform sm:block ${menuOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                            <div className="border-b border-slate-100 px-4 py-3">
                                <p className="truncate text-sm font-semibold text-slate-900">Sunday Kingsley</p>
                                <p className="truncate text-xs text-slate-400">kj****998@gmail.com</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                            >
                                <User size={16} /> Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                            >
                                <Settings size={16} /> Settings
                            </button>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                            >
                                <LogOut size={16} /> Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default DashNavbar