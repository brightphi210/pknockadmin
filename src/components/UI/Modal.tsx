import { X } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import "../UI/ui-animation.css"


type ModalSize = "sm" | "md" | "lg" | "xl"

const sizeClass: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
}

const EXIT_MS = 180

export type ModalProps = {
    open: boolean
    onClose: () => void
    title?: ReactNode
    description?: ReactNode
    icon?: ReactNode
    size?: ModalSize
    footer?: ReactNode
    children?: ReactNode
    /** Disable closing via backdrop click / Escape (e.g. while submitting) */
    locked?: boolean
    hideCloseButton?: boolean
    centered?: boolean
}

const Modal = ({
    open,
    onClose,
    title,
    description,
    icon,
    size = "lg",
    footer,
    children,
    locked = false,
    hideCloseButton = false,
    centered = false,
}: ModalProps) => {
    const [mounted, setMounted] = useState(open)
    const [closing, setClosing] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)


    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    const lockedRef = useRef(locked)
    useEffect(() => {
        lockedRef.current = locked
    }, [locked])

    // Mount / unmount with exit animation
    useEffect(() => {
        if (open) {
            setMounted(true)
            setClosing(false)
            return
        }
        if (!mounted) return
        setClosing(true)
        const t = setTimeout(() => {
            setMounted(false)
            setClosing(false)
        }, EXIT_MS)
        return () => clearTimeout(t)
    }, [open, mounted])

    // Escape key + body scroll lock
    useEffect(() => {
        if (!mounted) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !lockedRef.current) onCloseRef.current()
        }
        document.addEventListener("keydown", onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        panelRef.current?.focus() // now only on open
        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = prev
        }
    }, [mounted])

    if (!mounted) return null

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4 ${closing ? "ui-overlay-out" : "ui-overlay-in"
                }`}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !locked) onClose()
            }}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-black/5 outline-none sm:rounded-2xl ${sizeClass[size]
                    } ${closing ? "ui-modal-out" : "ui-modal-in"}`}
            >
                {(title || icon) && (
                    <div
                        className={`flex shrink-0 gap-4 px-5 pb-4 pt-5 sm:px-6 sm:pt-6 ${centered ? "flex-col items-center text-center" : "items-start"
                            }`}
                    >
                        {icon && <div className="shrink-0">{icon}</div>}
                        <div className="min-w-0 flex-1">
                            {title && <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>}
                            {description && <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>}
                        </div>
                        {!hideCloseButton && !centered && (
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={locked}
                                aria-label="Close"
                                className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>

                {footer && (
                    <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}

export default Modal