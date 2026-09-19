import { MoreVertical, Paperclip, Search, Send } from "lucide-react";
import { useState } from "react";

const conversations = [
    {
        id: 1,
        name: "P-knock Admin",
        preview: "The platform deducted ₦92,500 instead of ₦42...",
        time: "2:34 PM",
        unread: 0,
        avatar: "P",
        color: "bg-blue-100 text-blue-700",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        preview: "The apartment has been without hot water...",
        time: "2:34 PM",
        unread: 3,
        avatar: "S",
        color: "bg-purple-500 text-white",
        active: true,
    },
    {
        id: 3,
        name: "Michael Philip",
        preview: "I have not had any running water in my unit...",
        time: "2:34 PM",
        unread: 3,
        avatar: "M",
        color: "bg-pink-500 text-white",
    },
    {
        id: 4,
        name: "Emily Davis",
        preview: "It's been three days without any water sup...",
        time: "2:34 PM",
        unread: 3,
        avatar: "E",
        color: "bg-orange-400 text-white",
    },
    {
        id: 5,
        name: "James Wilson",
        preview: "There has been a complete water outage in...",
        time: "2:34 PM",
        unread: 3,
        avatar: "J",
        color: "bg-red-500 text-white",
    },
    {
        id: 6,
        name: "Chinasa David",
        preview: "I am experiencing a lack of running water in...",
        time: "2:34 PM",
        unread: 3,
        avatar: "C",
        color: "bg-teal-500 text-white",
    },
    {
        id: 7,
        name: "John Peter",
        preview: "For three days now, there has been no wat...",
        time: "2:34 PM",
        unread: 3,
        avatar: "J",
        color: "bg-blue-500 text-white",
    },
];

const SupportComplaints = () => {
    const [message, setMessage] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Support & Complaints
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Submit and track your support tickets.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-180px)] flex">
                {/* Left – Chat list */}
                <div className="w-80 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900 mb-3">Chat</h2>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((c) => (
                            <div
                                key={c.id}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${c.active ? "bg-gray-50" : ""
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${c.color}`}
                                >
                                    {c.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {c.name}
                                        </p>
                                        <p className="text-xs text-gray-400">{c.time}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <p className="text-xs text-gray-500 truncate">{c.preview}</p>
                                        {c.unread > 0 && (
                                            <span className="ml-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center flex-shrink-0">
                                                {c.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right – Conversation */}
                <div className="flex-1 flex flex-col">
                    {/* Chat header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                                S
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        Property Owner
                                    </span>
                                </div>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Active now
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Search size={18} className="text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <MoreVertical size={18} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {/* Incoming */}
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                S
                            </div>
                            <div>
                                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-md">
                                    <p className="text-sm text-gray-800">
                                        There has been no running water in the unit for three days.
                                        This is urgent and affecting daily living.
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Jul 26, 8:10 AM</p>
                            </div>
                        </div>

                        {/* Outgoing */}
                        <div className="flex justify-end gap-3">
                            <div>
                                <div className="bg-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-md">
                                    <p className="text-sm">
                                        We have notified the property owner and flagged this for
                                        urgent resolution. A PVO will follow up today.
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    Jul 26, 9:00 AM
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                ME
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600">
                                    <Paperclip size={18} />
                                </button>
                            </div>
                            <button className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportComplaints;