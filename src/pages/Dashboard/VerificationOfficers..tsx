import {
    Ban,
    CheckCircle2,
    Eye,
    EyeOff,
    Info,
    Plus,
    RotateCcw,
    Search
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoadingOverlay from "../../components/LoadingOverlay"
import ActionsMenu from "../../components/UI/ActionMenu"
import ConfirmModal from "../../components/UI/ConfirmModal"
import FormField, { fieldInputClass } from "../../components/UI/FormField"
import Modal from "../../components/UI/Modal"
import { useToast } from "../../components/UI/Toast"
import {
    useCreateStaff,
    useReactivateUser,
    useSuspendUser
} from "../../hooks/mutations/allMutation"
import { parseApiError } from "../../hooks/parseapierror"
import { useGetStaff } from "../../hooks/queries/allQueries"

/* ---------- Types & helpers ---------- */

type OfficerRow = {
    id: string
    user_id: string
    displayId: string
    name: string
    coverage: string
    status: "Active" | "Suspended"
    assigned: number
    completed: number
    pending: number
    lastActive: string
}

const emptyForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    date_of_birth: "",
    state_of_origin: "",
    nationality: "Nigerian",
    coverage_area: "",
}
type FormState = typeof emptyForm
type FormErrors = Partial<Record<keyof FormState, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9\s-]{7,16}$/

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

const fieldLabels: Record<string, string> = {
    first_name: "First name",
    last_name: "Last name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    gender: "Gender",
    date_of_birth: "Date of birth",
    state_of_origin: "State of origin",
    nationality: "Nationality",
    coverage_area: "Coverage area",
    profile_image: "Profile image",
}

const validate = (f: FormState): FormErrors => {
    const e: FormErrors = {}
    if (!f.first_name.trim()) e.first_name = "First name is required."
    if (!f.last_name.trim()) e.last_name = "Last name is required."
    if (!f.email.trim()) e.email = "Email address is required."
    else if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address."
    if (!f.phone.trim()) e.phone = "Phone number is required."
    else if (!PHONE_RE.test(f.phone.trim())) e.phone = "Enter a valid phone number."
    if (!f.password.trim()) e.password = "Password is required."
    else if (f.password.trim().length < 8) e.password = "Password must be at least 8 characters."
    if (!f.gender) e.gender = "Select a gender."
    if (!f.coverage_area) e.coverage_area = "Select a coverage area."
    return e
}

const StatusBadge = ({ status }: { status: string }) => {
    const isActive = status === "Active"
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-amber-500"}`} />
            {status}
        </span>
    )
}

const EmptyState = ({
    title,
    description,
}: {
    title: string
    description: string
    onAction?: () => void
}) => (
    <div className="flex min-h-80 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white px-6 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                !
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    </div>
)

/* ---------- Page ---------- */

const VerificationOfficers = () => {
    const navigate = useNavigate()
    const toast = useToast()

    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [selectedOfficer, setSelectedOfficer] = useState<OfficerRow | null>(null)
    const [action, setAction] = useState<"suspend" | "reactivate" | null>(null)
    const [actionError, setActionError] = useState("")

    const [form, setForm] = useState<FormState>(emptyForm)
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
    const [formError, setFormError] = useState("")

    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageError, setImageError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { staff, isLoading, isError, refetch } = useGetStaff(page)
    const createMutation = useCreateStaff()
    const suspendMutation = useSuspendUser()
    const reactivateMutation = useReactivateUser()

    console.log("staff response", staff?.data)

    const data = (staff?.data ?? staff) as
        | { count?: number; previous?: string | null; next?: string | null; results?: any[] }
        | any[]
        | undefined

    const officers: OfficerRow[] = useMemo(() => {
        const results = Array.isArray(data)
            ? data
            : data && typeof data === "object" && Array.isArray(data.results)
                ? data.results
                : []

        return results.map((s: any) => ({
            id: s.id,
            user_id: s.user_id || "--",
            displayId: s.display_id || "--",
            name: `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim(),
            coverage: s.coverage_area || "--",
            status: s.account_status === "suspended" ? "Suspended" : "Active",
            assigned: s.assigned_count ?? 0,
            completed: s.completed_count ?? 0,
            pending: s.pending_count ?? 0,
            lastActive: s.last_active || "—",
        }))
    }, [data])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return officers
        return officers.filter(
            (o) =>
                o.name.toLowerCase().includes(q) ||
                o.displayId.toLowerCase().includes(q) ||
                o.coverage.toLowerCase().includes(q)
        )
    }, [officers, search])

    const paged = data && !Array.isArray(data) && typeof data === "object" ? data : undefined
    const totalCount = paged?.count ?? officers.length
    const hasPreviousPage = Boolean(paged?.previous)
    const hasNextPage = Boolean(paged?.next)
    const activeCount = officers.filter((o) => o.status === "Active").length
    const suspendedCount = officers.length - activeCount

    /* ----- image preview lifecycle ----- */

    useEffect(() => {
        if (!profileImage) {
            setImagePreview(null)
            return
        }
        const url = URL.createObjectURL(profileImage)
        setImagePreview(url)
        return () => URL.revokeObjectURL(url)
    }, [profileImage])

    /* ----- create ----- */

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((f) => ({ ...f, [key]: value }))
        setFieldErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
        setFormError("")
    }

    const clearImage = () => {
        setProfileImage(null)
        setImageError("")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setFormError("")
        if (!file) {
            clearImage()
            return
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setImageError("Use a JPG, PNG or WEBP image.")
            setProfileImage(null)
            e.target.value = ""
            return
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setImageError("Image must be 2MB or smaller.")
            setProfileImage(null)
            e.target.value = ""
            return
        }
        setImageError("")
        setProfileImage(file)
    }

    const closeCreate = () => {
        if (createMutation.isPending) return
        setShowCreateModal(false)
        setShowPassword(false)
        setFieldErrors({})
        setFormError("")
        setImageError("")
    }

    const handleCreate = async () => {
        setFormError("")
        const errors = validate(form)
        setFieldErrors(errors)
        if (Object.keys(errors).length || imageError) {
            setFormError("Please fix the highlighted fields.")
            return
        }

        const body: any = {
            user: {
                email: form.email.trim(),
                phone: form.phone.trim(),
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                password: form.password.trim(),
                gender: form.gender as "M" | "F",
                date_of_birth: form.date_of_birth || null,
                state_of_origin: form.state_of_origin || "Lagos State",
                nationality: form.nationality || "Nigerian",
            },
            staff_role: "pvo",
            coverage_area: form.coverage_area,
            availability: true,
            active: true,
        }

        try {
            await createMutation.mutateAsync(body)
            setShowCreateModal(false)
            toast.success("Officer created", {
                message: `${form.first_name.trim()} ${form.last_name.trim()} was added.`,
            })
            setForm(emptyForm)
            setFieldErrors({})
            clearImage()
            setShowSuccessModal(true)
            refetch()
        } catch (err) {
            const parsed = parseApiError(err, "Failed to create officer.")

            const mapped: FormErrors = {}
            const leftovers: string[] = []
            for (const [rawKey, msg] of Object.entries(parsed.fieldErrors)) {
                // Server may nest errors under "user" (e.g. "user.email")
                const key = rawKey.replace(/^user[._]/, "")
                if (key === "profile_image") setImageError(msg)
                else if (key in emptyForm) mapped[key as keyof FormState] = msg
                else leftovers.push(`${fieldLabels[key] ?? key.replace(/_/g, " ")}: ${msg}`)
            }
            setFieldErrors(mapped)

            const banner = leftovers.length
                ? leftovers.join("\n")
                : Object.keys(mapped).length
                    ? "Please fix the highlighted fields."
                    : parsed.message
            setFormError(banner)
            toast.error("Could not create officer", { message: banner })
        }
    }

    /* ----- suspend / reactivate ----- */

    const openAction = (officer: OfficerRow, type: "suspend" | "reactivate") => {
        setSelectedOfficer(officer)
        setActionError("")
        setAction(type)
    }

    const closeAction = () => {
        if (suspendMutation.isPending || reactivateMutation.isPending) return
        setAction(null)
    }

    const handleAction = async (reason: string) => {
        if (!selectedOfficer || !action || !reason) return

        // Prefer user_id (accounts/users/:id), fall back to id
        const id = selectedOfficer.user_id || selectedOfficer.id
        if (!id || id === "--") return

        const mutation = action === "suspend" ? suspendMutation : reactivateMutation
        try {
            await mutation.mutateAsync({ id, reason })
            toast.success(action === "suspend" ? "Account suspended" : "Account reactivated", {
                message: selectedOfficer.name,
            })
            setAction(null)
            refetch()
        } catch (err) {
            const parsed = parseApiError(err, `Failed to ${action} account.`)
            setActionError(parsed.message)
            toast.error(`Could not ${action} account`, { message: parsed.message })
        }
    }

    /* ----- render ----- */

    if (isError) {
        return (
            <EmptyState
                title="Could not load verification officers"
                description="Please refresh the page or try again in a few moments."
                onAction={() => refetch()}
            />
        )
    }

    const creating = createMutation.isPending

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                            Verification Officers
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {totalCount} officers total · {activeCount} active · {suspendedCount}{" "}
                            suspended (this page)
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
                    >
                        <Plus size={18} />
                        Create Verification Officer
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 p-4">
                        <div className="relative w-full md:max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search by name, ID or area"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="whitespace-nowrap bg-gray-50 text-left font-medium text-gray-500">
                                    <th className="px-6 py-3">Officer</th>
                                    <th className="px-6 py-3">PVO ID</th>
                                    <th className="px-6 py-3">Coverage Area</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-center">Assigned</th>
                                    <th className="px-6 py-3 text-center">Completed</th>
                                    <th className="px-6 py-3 text-center">Pending</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {!filtered.length ? (
                                    <tr>
                                        <td colSpan={9}>
                                            <EmptyState
                                                title="No verification officers found"
                                                description={
                                                    search
                                                        ? "No officers on this page match your search."
                                                        : "There are no officers for this page yet."
                                                }
                                            />
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((officer) => (
                                        <tr
                                            key={officer.user_id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                                {officer.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                                                {officer.displayId}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {officer.coverage}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={officer.status} />
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700">
                                                {officer.assigned}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700">
                                                {officer.completed}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700">
                                                {officer.pending}
                                            </td>
                                            <td className="px-6 py-4">
                                                <ActionsMenu
                                                    open={openMenuId === officer.user_id}
                                                    onToggle={() =>
                                                        setOpenMenuId((prev) =>
                                                            prev === officer.user_id
                                                                ? null
                                                                : officer.user_id
                                                        )
                                                    }
                                                    onClose={() => setOpenMenuId(null)}
                                                    onView={() =>
                                                        navigate(
                                                            `/admin/verification-officers/${officer.user_id}`
                                                        )
                                                    }
                                                    onSuspend={() =>
                                                        openAction(officer, "suspend")
                                                    }
                                                    onReactivate={() =>
                                                        openAction(officer, "reactivate")
                                                    }
                                                    isActive={officer.status === "Active"}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
                        {filtered.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    title="No verification officers found"
                                    description="There are no officers for this page yet."
                                />
                            </div>
                        ) : (
                            filtered.map((officer) => (
                                <div
                                    key={officer.id}
                                    className="rounded-xl border border-gray-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-gray-900">
                                                {officer.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {officer.displayId}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={officer.status} />
                                            <ActionsMenu
                                                open={openMenuId === officer.id}
                                                onToggle={() =>
                                                    setOpenMenuId((prev) =>
                                                        prev === officer.id ? null : officer.id
                                                    )
                                                }
                                                onClose={() => setOpenMenuId(null)}
                                                onView={() =>
                                                    navigate(
                                                        `/admin/verification-officers/${officer.id}`
                                                    )
                                                }
                                                onSuspend={() => openAction(officer, "suspend")}
                                                onReactivate={() =>
                                                    openAction(officer, "reactivate")
                                                }
                                                isActive={officer.status === "Active"}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">{officer.coverage}</p>
                                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center">
                                        {[
                                            ["Assigned", officer.assigned],
                                            ["Completed", officer.completed],
                                            ["Pending", officer.pending],
                                        ].map(([label, value]) => (
                                            <div key={label as string}>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {value}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:px-6">
                        <p className="text-sm text-gray-500">Page {page}</p>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={!hasPreviousPage || page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="h-8 w-8 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                ‹
                            </button>
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-sm font-medium text-white">
                                {page}
                            </span>
                            <button
                                disabled={!hasNextPage}
                                onClick={() => setPage((p) => p + 1)}
                                className="h-8 w-8 rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create officer */}
            <Modal
                open={showCreateModal}
                onClose={closeCreate}
                locked={creating}
                size="lg"
                title="Create Verification Officer"
                description="PVO accounts can only be created by administrators. Login credentials are generated and emailed automatically."
                footer={
                    <>
                        <button
                            type="button"
                            onClick={closeCreate}
                            disabled={creating}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={creating}
                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 sm:py-2"
                        >
                            {creating ? "Creating…" : "Create Account"}
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    {/* Avatar / profile image */}
                    <div className="flex flex-col items-center gap-2 pt-1">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="h-16 w-16 rounded-full object-cover shadow-md ring-4 ring-slate-100"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-xl font-semibold uppercase text-white shadow-md ring-4 ring-slate-100">
                                {(form.first_name[0] || "P") + (form.last_name[0] || "V")}
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                            <label className="cursor-pointer font-medium text-blue-600 hover:text-blue-700">
                                {profileImage ? "Change photo" : "Upload photo (optional)"}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    disabled={creating}
                                    className="hidden"
                                />
                            </label>
                            {profileImage && (
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    disabled={creating}
                                    className="font-medium text-slate-500 hover:text-slate-700"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        {imageError ? (
                            <p className="text-xs text-red-600">{imageError}</p>
                        ) : (
                            <p className="text-xs text-slate-400">JPG, PNG or WEBP, up to 2MB</p>
                        )}
                    </div>

                    {formError && (
                        <p className="whitespace-pre-line rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                            {formError}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="First Name" required error={fieldErrors.first_name}>
                            <input
                                type="text"
                                placeholder="Enter first name"
                                value={form.first_name}
                                onChange={(e) => setField("first_name", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.first_name)}
                            />
                        </FormField>
                        <FormField label="Last Name" required error={fieldErrors.last_name}>
                            <input
                                type="text"
                                placeholder="Enter last name"
                                value={form.last_name}
                                onChange={(e) => setField("last_name", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.last_name)}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Email Address" required error={fieldErrors.email}>
                            <input
                                type="email"
                                placeholder="officer@example.com"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.email)}
                            />
                        </FormField>
                        <FormField label="Phone Number" required error={fieldErrors.phone}>
                            <input
                                type="tel"
                                placeholder="+234 000 0000 000"
                                value={form.phone}
                                onChange={(e) => setField("phone", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.phone)}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Password" required error={fieldErrors.password}>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter a secure password"
                                    value={form.password}
                                    onChange={(e) => setField("password", e.target.value)}
                                    className={`${fieldInputClass(!!fieldErrors.password)} pr-11`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition-colors hover:text-slate-700"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </FormField>
                        <FormField label="PVO ID">
                            <input
                                type="text"
                                value="Auto-Generated"
                                disabled
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400"
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Gender" required error={fieldErrors.gender}>
                            <select
                                value={form.gender}
                                onChange={(e) => setField("gender", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.gender)}
                            >
                                <option value="">Select</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </FormField>
                        <FormField label="Date of Birth" error={fieldErrors.date_of_birth}>
                            <input
                                type="date"
                                value={form.date_of_birth}
                                onChange={(e) => setField("date_of_birth", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.date_of_birth)}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="State of Origin" error={fieldErrors.state_of_origin}>
                            <select
                                value={form.state_of_origin}
                                onChange={(e) => setField("state_of_origin", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.state_of_origin)}
                            >
                                <option value="">Select</option>
                                <option value="Lagos State">Lagos State</option>
                                <option value="Abuja">Abuja</option>
                                <option value="Rivers State">Rivers State</option>
                                <option value="Ogun State">Ogun State</option>
                            </select>
                        </FormField>
                        <FormField label="Nationality" error={fieldErrors.nationality}>
                            <select
                                value={form.nationality}
                                onChange={(e) => setField("nationality", e.target.value)}
                                className={fieldInputClass(!!fieldErrors.nationality)}
                            >
                                <option value="Nigerian">Nigerian</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Coverage Area" required error={fieldErrors.coverage_area}>
                        <select
                            value={form.coverage_area}
                            onChange={(e) => setField("coverage_area", e.target.value)}
                            className={fieldInputClass(!!fieldErrors.coverage_area)}
                        >
                            <option value="">Select</option>
                            <option value="Lekki / Eti-Osa">Lekki / Eti-Osa</option>
                            <option value="Lagos Island / Victoria Island">
                                Lagos Island / Victoria Island
                            </option>
                            <option value="Ikeja / Allen Avenue">Ikeja / Allen Avenue</option>
                            <option value="Surulere / Ojuelegba">Surulere / Ojuelegba</option>
                            <option value="Yaba / Tech Hub">Yaba / Tech Hub</option>
                            <option value="Festac Town / Amuwo-Odofin">
                                Festac Town / Amuwo-Odofin
                            </option>
                        </select>
                    </FormField>
                </div>
            </Modal>

            {/* Success */}
            <Modal
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                size="md"
                centered
                icon={
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={28} />
                    </div>
                }
                title="PVO Account Created"
                description="The account has been created successfully and the password entered during setup is now active."
                footer={
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        Done
                    </button>
                }
            >
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-left">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-400 text-white">
                        <Info size={12} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-800">Security notice</p>
                        <p className="mt-0.5 text-sm text-amber-700">
                            The temporary password has been sent to the officer’s email. For
                            security reasons, it is not displayed here.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Suspend */}
            <ConfirmModal
                open={action === "suspend" && !!selectedOfficer}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="danger"
                icon={<Ban size={26} />}
                title="Suspend Account"
                description={
                    <>
                        Suspending{" "}
                        <span className="font-medium text-slate-800">
                            {selectedOfficer?.name}
                        </span>
                        ’s account will block them from signing in and receiving new verification
                        assignments.
                    </>
                }
                reasonLabel="Reason for suspension"
                reasonPlaceholder="e.g. Multiple complaints received, pending investigation…"
                confirmLabel="Suspend Account"
                loadingLabel="Suspending…"
                loading={suspendMutation.isPending}
                error={actionError}
            />

            {/* Reactivate */}
            <ConfirmModal
                open={action === "reactivate" && !!selectedOfficer}
                onClose={closeAction}
                onConfirm={handleAction}
                tone="success"
                icon={<RotateCcw size={26} />}
                title="Reactivate Account"
                description={
                    <>
                        Reactivating{" "}
                        <span className="font-medium text-slate-800">
                            {selectedOfficer?.name}
                        </span>
                        ’s account will restore their access and let them receive new verification
                        assignments.
                    </>
                }
                reasonLabel="Reason for reactivating"
                reasonPlaceholder="e.g. Investigation completed, no further issues found…"
                confirmLabel="Reactivate Account"
                loadingLabel="Reactivating…"
                loading={reactivateMutation.isPending}
                error={actionError}
            />
        </>
    )
}

export default VerificationOfficers