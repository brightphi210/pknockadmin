import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import "../UI/ui-animation.css"

type ToastType = "success" | "error" | "warning" | "info"

type ToastItem = {
    id: number
    type: ToastType
    title: string
    message?: string
    duration: number
    leaving: boolean
}

type ToastOptions = { message?: string; duration?: number }

type ToastApi = {
    success: (title: string, opts?: ToastOptions) => void
    error: (title: string, opts?: ToastOptions) => void
    warning: (title: string, opts?: ToastOptions) => void
    info: (title: string, opts?: ToastOptions) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const styles: Record<ToastType, { icon: ReactNode; accent: string; bar: string; iconBg: string }> = {
    success: {
        icon: <CheckCircle2 size={18} />,
        accent: "text-emerald-600",
        iconBg: "bg-emerald-50",
        bar: "bg-emerald-500",
    },
    error: {
        icon: <XCircle size={18} />,
        accent: "text-red-600",
        iconBg: "bg-red-50",
        bar: "bg-red-500",
    },
    warning: {
        icon: <AlertTriangle size={18} />,
        accent: "text-amber-600",
        iconBg: "bg-amber-50",
        bar: "bg-amber-500",
    },
    info: {
        icon: <Info size={18} />,
        accent: "text-blue-600",
        iconBg: "bg-blue-50",
        bar: "bg-blue-500",
    },
}

const LEAVE_MS = 220

const ToastCard = ({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) => {
    const s = styles[toast.type]

    useEffect(() => {
        const t = setTimeout(() => onDismiss(toast.id), toast.duration)
        return () => clearTimeout(t)
    }, [toast.id, toast.duration, onDismiss])

    return (
        <div
            role={toast.type === "error" ? "alert" : "status"}
            className={`ui-toast pointer-events-auto relative w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 ${toast.leaving ? "ui-toast-out" : "ui-toast-in"
                }`}
        >
            <div className="flex items-start gap-3 p-3.5 pr-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.iconBg} ${s.accent}`}>
                    {s.icon}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                    {toast.message && (
                        <p className="mt-0.5 whitespace-pre-line break-words text-sm text-slate-500">{toast.message}</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onDismiss(toast.id)}
                    aria-label="Dismiss"
                    className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                    <X size={16} />
                </button>
            </div>
            <div className="h-1 w-full bg-slate-100">
                <div
                    className={`ui-toast-progress h-full w-full ${s.bar}`}
                    style={{ animationDuration: `${toast.duration}ms` }}
                />
            </div>
        </div>
    )
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const idRef = useRef(0)

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), LEAVE_MS)
    }, [])

    const push = useCallback((type: ToastType, title: string, opts?: ToastOptions) => {
        const id = ++idRef.current
        setToasts((prev) => [
            ...prev.slice(-4),
            { id, type, title, message: opts?.message, duration: opts?.duration ?? 4500, leaving: false },
        ])
    }, [])

    const api = useMemo<ToastApi>(
        () => ({
            success: (t, o) => push("success", t, o),
            error: (t, o) => push("error", t, { duration: 6500, ...o }),
            warning: (t, o) => push("warning", t, o),
            info: (t, o) => push("info", t, o),
        }),
        [push]
    )

    return (
        <ToastContext.Provider value={api}>
            {children}
            {createPortal(
                <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2.5 p-4 sm:inset-x-auto sm:right-0 sm:w-[26rem] sm:items-stretch">
                    {toasts.map((t) => (
                        <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
    return ctx
}