import { useQueryClient } from '@tanstack/react-query'
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '../hooks/mutations/auth'
import { useUnreadNotificationCount } from '../hooks/queries/allQueries'
import Modal from './UI/Modal'
import { useToast } from './UI/Toast'

interface DashNavbarProps {
    onOpenMobileSidebar: () => void
}

const ACCESS_TOKEN_KEY = 'pknockAdminToken'
const REFRESH_TOKEN_KEY = 'pknockAdminRefreshToken'

const DashNavbar = ({ onOpenMobileSidebar }: DashNavbarProps) => {
    const navigate = useNavigate()
    const toast = useToast()
    const queryClient = useQueryClient()

    const [menuOpen, setMenuOpen] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const { unreadCount, hasMore } = useUnreadNotificationCount()
    const logoutMutation = useLogout()
    const loggingOut = logoutMutation.isPending

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const badgeLabel = unreadCount > 99 ? '99+' : hasMore ? `${unreadCount}+` : String(unreadCount)

    const goTo = (path: string) => {
        setMenuOpen(false)
        navigate(path)
    }

    const openLogoutModal = () => {
        setMenuOpen(false)
        setShowLogoutModal(true)
    }

    const closeLogoutModal = () => {
        if (loggingOut) return
        setShowLogoutModal(false)
    }

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync()
        } catch {
            // Even if the server call fails (e.g. expired token), still sign out locally
        } finally {
            localStorage.removeItem(ACCESS_TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
            setShowLogoutModal(false)
            navigate('/login', { replace: true })
            queryClient.clear()
            toast.success('Logged out', { message: 'You have been signed out successfully.' })
        }
    }

    return (
        <>
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
                        onClick={() => goTo('/admin/notifications')}
                        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
                        aria-label={
                            unreadCount > 0
                                ? `Notifications, ${badgeLabel} unread`
                                : 'Notifications'
                        }
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                                {badgeLabel}
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
                                    onClick={() => goTo('/admin/settings')}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                                >
                                    <Settings size={16} /> Settings
                                </button>
                                <button
                                    type="button"
                                    onClick={openLogoutModal}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                                >
                                    <LogOut size={16} /> Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Logout confirmation */}
            <Modal
                open={showLogoutModal}
                onClose={closeLogoutModal}
                locked={loggingOut}
                size="md"
                centered
                icon={
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                        <LogOut size={26} />
                    </div>
                }
                title="Log out?"
                description="You will be signed out of the admin dashboard and will need to log in again to continue."
                footer={
                    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={closeLogoutModal}
                            disabled={loggingOut}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-60 sm:py-2"
                        >
                            {loggingOut ? 'Logging out…' : 'Yes, log out'}
                        </button>
                    </div>
                }
            >
                {null}
            </Modal>
        </>
    )
}

export default DashNavbar