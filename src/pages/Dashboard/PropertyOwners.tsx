import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

interface OwnerRow {
    id: string
    name: string
    kyc: 'Verified' | 'Not Verified'
    total: number
    verified: number
    occupied: number
    pending: number
    earnings: string
    status: 'Active' | 'Suspended'
}

const owners: OwnerRow[] = [
    { id: '1', name: 'Olumide Fashola', kyc: 'Verified', total: 5, verified: 4, occupied: 2, pending: 1, earnings: '₦12,400,000', status: 'Suspended' },
    { id: '2', name: 'Amina Yusuf', kyc: 'Verified', total: 8, verified: 6, occupied: 3, pending: 0, earnings: '₦9,750,000', status: 'Active' },
    { id: '3', name: 'Chinedu Okeke', kyc: 'Not Verified', total: 0, verified: 0, occupied: 0, pending: 0, earnings: '₦7,200,000', status: 'Active' },
    { id: '4', name: 'Fatima Bello', kyc: 'Verified', total: 10, verified: 8, occupied: 5, pending: 0, earnings: '₦15,300,000', status: 'Active' },
    { id: '5', name: 'Emeka Nwosu', kyc: 'Verified', total: 4, verified: 3, occupied: 2, pending: 1, earnings: '₦8,500,000', status: 'Suspended' },
    { id: '6', name: 'Zainab Adeyemi', kyc: 'Not Verified', total: 0, verified: 0, occupied: 0, pending: 0, earnings: '₦11,000,000', status: 'Active' },
    { id: '7', name: 'Tunde Balogun', kyc: 'Verified', total: 7, verified: 5, occupied: 2, pending: 1, earnings: '₦13,200,000', status: 'Active' },
    { id: '8', name: 'Ngozi Chukwu', kyc: 'Verified', total: 9, verified: 7, occupied: 4, pending: 0, earnings: '₦14,800,000', status: 'Active' },
    { id: '9', name: 'Ifeanyi Okafor', kyc: 'Not Verified', total: 0, verified: 0, occupied: 0, pending: 0, earnings: '₦6,900,000', status: 'Suspended' },
    { id: '10', name: 'Kemi Alade', kyc: 'Verified', total: 11, verified: 9, occupied: 6, pending: 0, earnings: '₦16,100,000', status: 'Active' },
    { id: '11', name: 'Ahmed Musa', kyc: 'Verified', total: 5, verified: 4, occupied: 2, pending: 1, earnings: '₦10,500,000', status: 'Suspended' },
]

const kycStyles: Record<OwnerRow['kyc'], string> = {
    Verified: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    'Not Verified': 'bg-rose-50 text-rose-600 border border-rose-100',
}

const statusStyles: Record<OwnerRow['status'], string> = {
    Active: 'bg-amber-50 text-amber-600 border border-amber-100',
    Suspended: 'bg-amber-50 text-amber-600 border border-amber-100',
}

const PropertyOwners = () => {
    const [search, setSearch] = useState('')

    const filtered = useMemo(
        () => owners.filter((o) => !search || o.name.toLowerCase().includes(search.toLowerCase())),
        [search],
    )

    return (
        <div className="space-y-4 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Property Owners</h1>
                <p className="mt-1 text-xs text-slate-500">64 registered property owners</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="relative w-full sm:max-w-xs">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                    />
                </div>

                {/* Desktop table */}
                <div className="mt-5 hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                <th className="pb-3 pr-4 font-medium">Owner</th>
                                <th className="pb-3 pr-4 font-medium">KYC</th>
                                <th className="pb-3 pr-4 font-medium">Total Property</th>
                                <th className="pb-3 pr-4 font-medium">Verified Property</th>
                                <th className="pb-3 pr-4 font-medium">Occupied Property</th>
                                <th className="pb-3 pr-4 font-medium">Pending Property</th>
                                <th className="pb-3 pr-4 font-medium">Earnings</th>
                                <th className="pb-3 pr-4 font-medium">Status</th>
                                <th className="pb-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((o) => (
                                <tr key={o.id} className="text-xs">
                                    <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">{o.name}</td>
                                    <td className="py-4 pr-4">
                                        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-medium ${kycStyles[o.kyc]}`}>{o.kyc}</span>
                                    </td>
                                    <td className="py-4 pr-4 text-slate-700">{o.total}</td>
                                    <td className="py-4 pr-4 text-slate-700">{o.verified}</td>
                                    <td className="py-4 pr-4 text-slate-700">{o.occupied}</td>
                                    <td className="py-4 pr-4 text-slate-700">{o.pending}</td>
                                    <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-900">{o.earnings}</td>
                                    <td className="py-4 pr-4">
                                        <span className={`rounded-full px-2.5 py-1 font-medium ${statusStyles[o.status]}`}>{o.status}</span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Link to={`/admin/property-owners/${o.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                                                View
                                            </Link>
                                            <button type="button" className="font-medium text-rose-600 hover:text-rose-700">
                                                {o.status === 'Suspended' ? 'Reinstate' : 'Suspend'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile / tablet cards */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
                    {filtered.map((o) => (
                        <div key={o.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">{o.name}</p>
                                    <p className="mt-1 text-sm font-medium text-slate-900">{o.earnings}</p>
                                </div>
                                <div className="flex flex-shrink-0 flex-col items-end gap-1.5 text-xs">
                                    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-medium ${kycStyles[o.kyc]}`}>{o.kyc}</span>
                                    <span className={`rounded-full px-2.5 py-1 font-medium ${statusStyles[o.status]}`}>{o.status}</span>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-4 gap-2 rounded-lg bg-slate-50 p-3 text-center">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{o.total}</p>
                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Total</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{o.verified}</p>
                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Verified</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{o.occupied}</p>
                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Occupied</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{o.pending}</p>
                                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">Pending</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-3 text-xs">
                                <Link to={`/admin/property-owners/${o.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                                    View
                                </Link>
                                <button type="button" className="font-medium text-rose-600 hover:text-rose-700">
                                    {o.status === 'Suspended' ? 'Reinstate' : 'Suspend'}
                                </button>
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
        </div>
    )
}

export default PropertyOwners