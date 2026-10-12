import {
    ArrowLeft,
    Bath,
    BatteryCharging,
    Bed,
    Car,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Dumbbell,
    Expand,
    Fan,
    Lock,
    Maximize,
    Phone,
    PlayCircle,
    Plus,
    ShieldCheck,
    Star,
    Video,
    Wifi,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmModal from '../../components/UI/ConfirmModal'
import Modal from '../../components/UI/Modal'

const images = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
]

const amenities = [
    { label: 'Swimming Pool', icon: Wifi },
    { label: 'Gym', icon: Dumbbell },
    { label: '24/7 Security', icon: Lock },
    { label: 'Backup Power', icon: BatteryCharging },
    { label: 'Covered Parking', icon: Car },
    { label: 'Elevator', icon: Fan },
    { label: 'CCTV', icon: Video },
    { label: 'Water Treatment', icon: ShieldCheck },
    { label: 'Intercom', icon: Phone },
    { label: 'Balcony', icon: Maximize },
]

const timeline = [
    { label: 'Submitted', date: 'Jul 20, 2026', done: true },
    { label: 'Assigned PVO', date: 'Jul 21, 2026', done: true },
    { label: 'Inspection Scheduled', date: 'Jul 21, 2026', done: true },
    { label: 'PVO Approval', date: 'Jul 25, 2026', done: true },
    { label: 'Admin Approval', date: '-', done: false },
]

const verification = [
    { label: 'Verification Status', value: 'Verified' },
    { label: 'Verified By', value: 'Inspector Chidi Okonkwo' },
    { label: 'Verification Date', value: 'Jan 15, 2025' },
    { label: 'GPS Verified', value: 'Confirmed' },
    { label: 'Live Walkthrough', value: 'Available' },
    { label: 'Owner Verified', value: 'Verified' },
    { label: 'Health Status', value: 'Excellent' },
]

