import {
    ArrowLeft,
    Bath,
    Bed,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Expand,
    ExternalLink,
    ImageOff,
    Mail,
    MapPin,
    Maximize2,
    Phone,
    ShieldCheck,
    Video,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingOverlay from '../../components/LoadingOverlay'
import ConfirmModal from '../../components/UI/ConfirmModal'
import ImageLightbox from '../../components/UI/ImagelightBox'
import Modal from '../../components/UI/Modal'
import { useToast } from '../../components/UI/Toast'
import { useApproveListing } from '../../hooks/mutations/allMutation'
import { parseApiError } from '../../hooks/parseapierror'
import { useGetProperty } from '../../hooks/queries/allQueries'

type PersonBase = {
    display_id?: string
    first_name?: string
    last_name?: string
    full_name?: string
    email?: string
    phone?: string
    profile_image?: string | null
}

type OwnerProfile = PersonBase & {
    id?: string
    user_id?: string
    account_status?: string
    verification_status?: string
    is_verified?: boolean
    member_since?: string
}

type StaffProfile = PersonBase & {
    staff_profile_id?: string
    user_id?: string
    staff_role?: string
    account_status?: string
    coverage_area?: string
    availability?: boolean
}

type MediaItem = {
    id?: string
    media_type?: string
    url?: string
    poster?: string
    is_live_walkthrough?: boolean
    captured_at?: string | null
    created_at?: string
}

type PropertyDetail = {
    id?: string
    owner_profile?: OwnerProfile | string | null
    owner_profile_id?: string | null
    verified_by_staff?: StaffProfile | string | null
    verified_by_staff_id?: string | null
    assigned_pvo?: StaffProfile | string | null
    assigned_pvo_id?: string | null
    title?: string
    description?: string
    price?: string | number
    listing_type?: string
    property_type?: string
    listing_source?: string
    pet_policy?: string
    status?: string
    occupancy_status?: string
    health_check_status?: string
    pvo_visit_scheduled_date?: string | null
    state?: string
    city?: string
    lga?: string
    neighbourhood?: string
    street_address?: string
    house_number?: string
    floor_number?: string
    bedrooms?: number
    bathrooms?: number
    area_sq_m?: string | number
    landmark?: string
    rent_frequency?: string
    service_fee?: string | number
    caution_deposit?: string | number
    latitude?: string | number | null
    longitude?: string | number | null
    published_at?: string | null
    rejection_reason?: string
    amenities?: Array<string | { id?: string; name?: string; label?: string }>
    media?: MediaItem[]
    created_at?: string
    updated_at?: string
}

/* ---------- helpers ---------- */

const humanize = (value?: string | null) => {
    if (!value) return '—'
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const formatDate = (value?: string | null) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('en-NG', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

const formatDateTime = (value?: string | null) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return `${formatDate(value)} • ${new Intl.DateTimeFormat('en-NG', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date)}`
}

const formatMoney = (value?: string | number | null) => {
    if (value === undefined || value === null || value === '') return '—'
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isNaN(num)) return String(value)
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(num)
}

const STATUS_LABEL: Record<string, string> = {
    pending_verification: 'Awaiting Final Approval',
    pending_pvo_visit: 'PVO Assigned',
    pvo_assigned: 'PVO Assigned',
    published: 'Published',
    approved: 'Published',
    rejected: 'Rejected',
    suspended: 'Rejected',
    submitted: 'Submitted',
    draft: 'Submitted',
    archived: 'Rejected',
}

const STATUS_STYLE: Record<string, string> = {
    'Awaiting Final Approval': 'bg-amber-50 text-amber-600',
    'PVO Assigned': 'bg-blue-50 text-blue-600',
    Published: 'bg-emerald-50 text-emerald-600',
    Rejected: 'bg-rose-50 text-rose-600',
    Submitted: 'bg-slate-100 text-slate-600',
}

const getStatusLabel = (status?: string) => {
    if (!status) return 'Submitted'
    const key = status.toLowerCase().replace(/\s+/g, '_')
    return STATUS_LABEL[key] ?? humanize(status)
}

const RENT_SUFFIX: Record<string, string> = {
    monthly: '/month',
    yearly: '/year',
    annually: '/year',
    quarterly: '/quarter',
    weekly: '/week',
    daily: '/day',
}

const asObject = <T extends object>(value: T | string | null | undefined): T | null =>
    value && typeof value === 'object' ? value : null

const personName = (p?: PersonBase | null) =>
    p ? p.full_name || `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() : ''

const initials = (name?: string | null) =>
    (name ?? '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('') || '?'

const Avatar = ({ name, src }: { name?: string; src?: string | null }) =>
    src ? (
        <img src={src} alt={name || 'Profile'} className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
    ) : (
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {initials(name)}
        </span>
    )

const InfoCell = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="rounded-xl bg-white/5 px-4 py-3">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold">{value}</p>
    </div>
)

const EmptyState = ({
    title,
    description,
}: {
    title: string
    description: string
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

/* ---------- page ---------- */

const SingleProperty = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [activeImage, setActiveImage] = useState(0)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [showApprove, setShowApprove] = useState(false)
    const [approveError, setApproveError] = useState('')
    const [showReject, setShowReject] = useState(false)

    const { property: response, isLoading, isError, refetch } = useGetProperty(id)
    const approveMutation = useApproveListing()
    const approving = approveMutation.isPending

    const p = (response?.data ?? response) as PropertyDetail | undefined

    const handleApprove = async () => {
        if (!id) return
        setApproveError('')
        try {
            await approveMutation.mutateAsync(id)
            toast.success('Property published', {
                message: p?.title || 'The listing has been approved and published.',
            })
            setShowApprove(false)
            refetch()
        } catch (err) {
            const parsed = parseApiError(err, 'Failed to approve listing.')
            setApproveError(parsed.message)
            toast.error('Could not approve listing', { message: parsed.message })
        }
    }

    const closeApprove = () => {
        if (approving) return
        setShowApprove(false)
        setApproveError('')
    }

    /* ----- states ----- */

    if (isError || (!isLoading && !p)) {
        return (
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
                <EmptyState
                    title="Could not load property"
                    description="The property may not exist, or something went wrong. Please try again."
                />
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (!p) return <LoadingOverlay visible={isLoading} />

    /* ----- derived values ----- */

    const statusLabel = getStatusLabel(p.status)
    const isPublished = statusLabel === 'Published'
    const isRejected = statusLabel === 'Rejected'

    const owner = asObject<OwnerProfile>(p.owner_profile)
    const pvo = asObject<StaffProfile>(p.assigned_pvo)
    const verifier = asObject<StaffProfile>(p.verified_by_staff)
    const ownerName = personName(owner)
    const pvoName = personName(pvo)
    const verifierName = personName(verifier)

    const media = p.media ?? []
    const photos = media.filter((m) => (m.media_type ?? '').toLowerCase() === 'photo' && m.url)
    const videos = media.filter((m) => (m.media_type ?? '').toLowerCase() === 'video' && m.url)
    const hasLiveWalkthrough = media.some((m) => m.is_live_walkthrough)
    const safeActive = photos.length ? Math.min(activeImage, photos.length - 1) : 0
    const currentPhoto = photos.length ? photos[safeActive] : null

    const lightboxImages = photos.map((m) => ({
        url: m.url as string,
        caption: m.is_live_walkthrough
            ? `Live walkthrough${m.captured_at ? ` · ${formatDate(m.captured_at)}` : ''}`
            : undefined,
    }))

    const amenityNames = (p.amenities ?? [])
        .map((a) => (typeof a === 'string' ? '' : (a.name ?? a.label ?? '')))
        .filter(Boolean)

    const locationShort = [p.neighbourhood, p.city, p.state].filter(Boolean).join(', ') || '—'
    const addressLine = [
        [p.house_number, p.street_address].filter(Boolean).join(' '),
        p.floor_number ? `Floor ${p.floor_number}` : '',
        p.lga,
        p.landmark,
    ]
        .filter(Boolean)
        .join(' · ')

    const priceSuffix =
        p.listing_type?.toLowerCase() === 'rent'
            ? (RENT_SUFFIX[(p.rent_frequency ?? '').toLowerCase()] ?? '')
            : ''

    const hasCoords = Boolean(p.latitude && p.longitude)
    const mapsUrl = hasCoords
        ? `https://www.google.com/maps?q=${p.latitude},${p.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            [p.street_address, p.neighbourhood, p.city, p.state].filter(Boolean).join(', ')
        )}`

    const timeline = [
        { label: 'Submitted', date: formatDate(p.created_at), done: true },
        { label: 'Assigned PVO', date: '—', done: Boolean(p.assigned_pvo_id) },
        {
            label: 'Inspection Scheduled',
            date: formatDate(p.pvo_visit_scheduled_date),
            done: Boolean(p.pvo_visit_scheduled_date),
        },
        { label: 'PVO Approval', date: '—', done: Boolean(p.verified_by_staff_id) },
        { label: 'Admin Approval', date: formatDate(p.published_at), done: isPublished },
    ]

    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8" data-property-id={id}>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
                    {/* Left column */}
                    <div className="min-w-0 space-y-4">
                        {/* Image carousel */}
                        <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                            {isPublished && (
                                <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-sm">
                                    <ShieldCheck size={14} /> P-Knock Verified
                                </span>
                            )}

                            {currentPhoto ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setLightboxIndex(safeActive)}
                                        className="group relative block w-full cursor-zoom-in overflow-hidden"
                                        aria-label="View photo full screen"
                                    >
                                        <img
                                            src={currentPhoto.url}
                                            alt={p.title || 'Property'}
                                            className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[380px]"
                                        />
                                        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                            <Maximize2 size={15} />
                                        </span>
                                    </button>
                                    {currentPhoto.is_live_walkthrough && (
                                        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white">
                                            Live walkthrough
                                            {currentPhoto.captured_at
                                                ? ` · ${formatDate(currentPhoto.captured_at)}`
                                                : ''}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-slate-400 sm:h-[380px]">
                                    <ImageOff size={32} />
                                    <p className="text-sm">No photos uploaded yet</p>
                                </div>
                            )}

                            {photos.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveImage((i) => (i === 0 ? photos.length - 1 : i - 1))
                                        }
                                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveImage((i) => (i === photos.length - 1 ? 0 : i + 1))
                                        }
                                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}
                        </div>

                        {photos.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {photos.map((img, i) => (
                                    <button
                                        key={img.id ?? img.url}
                                        type="button"
                                        onClick={() => {
                                            setActiveImage(i)
                                            setLightboxIndex(i)
                                        }}
                                        className={`w-24 flex-shrink-0 cursor-zoom-in overflow-hidden rounded-xl border-2 sm:w-28 ${i === safeActive ? 'border-emerald-500' : 'border-transparent'
                                            }`}
                                        aria-label={`View photo ${i + 1} full screen`}
                                    >
                                        <img src={img.url} alt="" className="h-20 w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Details card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <p className="text-xs font-medium text-blue-600">
                                {humanize(p.property_type)}
                                {p.listing_type ? ` · For ${humanize(p.listing_type)}` : ''}
                            </p>
                            <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                <div className="min-w-0">
                                    <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                        {p.title || 'Untitled property'}
                                    </h1>
                                    <p className="mt-1 text-xs text-slate-400">{locationShort}</p>
                                </div>
                                <p className="whitespace-nowrap text-xl font-extrabold text-slate-900">
                                    {formatMoney(p.price)}{' '}
                                    {priceSuffix && (
                                        <span className="text-xs font-medium text-slate-400">{priceSuffix}</span>
                                    )}
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-100 py-3 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5">
                                    <Bed size={16} className="text-slate-400" />
                                    <strong className="text-slate-900">{p.bedrooms ?? 0}</strong> bedrooms
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Bath size={16} className="text-slate-400" />
                                    <strong className="text-slate-900">{p.bathrooms ?? 0}</strong> bathrooms
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Expand size={16} className="text-slate-400" />
                                    <strong className="text-slate-900">
                                        {p.area_sq_m ? Number(p.area_sq_m) : '—'}
                                    </strong>{' '}
                                    m²
                                </span>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm font-bold text-slate-900">About this property</h3>
                                <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-500">
                                    {p.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="rounded-lg bg-slate-50 px-3 py-2">
                                    <p className="text-[11px] text-slate-400">Service fee</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-800">
                                        {formatMoney(p.service_fee)}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2">
                                    <p className="text-[11px] text-slate-400">Caution deposit</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-800">
                                        {formatMoney(p.caution_deposit)}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2">
                                    <p className="text-[11px] text-slate-400">Pet policy</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-800">
                                        {p.pet_policy || '—'}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-slate-50 px-3 py-2">
                                    <p className="text-[11px] text-slate-400">Occupancy</p>
                                    <p className="mt-0.5 text-xs font-semibold text-slate-800">
                                        {humanize(p.occupancy_status)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <h3 className="text-sm font-bold text-slate-900">Amenities</h3>
                                {amenityNames.length > 0 ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {amenityNames.map((name) => (
                                            <span
                                                key={name}
                                                className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600"
                                            >
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-2 text-xs text-slate-400">
                                        {p.amenities?.length
                                            ? `${p.amenities.length} amenities listed`
                                            : 'No amenities listed.'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Rejection reason */}
                        {isRejected && p.rejection_reason && (
                            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
                                <h3 className="text-sm font-bold text-rose-700">Rejection reason</h3>
                                <p className="mt-1 whitespace-pre-wrap break-words text-xs text-rose-600">
                                    {p.rejection_reason}
                                </p>
                            </div>
                        )}

                        {/* Verification */}
                        <div className="rounded-2xl bg-slate-900 p-5 text-white sm:p-6">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                    <ShieldCheck size={16} />
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold">Verification details</h3>
                                    <p className="text-xs text-slate-400">Physical inspection · GPS · Walkthrough</p>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <InfoCell label="Verification Status" value={statusLabel} />
                                <InfoCell
                                    label="Verified By"
                                    value={
                                        verifierName
                                            ? `${verifierName}${verifier?.display_id ? ` (${verifier.display_id})` : ''}`
                                            : 'Not yet verified'
                                    }
                                />
                                <InfoCell label="PVO Visit" value={formatDateTime(p.pvo_visit_scheduled_date)} />
                                <InfoCell label="Health Status" value={humanize(p.health_check_status)} />
                                <InfoCell label="Listing Source" value={humanize(p.listing_source)} />
                                <InfoCell
                                    label="Live Walkthrough"
                                    value={hasLiveWalkthrough ? 'Available' : 'Not available'}
                                />
                                <InfoCell
                                    label="GPS Coordinates"
                                    value={hasCoords ? `${p.latitude}, ${p.longitude}` : 'Not captured'}
                                />
                                <InfoCell label="Published On" value={formatDate(p.published_at)} />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <MapPin size={16} className="text-slate-400" /> Location
                                    </h3>
                                    <p className="mt-2 text-sm font-medium text-slate-800">{locationShort}</p>
                                    {addressLine && (
                                        <p className="mt-1 break-words text-xs text-slate-500">{addressLine}</p>
                                    )}
                                </div>
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Open in Maps <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <span
                                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[statusLabel] ?? 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                {statusLabel}
                            </span>

                            <h3 className="mt-3 text-sm font-bold text-slate-900">Assigned PVO</h3>
                            {pvo ? (
                                <div className="mt-2 flex items-center gap-3">
                                    <Avatar name={pvoName} src={pvo.profile_image} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {pvoName || 'Unnamed PVO'}
                                        </p>
                                        <p className="truncate text-xs text-slate-400">
                                            {pvo.coverage_area || '—'}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 text-xs text-slate-400">{pvo.display_id}</span>
                                </div>
                            ) : (
                                <p className="mt-2 text-xs text-slate-400">No PVO assigned yet.</p>
                            )}
                            {pvo?.phone && (
                                <a
                                    href={`tel:${pvo.phone}`}
                                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
                                >
                                    <Phone size={12} /> {pvo.phone}
                                </a>
                            )}

                            <ul className="mt-4 space-y-3">
                                {timeline.map((step, i) => (
                                    <li key={step.label} className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2">
                                            {step.done ? (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                                    <Check size={12} />
                                                </span>
                                            ) : (
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                    {i + 1}
                                                </span>
                                            )}
                                            <span className={step.done ? 'text-slate-700' : 'text-slate-400'}>
                                                {step.label}
                                            </span>
                                        </span>
                                        <span className="text-slate-400">{step.date}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => {
                                    setApproveError('')
                                    setShowApprove(true)
                                }}
                                disabled={isPublished}
                                className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {isPublished ? 'Already Published' : 'Approve & Publish'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReject(true)}
                                disabled={isPublished || isRejected}
                                className="mt-2 w-full rounded-xl bg-rose-50 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Decline
                            </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-sm font-bold text-slate-900">Property Owner</h3>
                                <button
                                    type="button"
                                    disabled={!p.owner_profile_id}
                                    onClick={() => navigate(`/admin/property-owners/${p.owner_profile_id}`)}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    View Profile
                                </button>
                            </div>

                            {owner ? (
                                <>
                                    <div className="mt-3 flex items-center gap-3">
                                        <Avatar name={ownerName} src={owner.profile_image} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {ownerName || 'Unnamed owner'}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {owner.display_id}
                                                {owner.member_since
                                                    ? ` · Member since ${formatDate(owner.member_since)}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                                        {owner.email && (
                                            <a
                                                href={`mailto:${owner.email}`}
                                                className="flex items-center gap-1.5 break-all hover:text-slate-700"
                                            >
                                                <Mail size={12} className="flex-shrink-0" /> {owner.email}
                                            </a>
                                        )}
                                        {owner.phone && (
                                            <a
                                                href={`tel:${owner.phone}`}
                                                className="flex items-center gap-1.5 hover:text-slate-700"
                                            >
                                                <Phone size={12} className="flex-shrink-0" /> {owner.phone}
                                            </a>
                                        )}
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${owner.is_verified
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}
                                        >
                                            <ShieldCheck size={12} />
                                            {owner.is_verified ? 'Verified' : humanize(owner.verification_status)}
                                        </span>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${(owner.account_status ?? 'active').toLowerCase() === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {humanize(owner.account_status || 'active')}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="mt-2 text-xs text-slate-400">Owner details not available.</p>
                            )}
                        </div>

                        {/* Walkthrough video (only when a video exists) */}
                        {videos.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <Video size={16} className="text-slate-400" /> Walkthrough Video
                                </h3>
                                <video
                                    key={videos[0].url}
                                    src={videos[0].url}
                                    poster={videos[0].poster || undefined}
                                    controls
                                    preload="metadata"
                                    className="mt-3 h-44 w-full rounded-xl bg-black object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Photo viewer */}
                <ImageLightbox
                    images={lightboxImages}
                    startIndex={lightboxIndex}
                    onClose={(lastIndex) => {
                        setActiveImage(lastIndex)
                        setLightboxIndex(null)
                    }}
                />

                {/* Approve */}
                <Modal
                    open={showApprove}
                    onClose={closeApprove}
                    locked={approving}
                    size="sm"
                    centered
                    icon={
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <CheckCircle2 size={22} />
                        </div>
                    }
                    title="Approve & Publish Property"
                    description={`This will mark ${p.title || 'this property'} as Verified & Published and make it publicly visible on the P-Knock platform. This action cannot be undone.`}
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={closeApprove}
                                disabled={approving}
                                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={approving}
                                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {approving ? 'Publishing…' : 'Confirm & Publish'}
                            </button>
                        </>
                    }
                >
                    {approveError ? (
                        <p className="whitespace-pre-line rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-left text-sm text-red-600">
                            {approveError}
                        </p>
                    ) : null}
                </Modal>

                {/* Reject – TODO: wire to the reject endpoint once available */}
                <ConfirmModal
                    open={showReject}
                    onClose={() => setShowReject(false)}
                    onConfirm={(_reason) => {
                        setShowReject(false)
                    }}
                    title="Reject Property"
                    description="Provide a clear reason for rejection. This will be communicated to the property owner."
                    icon={
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                            <X size={22} />
                        </div>
                    }
                    tone="danger"
                    confirmLabel="Confirm Rejection"
                    reasonLabel="Rejection Reason"
                    reasonPlaceholder="Enter rejection reason..."
                />
            </div>
        </>
    )
}

export default SingleProperty