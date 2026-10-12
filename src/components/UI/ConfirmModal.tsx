import { Loader2 } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import Modal from "./Modal"

type Tone = "danger" | "success" | "primary"

const toneStyles: Record<Tone, { btn: string; ring: string }> = {
    danger: { btn: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500", ring: "bg-red-50 text-red-600" },
    success: { btn: "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500", ring: "bg-emerald-50 text-emerald-600" },
    primary: { btn: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500", ring: "bg-blue-50 text-blue-600" },
}

type Props = {
    open: boolean
    onClose: () => void
    onConfirm: (reason: string) => void | Promise<void>
    title: string
    description: ReactNode
    icon: ReactNode
    tone?: Tone
    confirmLabel: string
    loadingLabel?: string
    loading?: boolean
    /** When set, shows a required textarea and passes its value to onConfirm */
    reasonLabel?: string
    reasonPlaceholder?: string
    error?: string
}

/** Reusable confirm dialog, optionally with a required "reason" field. */
const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    icon,
    tone = "primary",
    confirmLabel,
    loadingLabel,
    loading = false,
    reasonLabel,
    reasonPlaceholder,
    error,
}: Props) => {
    const [reason, setReason] = useState("")
    const t = toneStyles[tone]

    useEffect(() => {
        if (open) setReason("")
    }, [open])

    const needsReason = Boolean(reasonLabel)
    const disabled = loading || (needsReason && !reason.trim())

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="md"
            centered
            locked={loading}
            icon={
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${t.ring}`}>{icon}</div>
            }
            title={title}
            description={description}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:py-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(reason.trim())}
                        disabled={disabled}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2 ${t.btn}`}
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? loadingLabel ?? "Please wait…" : confirmLabel}
                    </button>
                </>
            }
        >
            {needsReason && (
                <div className="text-left">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        {reasonLabel} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={3}
                        autoFocus
                        placeholder={reasonPlaceholder}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                    {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                </div>
            )}
        </Modal>
    )
}

export default ConfirmModal