import {
    Bell,
    CreditCard,
    Lock,
    Monitor,
    Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
    const [activeSection, setActiveSection] = useState<
        "password" | "platform" | "fees" | "notification"
    >("password");

    // Password state
    const [twoFactor, setTwoFactor] = useState(true);

    // Notification prefs
    const [emailNotif, setEmailNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(true);
    const [paymentNotif, setPaymentNotif] = useState(true);
    const [inspectionNotif, setInspectionNotif] = useState(true);
    const [verificationNotif, setVerificationNotif] = useState(true);
    const [listingNotif, setListingNotif] = useState(true);

    const sections = [
        { id: "password", label: "Password & Security", icon: Lock },
        { id: "platform", label: "Platform Config", icon: SettingsIcon },
        { id: "fees", label: "Fees & Payments", icon: CreditCard },
        { id: "notification", label: "Notification", icon: Bell },
    ] as const;

    const Toggle = ({
        enabled,
        onChange,
    }: {
        enabled: boolean;
        onChange: () => void;
    }) => (
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-200"
                }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : ""
                    }`}
            />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-56 bg-white border-r border-gray-200 p-4 space-y-1">
                {sections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Icon size={16} />
                            {sec.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
                {/* ========== PASSWORD & SECURITY ========== */}
                {activeSection === "password" && (
                    <div className="max-w-lg">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Password & Security
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 mb-6">
                            Manage your password and account security settings
                        </p>

                        {/* Change Password */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
                            <h2 className="font-semibold text-gray-900 mb-4">
                                Change Password
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        defaultValue="••••••••"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        defaultValue="••••••••"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        defaultValue="••••••••"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Two Factor */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Two Factor Authentication
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Require a verification code when signing in from a new device
                                    or browser.
                                </p>
                            </div>
                            <Toggle
                                enabled={twoFactor}
                                onChange={() => setTwoFactor(!twoFactor)}
                            />
                        </div>

                        {/* Active Sessions */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h2 className="font-semibold text-gray-900 mb-4">
                                Active Sessions
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Monitor size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                MacBook Pro — Chrome
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Lagos, Nigeria · Current session
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        Active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Monitor size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                iMac Pro — Chrome
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Lagos, Nigeria · Current session
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-medium text-red-600 hover:text-red-700">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== PLATFORM CONFIG ========== */}
                {activeSection === "platform" && (
                    <div className="max-w-lg">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Platform Configuration
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 mb-6">
                            Core settings that govern how P-Knock operates
                        </p>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Default Country
                                </label>
                                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                                    <option>Nigeria</option>
                                    <option>Ghana</option>
                                    <option>Kenya</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Currency
                                </label>
                                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                                    <option>NGN (₦)</option>
                                    <option>USD ($)</option>
                                    <option>GHS (₵)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Max Properties Per Owner
                                </label>
                                <input
                                    type="number"
                                    defaultValue={20}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                />
                            </div>
                            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* ========== FEES & PAYMENTS ========== */}
                {activeSection === "fees" && (
                    <div className="max-w-lg">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Fees & Payments
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 mb-6">
                            Configure transaction fees and payout rules
                        </p>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Platform Transaction Fee (%)
                                </label>
                                <input
                                    type="number"
                                    defaultValue={5}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Inspection Fee
                                </label>
                                <input
                                    type="number"
                                    defaultValue={15000}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                />
                            </div>
                            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* ========== NOTIFICATION PREFERENCES ========== */}
                {activeSection === "notification" && (
                    <div className="max-w-lg">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Notification Preferences
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 mb-6">
                            Choose which events trigger email and in-app alerts for admins
                        </p>

                        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                            {/* Email */}
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-500">
                                        Receive notifications via email
                                    </p>
                                </div>
                                <Toggle
                                    enabled={emailNotif}
                                    onChange={() => setEmailNotif(!emailNotif)}
                                />
                            </div>

                            {/* Push */}
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Push Notifications</p>
                                    <p className="text-sm text-gray-500">
                                        Receive browser push notifications
                                    </p>
                                </div>
                                <Toggle
                                    enabled={pushNotif}
                                    onChange={() => setPushNotif(!pushNotif)}
                                />
                            </div>

                            {/* Activity section title */}
                            <div className="px-4 pt-4 pb-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    Activity Notifications
                                </p>
                            </div>

                            {[
                                {
                                    label: "Payment Received",
                                    desc: "Get notified when rent is received",
                                    value: paymentNotif,
                                    toggle: () => setPaymentNotif(!paymentNotif),
                                },
                                {
                                    label: "Inspection Requests",
                                    desc: "Get notified of new inspection requests",
                                    value: inspectionNotif,
                                    toggle: () => setInspectionNotif(!inspectionNotif),
                                },
                                {
                                    label: "Verification Updates",
                                    desc: "Get updates on property verification status",
                                    value: verificationNotif,
                                    toggle: () => setVerificationNotif(!verificationNotif),
                                },
                                {
                                    label: "Listings Submission",
                                    desc: "Get updates on property listing submission",
                                    value: listingNotif,
                                    toggle: () => setListingNotif(!listingNotif),
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <Toggle enabled={item.value} onChange={item.toggle} />
                                </div>
                            ))}

                            <div className="p-4">
                                <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;