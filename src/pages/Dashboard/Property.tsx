import { ChevronDown, MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

interface PropertyRow {
    id: string
    title: string
    location: string
    owner: string
    tenant: string
    type: string
    price: string
    status: 'Awaiting Final Approval' | 'PVO Assigned' | 'Published' | 'Rejected' | 'Submitted'
    pvo: string
    submitted: string
}

const properties: PropertyRow[] = [
    { id: '1', title: '3 Bedroom Apartment at Lekki Phase 1', location: 'Lekki Phase 1, Lagos', owner: 'Olumide Fashola', tenant: 'Olumide Fashola', type: 'Apartment', price: '₦2,500,000', status: 'Awaiting Final Approval', pvo: 'Olumide Fashola', submitted: 'Jul 25, 2026' },
    { id: '2', title: '4 Bedroom Duplex in Victoria Island', location: 'Victoria Island, Lagos', owner: 'Chinedu Okafor', tenant: 'Chinedu Okafor', type: 'Duplex', price: '₦5,750,000', status: 'PVO Assigned', pvo: 'Chinedu Okafor', submitted: 'Aug 10, 2026' },
    { id: '3', title: 'Luxury 5 Bedroom Villa in Banana Island', location: 'Banana Island, Lagos', owner: 'Amina Yusuf', tenant: 'Amina Yusuf', type: 'Villa', price: '₦12,000,000', status: 'Published', pvo: 'Amina Yusuf', submitted: 'Sep 15, 2026' },
    { id: '4', title: '2 Bedroom Flat at Ikeja GRA', location: 'Ikeja GRA, Lagos', owner: 'Emeka Nwosu', tenant: 'Emeka Nwosu', type: 'Flat', price: '₦1,750,000', status: 'Published', pvo: 'Emeka Nwosu', submitted: 'Oct 05, 2026' },
    { id: '5', title: 'Modern Studio Apartment in Yaba', location: 'Yaba, Lagos', owner: 'Funke Adeyemi', tenant: 'Funke Adeyemi', type: 'Studio', price: '₦900,000', status: 'Published', pvo: 'Funke Adeyemi', submitted: 'Nov 12, 2026' },
    { id: '6', title: '3 Bedroom Bungalow at Surulere', location: 'Surulere, Lagos', owner: 'Bola Johnson', tenant: 'Bola Johnson', type: 'Bungalow', price: '₦2,100,000', status: 'Rejected', pvo: 'Bola Johnson', submitted: 'Dec 01, 2026' },
    { id: '7', title: 'Serviced 1 Bedroom Apartment at Lekki Phase 2', location: 'Lekki Phase 2, Lagos', owner: 'Tunde Balogun', tenant: 'Tunde Balogun', type: 'Apartment', price: '₦1,300,000', status: 'Submitted', pvo: '-', submitted: 'Jan 20, 2027' },
    { id: '8', title: 'Penthouse Suite in Ikoyi', location: 'Ikoyi, Lagos', owner: 'Ngozi Okeke', tenant: 'Ngozi Okeke', type: 'Penthouse', price: '₦8,500,000', status: 'Submitted', pvo: '-', submitted: 'Feb 14, 2027' },
    { id: '9', title: 'Cozy 2 Bedroom Flat at Maryland', location: 'Maryland, Lagos', owner: 'Kemi Adebayo', tenant: 'Kemi Adebayo', type: 'Flat', price: '₦1,600,000', status: 'PVO Assigned', pvo: 'Kemi Adebayo', submitted: 'Mar 03, 2027' },
]

const statusStyles: Record<PropertyRow['status'], string> = {
    'Awaiting Final Approval': 'bg-amber-50 text-amber-600 border border-amber-100',
    'PVO Assigned': 'bg-blue-50 text-blue-600 border border-blue-100',
    Published: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    Rejected: 'bg-rose-50 text-rose-600 border border-rose-100',
    Submitted: 'bg-slate-100 text-slate-600 border border-slate-200',
}

const propertyTypes = ['All Types', 'Apartment', 'Duplex', 'Villa', 'Flat', 'Studio', 'Bungalow', 'Penthouse']
const propertyStatuses = ['All Status', 'Awaiting Final Approval', 'PVO Assigned', 'Published', 'Rejected', 'Submitted']

const Property = () => {
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('All Types')
    const [statusFilter, setStatusFilter] = useState('All Status')

    const filtered = useMemo(() => {
        return properties.filter((p) => {
            const matchesSearch =
                !search ||
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.owner.toLowerCase().includes(search.toLowerCase())
            const matchesType = typeFilter === 'All Types' || p.type === typeFilter
            const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter
            return matchesSearch && matchesType && matchesStatus
        })
    }, [search, typeFilter, statusFilter])

    return (
        <div className="space-y-4 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Properties</h1>
                <p className="mt-1 text-xs text-slate-500">{properties.length} properties in the system</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
                {/* Search + filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search"
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-xs text-slate-600 focus:border-blue-400 focus:outline-none"
                            >
                                {propertyTypes.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-xs text-slate-600 focus:border-blue-400 focus:outline-none"
                            >
                                {propertyStatuses.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-500">
                                <th className="pb-3 pr-4 font-medium">Property</th>
                                <th className="pb-3 pr-4 font-medium">Owner</th>
                                <th className="pb-3 pr-4 font-medium">Tenant</th>
                                <th className="pb-3 pr-4 font-medium">Type</th>
                                <th className="pb-3 pr-4 font-medium">Price/Yr</th>
                                <th className="pb-3 pr-4 font-medium">Status</th>
                                <th className="pb-3 pr-4 font-medium">PVO</th>
                                <th className="pb-3 pr-4 font-medium">Submitted</th>
                                <th className="pb-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((p) => (
                                <tr key={p.id} className="text-xs">
                                    <td className="max-w-[220px] py-4 pr-4">
                                        <p className="truncate text-sm font-semibold text-slate-900">{p.title}</p>
                                        <p className="mt-1 flex items-center gap-1 text-slate-400">
                                            <MapPin size={12} /> {p.location}
                                        </p>
                                    </td>
                                    <td className="py-4 pr-4 text-slate-700">{p.owner}</td>
                                    <td className="py-4 pr-4 text-slate-700">{p.tenant}</td>
                                    <td className="py-4 pr-4">
                                        <span className="rounded-full border border-slate-200 px-2.5 py-1 text-slate-600">{p.type}</span>
                                    </td>
                                    <td className="py-4 pr-4 font-medium text-slate-900">{p.price}</td>
                                    <td className="py-4 pr-4">
                                        <span className={`rounded-full px-2.5 py-1 font-medium ${statusStyles[p.status]}`}>{p.status}</span>
                                    </td>
                                    <td className="py-4 pr-4 text-slate-700">{p.pvo}</td>
                                    <td className="py-4 pr-4 whitespace-nowrap text-slate-500">{p.submitted}</td>
                                    <td className="py-4">
                                        <Link to={`/admin/properties/${p.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-5 flex items-center justify-between">
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

export default Property