const SingleProperty = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeImage, setActiveImage] = useState(0)
    const [showApprove, setShowApprove] = useState(false)
    const [showReject, setShowReject] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')

    return (
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
                <div className="space-y-4">
                    {/* Image carousel */}
                    <div className="relative overflow-hidden rounded-2xl">
                        <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-sm">
                            <ShieldCheck size={14} /> P-Knock Verified
                        </span>
                        <img src={images[activeImage]} alt="Property" className="h-[280px] w-full object-cover sm:h-[380px]" />
                        <button
                            type="button"
                            onClick={() => setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))}
                            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))}
                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {images.map((img, i) => (
                            <button
                                key={img}
                                type="button"
                                onClick={() => setActiveImage(i)}
                                className={`overflow-hidden rounded-xl border-2 ${activeImage === i ? 'border-emerald-500' : 'border-transparent'
                                    }`}
                            >
                                <img src={img} alt="" className="h-20 w-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Details card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-xs font-medium text-blue-600">Apartment</p>
                        <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                            <div>
                                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                                    3-Bedroom Luxury Apartment, Lekki Phase 1
                                </h1>
                                <p className="mt-1 text-xs text-slate-400">Lekki Phase 1, Lagos</p>
                            </div>
                            <p className="whitespace-nowrap text-xl font-extrabold text-slate-900">
                                ₦450k <span className="text-xs font-medium text-slate-400">/year</span>
                            </p>
                        </div>

                        <div className="mt-4 flex items-center gap-6 border-y border-slate-100 py-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <Bed size={16} className="text-slate-400" /> <strong className="text-slate-900">3</strong> bedrooms
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Bath size={16} className="text-slate-400" /> <strong className="text-slate-900">3</strong> bathrooms
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Expand size={16} className="text-slate-400" /> <strong className="text-slate-900">185</strong> m²
                            </span>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-sm font-bold text-slate-900">About this property</h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                A stunning 3-bedroom luxury apartment on the prestigious Admiralty Way in Lekki Phase 1.
                                This fully serviced apartment features a modern open-plan kitchen, spacious living areas,
                                and a private balcony with panoramic views. The compound offers 24/7 security, backup
                                power, and a swimming pool.
                            </p>
                        </div>

                        <div className="mt-5">
                            <h3 className="text-sm font-bold text-slate-900">Amenities</h3>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {amenities.map((a) => (
                                    <div key={a.label} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                        <a.icon size={15} className="text-emerald-600" />
                                        {a.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Verified by P-Knock */}
                    <div className="rounded-2xl bg-slate-900 p-5 text-white sm:p-6">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                <ShieldCheck size={16} />
                            </span>
                            <div>
                                <h3 className="text-sm font-bold">Verified by P-Knock</h3>
                                <p className="text-xs text-slate-400">Physical inspection · GPS · Walkthrough</p>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {verification.map((v) => (
                                <div key={v.label} className="rounded-xl bg-white/5 px-4 py-3">
                                    <p className="text-[11px] text-slate-400">{v.label}</p>
                                    <p className="mt-0.5 text-sm font-semibold">{v.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-100">
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
                            alt="Map"
                            className="h-full w-full object-cover opacity-80"
                        />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
                            Lekki Phase 1, Lagos
                        </div>
                        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg bg-white shadow">
                            <button type="button" className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-50">
                                <Plus size={16} />
                            </button>
                            <div className="h-px bg-slate-100" />
                            <button type="button" className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-50">
                                —
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <span className="inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                            Awaiting Final Approval
                        </span>

                        <h3 className="mt-3 text-sm font-bold text-slate-900">Assigned PVO</h3>
                        <div className="mt-2 flex items-center gap-3">
                            <img
                                src="https://i.pravatar.cc/64?img=32"
                                alt="Fatima Hassan"
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900">Fatima Hassan</p>
                                <p className="flex items-center gap-1 text-xs text-amber-500">
                                    <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 rating
                                </p>
                            </div>
                            <span className="text-xs text-slate-400">PVO-002</span>
                        </div>

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
                                        <span className={step.done ? 'text-slate-700' : 'text-slate-400'}>{step.label}</span>
                                    </span>
                                    <span className="text-slate-400">{step.date}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => setShowApprove(true)}
                            className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            Approve & Publish
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowReject(true)}
                            className="mt-2 w-full rounded-xl bg-rose-50 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                        >
                            Decline
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">Property Owner</h3>
                            <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                                View Profile
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                            <img
                                src="https://i.pravatar.cc/64?img=51"
                                alt="Mr. Emeka Adeyemi"
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Mr. Emeka Adeyemi</p>
                                <p className="flex items-center gap-1 text-xs text-amber-500">
                                    <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 rating
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Video size={16} className="text-slate-400" /> Walkthrough Video
                        </h3>
                        <div className="relative mt-3 overflow-hidden rounded-xl">
                            <img
                                src="https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?w=600"
                                alt="Walkthrough"
                                className="h-40 w-full object-cover"
                            />
                            <button
                                type="button"
                                className="absolute inset-0 flex items-center justify-center bg-black/20 text-white hover:bg-black/30"
                                aria-label="Play walkthrough video"
                            >
                                <PlayCircle size={40} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={showApprove}
                onClose={() => setShowApprove(false)}
                size="sm"
                centered
                icon={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <CheckCircle2 size={22} />
                    </div>
                }
                title="Approve & Publish Property"
                description="This will mark 3 Bedroom Apartment at Lekki Phase 1 as Verified & Published and make it publicly visible on the P-Knock platform. This action cannot be undone."
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowApprove(false)}
                            className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowApprove(false)}
                            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            Confirm & Publish
                        </button>
                    </>
                }
            />

            <ConfirmModal
                open={showReject}
                onClose={() => setShowReject(false)}
                onConfirm={(reason) => {
                    setRejectionReason(reason)
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
    )
}

export default SingleProperty