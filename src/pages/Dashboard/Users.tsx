import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
    {
        id: "USR – 001",
        name: "Amara Okonkwo",
        email: "amara@gmail.com",
        phone: "+234 902 284 9307",
        registered: "Jul 25, 2026 • 09:03am",
        inspections: 3,
        kyc: "Verified",
    },
    {
        id: "USR – 002",
        name: "Binta Sadiq",
        email: "binta.sadiq@example.com",
        phone: "+234 809 112 3345",
        registered: "Aug 1, 2026 • 11:15am",
        inspections: 5,
        kyc: "Pending",
    },
    {
        id: "USR – 003",
        name: "Chike Obi",
        email: "chikeobi@mail.com",
        phone: "+234 801 234 5678",
        registered: "Aug 3, 2026 • 02:47pm",
        inspections: 2,
        kyc: "Verified",
    },
    {
        id: "USR – 004",
        name: "Damilola Adeyemi",
        email: "dami.adeyemi@domain.com",
        phone: "+234 803 987 6543",
        registered: "Aug 5, 2026 • 10:29am",
        inspections: 1,
        kyc: "Rejected",
    },
    {
        id: "USR – 005",
        name: "Effiong Udo",
        email: "effiong.udo@mail.net",
        phone: "+234 807 555 1234",
        registered: "Aug 6, 2026 • 04:05pm",
        inspections: 4,
        kyc: "Verified",
    },
    {
        id: "USR – 006",
        name: "Fatima Bello",
        email: "fatima.bello@webmail.com",
        phone: "+234 806 777 8899",
        registered: "Aug 7, 2026 • 08:20am",
        inspections: 3,
        kyc: "Pending",
    },
    {
        id: "USR – 007",
        name: "Gbenga Ajayi",
        email: "gbenga.ajayi@internet.com",
        phone: "+234 805 333 2221",
        registered: "Aug 8, 2026 • 12:45pm",
        inspections: 2,
        kyc: "Verified",
    },
    {
        id: "USR – 008",
        name: "Halima Yusuf",
        email: "halima.yusuf@mailbox.org",
        phone: "+234 802 444 6767",
        registered: "Aug 9, 2026 • 03:10pm",
        inspections: 6,
        kyc: "Rejected",
    },
    {
        id: "USR – 009",
        name: "Ifeanyi Nwosu",
        email: "ifeanyi.nwosu@service.com",
        phone: "+234 701 998 4455",
        registered: "Aug 10, 2026 • 09:55am",
        inspections: 7,
        kyc: "Verified",
    },
    {
        id: "USR – 010",
        name: "Jumoke Adetunji",
        email: "jumoke.adetunji@fastmail.net",
        phone: "+234 803 111 6789",
        registered: "Aug 11, 2026 • 01:30pm",
        inspections: 1,
        kyc: "Pending",
    },
    {
        id: "USR – 011",
        name: "Kelechi Eze",
        email: "kelechi.eze@mailcity.com",
        phone: "+234 809 765 4321",
        registered: "Aug 12, 2026 • 05:40pm",
        inspections: 4,
        kyc: "Verified",
    },
];

const KycBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        Verified: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Rejected: "bg-red-100 text-red-700",
    };
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
};

const Users = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                <p className="text-sm text-gray-500 mt-1">
                    All registered users on the platform
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-500 font-medium">
                                <th className="px-6 py-3">User ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Phone Number</th>
                                <th className="px-6 py-3">Registered</th>
                                <th className="px-6 py-3 text-center">Inspections</th>
                                <th className="px-6 py-3">KYC Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.registered}</td>
                                    <td className="px-6 py-4 text-center text-gray-700">
                                        {user.inspections}
                                    </td>
                                    <td className="px-6 py-4">
                                        <KycBadge status={user.kyc} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/users/${user.id.replace(/\s/g, "")}`)
                                                }
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                View
                                            </button>
                                            <button className="text-red-600 hover:text-red-700 font-medium">
                                                Suspend
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">1 of 10 pages</p>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 rounded-md bg-gray-900 text-white text-sm font-medium">
                            1
                        </button>
                        <button className="w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 text-sm">
                            2
                        </button>
                        <button className="w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 text-sm">
                            3
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;