import type { ReactNode } from "react"

export const fieldInputClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 ${hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
    }`

type Props = {
    label: string
    required?: boolean
    error?: string
    children: ReactNode
}

/** Label + control + inline error message. */
const FormField = ({ label, required, error, children }: Props) => (
    <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
)

export default FormField