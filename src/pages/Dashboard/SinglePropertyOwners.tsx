import {
    ArrowLeft,
    Ban,
    Building2,
    CheckCircle2,
    Clock,
    Mail,
    Phone,
    ShieldCheck,
    Star,
    UserCheck,
    Wallet
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleOwner } from "../../hooks/queries/allQueries";

type Tab = "Overview" | "Properties" | "Bank";

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex min-h-[320px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                !
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const formatMoney = (value?: string | number) => {
    if (value === null || value === undefined || value === "") return "₦0";
    const numericValue = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numericValue)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2,
    }).format(numericValue);
};

const normalizeText = (value?: string | null) => (value && value.trim() ? value : "N/A");

const SinglePropertyOwners = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("Overview");

    const { ownerData, isLoading, isError } = useGetSingleOwner(id || "");
    const owner = ownerData?.data ?? ownerData ?? {};

    if (!id) {
        return <EmptyState title="Owner not found" description="No owner identifier was included in the route." />;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-sm text-slate-500">
                Loading owner details...
            </div>
        );
    }

    if (isError) {
        return <EmptyState title="Could not load owner" description="The owner details could not be retrieved from the API." />;
    }

    if (!owner || Object.keys(owner).length === 0) {
        return <EmptyState title="No owner data available" description="This owner does not have a profile record yet." />;
    }

    const ownerName = `${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim() || "Unknown Owner";
    const kycStatus = owner.kyc_status ? owner.kyc_status : "Not Verified";
    const totalEarnings = formatMoney(owner.total_earned ?? 0);
    const tabs: Tab[] = ["Overview", "Properties", "Bank"];
    const stats = [
        { label: "Total Earned", value: totalEarnings, icon: Wallet, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
        { label: "Total Properties", value: String(owner.total_properties ?? 0), icon: Building2, iconBg: "bg-slate-100", iconColor: "text-slate-600" },
        { label: "Verified & Published", value: String(owner.verified_properties ?? 0), icon: ShieldCheck, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
        { label: "Currently Occupied", value: String(owner.occupied_properties ?? 0), icon: UserCheck, iconBg: "bg-violet-50", iconColor: "text-violet-600" },
        { label: "Pending Review", value: String(owner.pending_properties ?? 0), icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    ];

    const personalDetails = [
        { label: "First Name", value: normalizeText(owner.first_name) },
        { label: "Last Name", value: normalizeText(owner.last_name) },
        { label: "Email Address", value: normalizeText(owner.email) },
        { label: "Phone Number", value: normalizeText(owner.phone) },
        { label: "Gender", value: "N/A" },
        { label: "Date of Birth (Optional)", value: "N/A" },
        { label: "State of Origin", value: "N/A" },
        { label: "Nationality", value: "N/A" },
        { label: "Member Since", value: owner.member_since ? new Date(owner.member_since).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) : "N/A" },
    ];

    const statusStyles: Record<string, string> = {
        "Awaiting Final Approval": "bg-amber-50 text-amber-600 border border-amber-100",
        "PVO Assigned": "bg-blue-50 text-blue-600 border border-blue-100",
        Published: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        Rejected: "bg-rose-50 text-rose-600 border border-rose-100",
        Submitted: "bg-slate-100 text-slate-600 border border-slate-200",
    };

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

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <img
                        src="https://i.pravatar.cc/96?img=51"
                        alt={ownerName}
                        className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover sm:h-16 sm:w-16"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h1 className="text-base font-extrabold text-slate-900 sm:text-lg">{ownerName}</h1>
                            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                                {kycStatus}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Property Owner &bull; Member since {owner.member_since ? new Date(owner.member_since).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 rating
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 break-all">
                                <Mail size={13} className="flex-shrink-0" /> {normalizeText(owner.email)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Phone size={13} className="flex-shrink-0" /> {normalizeText(owner.phone)}
                            </span>
                        </div>
                    </div>
                </div>
                <button type="button" className="flex h-fit w-full items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 sm:w-auto sm:flex-shrink-0">
                    <Ban size={14} /> Suspend
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {stats.map((s, i) => (
                    <div key={s.label} className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${i === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
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

            <div className="inline-flex w-full items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-xl px-5 py-2 text-xs font-semibold transition-colors sm:flex-none ${activeTab === tab ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Overview" && (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                            {personalDetails.map((detail) => (
                                <div key={detail.label} className="min-w-0">
                                    <p className="text-xs text-slate-400">{detail.label}</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-slate-900">{detail.value}</p>
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
                                    {owner.email ? "Verified" : "Pending"}
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-slate-400">Verified via OTP</p>
                            <p className="mt-1 break-all text-sm font-semibold text-slate-900">{normalizeText(owner.email)}</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                    <ShieldCheck size={16} className="text-blue-600" /> KYC / Identity
                                </h3>
                                <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                                    {kycStatus}
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-slate-400">Identity documents submitted for review</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">National Identity Card</p>
                            <img
                                src="https://images.unsplash.com/photo-1621252179027-94459d278660?w=600"
                                alt="National Identity Card"
                                className="mt-3 w-full rounded-xl border border-slate-100 object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "Properties" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-900">Recent property activity</h3>
                        <span className="text-xs text-slate-500">{owner.total_properties ?? 0} total</span>
                    </div>
                    <div className="mt-4 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                        No property details were returned for this owner yet.
                    </div>
                </div>
            )}

            {activeTab === "Bank" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                        No bank account information is available for this owner yet.
                    </div>
                </div>
            )}
        </div>
    );
};

export default SinglePropertyOwners;