import {
    ArrowLeft,
    Ban,
    Building2,
    CheckCircle2,
    ChevronDown,
    Clock,
    Landmark,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Star,
    UserCheck,
    Wallet
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type Tab = 'Overview' | 'Properties' | 'Bank'

const stats = [
    { label: 'Total Earned', value: '₦12,400,000', icon: Wallet, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Total Properties', value: '5', icon: Building2, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
    { label: 'Verified & Published', value: '4', icon: ShieldCheck, iconBg: 'bg-sky-50', iconColor: 'text-sky-600' },
    { label: 'Currently Occupied', value: '2', icon: UserCheck, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Pending Review', value: '1', icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
]

const personalDetails = [
    { label: 'First Name', value: 'Adewale' },
    { label: 'Last Name', value: 'Okonkwo' },
    { label: 'Email Address', value: 'adewale@example.com' },
    { label: 'Phone Number', value: '+234 800 000 0000' },
    { label: 'Gender', value: 'Male (M)' },
    { label: 'Date of Birth (Optional)', value: '23 May, 1998' },
    { label: 'State of Origin', value: 'Lagos State' },
    { label: 'Nationality', value: 'Nigeria' },
    { label: 'Residential Address', value: '14 Adeola Hopewell, Victoria Island, Lagos' },
    { label: 'Member Since', value: 'Nov 20, 2023' },
]

const ownerProperties = [
    { id: '1', title: '3 Bedroom Apartment at Lekki Phase 1', location: 'Lekki Phase 1, Lagos', type: 'Apartment', price: '₦2,500,000', status: 'Awaiting Final Approval', submitted: 'Jul 25, 2026' },
    { id: '2', title: '4 Bedroom Duplex in Victoria Island', location: 'Victoria Island, Lagos', type: 'Duplex', price: '₦5,750,000', status: 'PVO Assigned', submitted: 'Aug 10, 2026' },
    { id: '3', title: 'Luxury 5 Bedroom Villa in Banana Island', location: 'Banana Island, Lagos', type: 'Villa', price: '₦12,000,000', status: 'Published', submitted: 'Sep 15, 2026' },
    { id: '4', title: '2 Bedroom Flat at Ikeja GRA', location: 'Ikeja GRA, Lagos', type: 'Flat', price: '₦1,750,000', status: 'Published', submitted: 'Oct 05, 2026' },
    { id: '5', title: 'Modern Studio Apartment in Yaba', location: 'Yaba, Lagos', type: 'Studio', price: '₦900,000', status: 'Published', submitted: 'Nov 12, 2026' },
]

const statusStyles: Record<string, string> = {
    'Awaiting Final Approval': 'bg-amber-50 text-amber-600 border border-amber-100',
    'PVO Assigned': 'bg-blue-50 text-blue-600 border border-blue-100',
    Published: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    Rejected: 'bg-rose-50 text-rose-600 border border-rose-100',
    Submitted: 'bg-slate-100 text-slate-600 border border-slate-200',
}

const tabs: Tab[] = ['Overview', 'Properties', 'Bank']

const SinglePropertyOwners = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>('Overview')

    return (
        <div className="space-y-4 p-4 sm:p-6 lg:p-8" data-owner-id={id}>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Go back"
            >
                <ArrowLeft size={20} />
            </button>

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <img
                        src="https://i.pravatar.cc/96?img=51"
                        alt="Mr. Emeka Adeyemi"
                        className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h1 className="text-base font-extrabold text-slate-900 sm:text-lg">Mr. Emeka Adeyemi</h1>
                            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                                Verified
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Property Owner &bull; Member since Nov 20, 2023</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 rating
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 break-all">
                                <Mail size={13} className="flex-shrink-0" /> emeka@nwosu.com
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Phone size={13} className="flex-shrink-0" /> +234 811 111 2222
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="flex h-fit w-full items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 sm:w-auto sm:flex-shrink-0"
                >
                    <Ban size={14} /> Suspend
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {stats.map((s, i) => (
                    <div
                        key={s.label}
                        className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${i === 0 ? 'col-span-2 sm:col-span-1' : ''
                            }`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-slate-500">{s.label}</p>
                            <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}>
                                <s.icon size={16} />
                            </span>
                        </div>
                        <p className="mt-2 break-words text-lg font-bold text-slate-900 sm:text-xl">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="inline-flex w-full items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-xl px-5 py-2 text-xs font-semibold transition-colors sm:flex-none ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                            {personalDetails.map((d) => (
                                <div key={d.label} className="min-w-0">
                                    <p className="text-xs text-slate-400">{d.label}</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-slate-900">{d.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <CheckCircle2 size={16} className="text-slate-900" /> Email Address
                                </h3>
                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                                    Verified
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-slate-400">Verified via OTP</p>
                            <p className="mt-1 break-all text-sm font-semibold text-slate-900">adewale@example.com</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <ShieldCheck size={16} className="text-blue-600" /> KYC / Identity
                                </h3>
                                <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                                    Pending
                                </span>
                            </div>
                            <button type="button" className="mt-3 flex w-full items-center justify-between gap-2 text-left text-xs text-slate-400">
                                Identity documents submitted for review
                                <ChevronDown size={14} className="flex-shrink-0" />
                            </button>
                            <p className="mt-2 text-sm font-semibold text-slate-900">National Identity Card</p>
                            <img
                                src="https://images.unsplash.com/photo-1621252179027-94459d278660?w=600"
                                alt="National Identity Card"
                                className="mt-3 w-full rounded-xl border border-slate-100 object-cover"
                            />
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <button type="button" className="rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                                    Approve
                                </button>
                                <button type="button" className="rounded-xl bg-rose-50 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100">
                                    Reject
                                </button>
                                <button type="button" className="rounded-xl bg-amber-50 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-100">
                                    Need Info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Properties */}
            {activeTab === 'Properties' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[760px] border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                    <th className="pb-3 pr-4 font-medium">Property</th>
                                    <th className="pb-3 pr-4 font-medium">Type</th>
                                    <th className="pb-3 pr-4 font-medium">Price/Yr</th>
                                    <th className="pb-3 pr-4 font-medium">Status</th>
                                    <th className="pb-3 pr-4 font-medium">Submitted</th>
                                    <th className="pb-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {ownerProperties.map((p) => (
                                    <tr key={p.id} className="text-xs">
                                        <td className="max-w-[220px] py-4 pr-4">
                                            <p className="truncate text-sm font-semibold text-slate-900">{p.title}</p>
                                            <p className="mt-1 flex items-center gap-1 text-slate-400">
                                                <MapPin size={12} /> {p.location}
                                            </p>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-600">{p.type}</span>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-900">{p.price}</td>
                                        <td className="py-4 pr-4">
                                            <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-medium ${statusStyles[p.status]}`}>{p.status}</span>
                                        </td>
                                        <td className="py-4 pr-4 whitespace-nowrap text-slate-500">{p.submitted}</td>
                                        <td className="py-4">
                                            <a href={`/admin/properties/${p.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="grid grid-cols-1 gap-3 md:hidden">
                        {ownerProperties.map((p) => (
                            <div key={p.id} className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                            <MapPin size={12} className="flex-shrink-0" /> {p.location}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                                        {p.type}
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[p.status]}`}>
                                        {p.status}
                                    </span>
                                </div>

                                <dl className="mt-3 space-y-1.5 text-xs">
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-slate-400">Price/Yr</dt>
                                        <dd className="font-medium text-slate-900">{p.price}</dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-slate-400">Submitted</dt>
                                        <dd className="text-slate-500">{p.submitted}</dd>
                                    </div>
                                </dl>

                                <div className="mt-4 border-t border-slate-100 pt-3 text-xs">
                                    <a href={`/admin/properties/${p.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                                        View
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                        <p className="text-xs text-slate-400">1 of 10 pages</p>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium ${page === 1 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bank */}
            {activeTab === 'Bank' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:max-w-sm sm:p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Landmark size={18} />
                    </span>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 3421</p>
                            <p className="mt-1 text-xs text-slate-400">Adewale Okonkwo</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Bank</p>
                            <p className="text-sm font-semibold text-slate-900">Guaranty Trust Bank</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
                        <span className="text-slate-400">Verified On</span>
                        <span className="font-semibold text-slate-900">May 14, 2026</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400">Last Payout</span>
                        <span className="font-semibold text-slate-900">Jun 28, 2026 &bull; ₦617,500</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SinglePropertyOwners