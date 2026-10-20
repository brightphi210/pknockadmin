import {
    Bell,
    CreditCard,
    Lock,
    LogOut,
    Monitor,
    Settings as SettingsIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import Modal from "../../components/UI/Modal";
import { useToast } from "../../components/UI/Toast";
import {
    useUpdateNotificationPrefs,
    useUpdatePlatformSettings,
} from "../../hooks/mutations/allMutation";
import { useLogoutAll } from "../../hooks/mutations/auth";
import { parseApiError } from "../../hooks/parseapierror";
import {
    useGetNotificationPrefs,
    useGetPlatformSettings,
    useGetSessions,
} from "../../hooks/queries/allQueries";

/* ---------- Config ---------- */

// Where to send the admin after "Log out of all devices"
const LOGIN_ROUTE = "/login";
const TOKEN_KEY = "pknockAdminToken";

// Active Sessions: how many rows to show per page
const SESSIONS_PER_PAGE = 10;

// The API has no countries/currencies endpoint, so the dropdown options live here.
// `value` is what gets sent to the API; `label` is what the admin sees.
const COUNTRY_OPTIONS = [
    { value: "Nigeria", label: "Nigeria" },
    { value: "Ghana", label: "Ghana" },
    { value: "Kenya", label: "Kenya" },
];
const CURRENCY_OPTIONS = [
    { value: "NGN", label: "NGN (₦)" },
    { value: "USD", label: "USD ($)" },
    { value: "GHS", label: "GHS (₵)" },
];

// If the API returns a value that isn't in our list, keep it selectable
// so the dropdown never silently shows the wrong option.
const withCurrent = (
    options: { value: string; label: string }[],
    current: string
) =>
    current && !options.some((o) => o.value === current)
        ? [...options, { value: current, label: current }]
        : options;

// Show "5.00" as "5" and "15000.00" as "15000" in the inputs.
const toInputString = (value: string | number | undefined | null) =>
    value === undefined || value === null || value === ""
        ? ""
        : String(Number(value));

// The API activities field can be an array or a comma-separated string.
// We accept both when reading, and send back the same shape we received.
type ActivityKey = "payment" | "inspection" | "verification" | "listing";
const ALL_ACTIVITIES: ActivityKey[] = ["payment", "inspection", "verification", "listing"];

const parseActivities = (raw?: unknown): ActivityKey[] => {
    let items: string[];

    if (Array.isArray(raw)) {
        items = raw.map((s) => String(s));
    } else if (typeof raw === "string") {
        items = raw.split(",");
    } else {
        return [];
    }

    return items
        .map((s) => s.trim().toLowerCase())
        .filter((s): s is ActivityKey => (ALL_ACTIVITIES as string[]).includes(s));
};

type SessionRecord = {
    id: string;
    device?: string;
    ip?: string;
    created_at?: string;
    current?: boolean;
    active?: boolean;
};

const formatDateTime = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const d = new Intl.DateTimeFormat("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
    const t = new Intl.DateTimeFormat("en-NG", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
    return `${d} · ${t}`;
};

const Toggle = ({
    enabled,
    onChange,
    label,
}: {
    enabled: boolean;
    onChange: () => void;
    label: string;
}) => (
    <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-blue-600" : "bg-gray-200"
            }`}
    >
        <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : ""
                }`}
        />
    </button>
);

const ErrorNote = ({ message }: { message: string }) => (
    <p className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
        {message}
    </p>
);

const Settings = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [activeSection, setActiveSection] = useState<
        "password" | "platform" | "fees" | "notification"
    >("password");

    // Password state
    const [twoFactor, setTwoFactor] = useState(true);

    // Sessions
    const [sessionPage, setSessionPage] = useState(1);
    const [showLogoutAll, setShowLogoutAll] = useState(false);
    const [logoutError, setLogoutError] = useState("");
    const {
        sessions: sessionsRes,
        isLoading: sessionsLoading,
        isError: sessionsError,
        refetch: refetchSessions,
    } = useGetSessions(sessionPage, SESSIONS_PER_PAGE);
    const logoutAllMutation = useLogoutAll();

    const sessionsPayload = (sessionsRes?.data ?? sessionsRes) as
        | { count?: number; next?: string | null; previous?: string | null; results?: SessionRecord[] }
        | SessionRecord[]
        | undefined;
    // The API may return a paginated object ({ count, next, results }) or a plain array.
    const paginatedSessions =
        sessionsPayload && !Array.isArray(sessionsPayload) ? sessionsPayload : null;
    const allSessions: SessionRecord[] = Array.isArray(sessionsPayload)
        ? sessionsPayload
        : (paginatedSessions?.results ?? []);
    const sessionCount = paginatedSessions
        ? (paginatedSessions.count ?? allSessions.length)
        : allSessions.length;
    const totalSessionPages = Math.max(1, Math.ceil(sessionCount / SESSIONS_PER_PAGE));

    // Server-paginated: the API already sent this page. Plain array: slice 10 per page here.
    const sessionList: SessionRecord[] = paginatedSessions
        ? allSessions
        : allSessions.slice(
            (sessionPage - 1) * SESSIONS_PER_PAGE,
            sessionPage * SESSIONS_PER_PAGE
        );
    const hasPrevSessions = sessionPage > 1;
    const hasNextSessions = paginatedSessions
        ? Boolean(paginatedSessions.next)
        : sessionPage < totalSessionPages;
    const sessionRangeStart = sessionList.length
        ? (sessionPage - 1) * SESSIONS_PER_PAGE + 1
        : 0;
    const sessionRangeEnd = sessionRangeStart
        ? sessionRangeStart + sessionList.length - 1
        : 0;

    const handleLogoutAll = async () => {
        setLogoutError("");
        try {
            await logoutAllMutation.mutateAsync();
            toast.success("Logged out of all devices", {
                message: "Please sign in again to continue.",
            });
            setShowLogoutAll(false);
            localStorage.removeItem(TOKEN_KEY);
            navigate(LOGIN_ROUTE, { replace: true });
        } catch (err) {
            const parsed = parseApiError(err, "Failed to log out of all devices.");
            setLogoutError(parsed.message);
            toast.error("Could not log out", { message: parsed.message });
        }
    };

    // ---------- Platform settings (shared by Platform Config + Fees & Payments) ----------
    const {
        settings,
        isLoading: settingsLoading,
        isError: settingsError,
        refetch: refetchSettings,
    } = useGetPlatformSettings();
    const updateSettingsMutation = useUpdatePlatformSettings();

    // Platform Config drafts
    const [country, setCountry] = useState("");
    const [currency, setCurrency] = useState("");
    const [maxProps, setMaxProps] = useState("");
    const [platformError, setPlatformError] = useState("");

    // Fees & Payments drafts
    const [feePercent, setFeePercent] = useState("");
    const [inspectionFee, setInspectionFee] = useState("");
    const [feesError, setFeesError] = useState("");

    const [savingSection, setSavingSection] = useState<"platform" | "fees" | null>(null);

    // Populate both tabs from the server whenever it sends fresh data.
    useEffect(() => {
        if (!settings) return;
        setCountry(settings.country ?? "");
        setCurrency(settings.currency ?? "");
        setMaxProps(toInputString(settings.max_properties_per_owner));
        setFeePercent(toInputString(settings.transaction_fee_percent));
        setInspectionFee(toInputString(settings.inspection_fee));
    }, [settings]);

    const platformDirty = Boolean(
        settings &&
        (country !== settings.country ||
            currency !== settings.currency ||
            Number(maxProps) !== Number(settings.max_properties_per_owner))
    );
    const feesDirty = Boolean(
        settings &&
        (Number(feePercent) !== Number(settings.transaction_fee_percent) ||
            Number(inspectionFee) !== Number(settings.inspection_fee))
    );

    // Both tabs hit the same row. Start from the latest server values and overlay only
    // the fields from the tab being saved, so saving one tab never overwrites the other.
    const buildPayload = (overrides: Record<string, unknown>) => ({
        country: settings?.country,
        currency: settings?.currency,
        max_properties_per_owner: settings?.max_properties_per_owner,
        transaction_fee_percent: settings?.transaction_fee_percent,
        inspection_fee: settings?.inspection_fee,
        ...overrides,
    });

    const handleSavePlatform = async () => {
        if (!settings) return;
        setPlatformError("");

        const max = Number(maxProps);
        if (maxProps.trim() === "" || !Number.isInteger(max) || max < 1) {
            setPlatformError("Max properties per owner must be a whole number of 1 or more.");
            return;
        }

        setSavingSection("platform");
        try {
            await updateSettingsMutation.mutateAsync(
                buildPayload({
                    country,
                    currency,
                    max_properties_per_owner: max,
                })
            );
            toast.success("Platform settings saved", {
                message: "Your changes are now live.",
            });
        } catch (err) {
            const parsed = parseApiError(err, "Failed to save platform settings.");
            setPlatformError(parsed.message);
            toast.error("Could not save settings", { message: parsed.message });
        } finally {
            setSavingSection(null);
        }
    };

    const handleSaveFees = async () => {
        if (!settings) return;
        setFeesError("");

        const fee = Number(feePercent);
        if (feePercent.trim() === "" || Number.isNaN(fee) || fee < 0 || fee > 100) {
            setFeesError("Transaction fee must be a number between 0 and 100.");
            return;
        }
        const inspection = Number(inspectionFee);
        if (inspectionFee.trim() === "" || Number.isNaN(inspection) || inspection < 0) {
            setFeesError("Inspection fee must be a number of 0 or more.");
            return;
        }

        setSavingSection("fees");
        try {
            await updateSettingsMutation.mutateAsync(
                buildPayload({
                    // The API stores these as Decimal(5,2) / decimal strings, e.g. "5.00".
                    transaction_fee_percent: fee.toFixed(2),
                    inspection_fee: inspection.toFixed(2),
                })
            );
            toast.success("Fees saved", {
                message: "Your changes are now live.",
            });
        } catch (err) {
            const parsed = parseApiError(err, "Failed to save fees.");
            setFeesError(parsed.message);
            toast.error("Could not save fees", { message: parsed.message });
        } finally {
            setSavingSection(null);
        }
    };

    const settingsLoadFailed = settingsError && !settings;

    // ---------- Notification prefs ----------
    const {
        prefs,
        isLoading: prefsLoading,
        isError: prefsError,
    } = useGetNotificationPrefs();
    const updatePrefsMutation = useUpdateNotificationPrefs();

    const [emailNotif, setEmailNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(false);
    const [paymentNotif, setPaymentNotif] = useState(false);
    const [inspectionNotif, setInspectionNotif] = useState(false);
    const [verificationNotif, setVerificationNotif] = useState(false);
    const [listingNotif, setListingNotif] = useState(false);

    // Remembers whether the API sent `activities` as an array, so we save it back the same way.
    const activitiesIsArrayRef = useRef(false);

    useEffect(() => {
        const p = (prefs?.data ?? prefs) as
            | {
                email_enabled?: boolean;
                push_enabled?: boolean;
                activities?: string | string[] | null;
            }
            | undefined;
        if (!p) return;
        activitiesIsArrayRef.current = Array.isArray(p.activities);
        setEmailNotif(Boolean(p.email_enabled));
        setPushNotif(Boolean(p.push_enabled));
        const active = parseActivities(p.activities);
        setPaymentNotif(active.includes("payment"));
        setInspectionNotif(active.includes("inspection"));
        setVerificationNotif(active.includes("verification"));
        setListingNotif(active.includes("listing"));
    }, [prefs]);

    const handleSavePrefs = async () => {
        const activities: ActivityKey[] = [];
        if (paymentNotif) activities.push("payment");
        if (inspectionNotif) activities.push("inspection");
        if (verificationNotif) activities.push("verification");
        if (listingNotif) activities.push("listing");

        try {
            await updatePrefsMutation.mutateAsync({
                email_enabled: emailNotif,
                push_enabled: pushNotif,
                // Match the shape the API gave us: array stays array, string stays string.
                activities: activitiesIsArrayRef.current
                    ? activities
                    : activities.join(","),
            } as Parameters<typeof updatePrefsMutation.mutateAsync>[0]);
            toast.success("Preferences saved", {
                message: "Your notification settings were updated.",
            });
        } catch (err) {
            const parsed = parseApiError(err, "Failed to save notification preferences.");
            toast.error("Could not save preferences", { message: parsed.message });
        }
    };

    const sections = [
        { id: "password", label: "Password & Security", icon: Lock },
        { id: "platform", label: "Platform Config", icon: SettingsIcon },
        { id: "fees", label: "Fees & Payments", icon: CreditCard },
        { id: "notification", label: "Notification", icon: Bell },
    ] as const;

    const inputClass =
        "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-60";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <LoadingOverlay
                visible={
                    (activeSection === "password" && sessionsLoading) ||
                    ((activeSection === "platform" || activeSection === "fees") && settingsLoading) ||
                    (activeSection === "notification" && prefsLoading)
                }
            />

            {/* Section nav: horizontal scroll on mobile, sidebar from md */}
            <div className="w-full md:w-56 md:flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-2 md:p-4 flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
                {sections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                        <button
                            key={sec.id}
                            onClick={() => setActiveSection(sec.id)}
                            className={`flex flex-shrink-0 items-center gap-2.5 whitespace-nowrap md:w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
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
            <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
                {/* ========== PASSWORD & SECURITY ========== */}
                {activeSection === "password" && (
                    <div className="max-w-lg">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Password & Security
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 mb-5 sm:mb-6">
                            Manage your password and account security settings
                        </p>

                        {/* Change Password */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-5">
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
                                <button className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Two Factor */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-4 sm:mb-5 flex items-center justify-between gap-4">
                            <div className="min-w-0">
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
                                label="Two Factor Authentication"
                            />
                        </div>

                        {/* Active Sessions */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-gray-900">
                                        Active Sessions
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {sessionCount} session{sessionCount === 1 ? "" : "s"} recorded
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLogoutError("");
                                        setShowLogoutAll(true);
                                    }}
                                    className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={14} />
                                    Log out all
                                </button>
                            </div>

                            {sessionsError ? (
                                <div className="py-6 text-center">
                                    <p className="text-sm text-gray-500">
                                        Could not load sessions.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => refetchSessions()}
                                        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : sessionList.length === 0 ? (
                                <p className="py-6 text-center text-sm text-gray-500">
                                    No sessions found.
                                </p>
                            ) : (
                                <div className="space-y-4 sm:space-y-3">
                                    {sessionList.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <Monitor size={18} className="text-blue-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {s.device || "Unknown device"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {s.ip || "Unknown IP"} ·{" "}
                                                        {formatDateTime(s.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                {s.current && (
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        This device
                                                    </span>
                                                )}
                                                <span
                                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {s.active ? "Active" : "Ended"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {sessionCount > 0 && (
                                <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-500">
                                        Showing {sessionRangeStart}–{sessionRangeEnd} of {sessionCount}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={!hasPrevSessions || sessionPage <= 1}
                                            onClick={() => setSessionPage((p) => Math.max(1, p - 1))}
                                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-1 text-xs text-gray-500">
                                            Page {sessionPage} of {totalSessionPages}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={!hasNextSessions}
                                            onClick={() => setSessionPage((p) => p + 1)}
                                            className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========== PLATFORM CONFIG ========== */}
                {activeSection === "platform" && (
                    <div className="max-w-lg">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Platform Configuration
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 mb-5 sm:mb-6">
                            Core settings that govern how P-Knock operates
                        </p>

                        {settingsLoadFailed && (
                            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                                <span>Could not load platform settings.</span>
                                <button
                                    type="button"
                                    onClick={() => refetchSettings()}
                                    className="flex-shrink-0 font-medium hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="platform-country"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Default Country
                                </label>
                                <select
                                    id="platform-country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    disabled={!settings}
                                    className={inputClass}
                                >
                                    {withCurrent(COUNTRY_OPTIONS, country).map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="platform-currency"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Currency
                                </label>
                                <select
                                    id="platform-currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    disabled={!settings}
                                    className={inputClass}
                                >
                                    {withCurrent(CURRENCY_OPTIONS, currency).map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="platform-max-properties"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Max Properties Per Owner
                                </label>
                                <input
                                    id="platform-max-properties"
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={maxProps}
                                    onChange={(e) => setMaxProps(e.target.value)}
                                    disabled={!settings}
                                    className={inputClass}
                                />
                            </div>

                            {platformError && <ErrorNote message={platformError} />}

                            <button
                                type="button"
                                onClick={handleSavePlatform}
                                disabled={
                                    !settings ||
                                    !platformDirty ||
                                    updateSettingsMutation.isPending
                                }
                                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {savingSection === "platform" ? "Saving…" : "Save Changes"}
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
                        <p className="text-sm text-gray-500 mt-1 mb-5 sm:mb-6">
                            Configure transaction fees and payout rules
                        </p>

                        {settingsLoadFailed && (
                            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                                <span>Could not load fee settings.</span>
                                <button
                                    type="button"
                                    onClick={() => refetchSettings()}
                                    className="flex-shrink-0 font-medium hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="fees-transaction"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Platform Transaction Fee (%)
                                </label>
                                <input
                                    id="fees-transaction"
                                    type="number"
                                    min={0}
                                    max={100}
                                    step="0.01"
                                    value={feePercent}
                                    onChange={(e) => setFeePercent(e.target.value)}
                                    disabled={!settings}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="fees-inspection"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Inspection Fee
                                </label>
                                <input
                                    id="fees-inspection"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={inspectionFee}
                                    onChange={(e) => setInspectionFee(e.target.value)}
                                    disabled={!settings}
                                    className={inputClass}
                                />
                            </div>

                            {feesError && <ErrorNote message={feesError} />}

                            <button
                                type="button"
                                onClick={handleSaveFees}
                                disabled={
                                    !settings ||
                                    !feesDirty ||
                                    updateSettingsMutation.isPending
                                }
                                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {savingSection === "fees" ? "Saving…" : "Save Changes"}
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
                        <p className="text-sm text-gray-500 mt-1 mb-5 sm:mb-6">
                            Choose which events trigger email and in-app alerts for admins
                        </p>

                        {prefsError && (
                            <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                                Could not load your saved preferences. Showing defaults.
                            </p>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                            {/* Email */}
                            <div className="p-4 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-500">
                                        Receive notifications via email
                                    </p>
                                </div>
                                <Toggle
                                    enabled={emailNotif}
                                    onChange={() => setEmailNotif(!emailNotif)}
                                    label="Email Notifications"
                                />
                            </div>

                            {/* Push */}
                            <div className="p-4 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900">Push Notifications</p>
                                    <p className="text-sm text-gray-500">
                                        Receive browser push notifications
                                    </p>
                                </div>
                                <Toggle
                                    enabled={pushNotif}
                                    onChange={() => setPushNotif(!pushNotif)}
                                    label="Push Notifications"
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
                                    className="p-4 flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <Toggle
                                        enabled={item.value}
                                        onChange={item.toggle}
                                        label={item.label}
                                    />
                                </div>
                            ))}

                            <div className="p-4">
                                <button
                                    type="button"
                                    onClick={handleSavePrefs}
                                    disabled={updatePrefsMutation.isPending || prefsLoading}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-60"
                                >
                                    {updatePrefsMutation.isPending ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout all confirmation */}
            <Modal
                open={showLogoutAll}
                onClose={() => {
                    if (!logoutAllMutation.isPending) setShowLogoutAll(false);
                }}
                locked={logoutAllMutation.isPending}
                size="md"
                centered
                icon={
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <LogOut size={26} />
                    </div>
                }
                title="Log out of all devices"
                description="This will end every active session on your account, including this one. You will need to sign in again."
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowLogoutAll(false)}
                            disabled={logoutAllMutation.isPending}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleLogoutAll}
                            disabled={logoutAllMutation.isPending}
                            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-60 sm:py-2"
                        >
                            {logoutAllMutation.isPending ? "Logging out…" : "Log out all"}
                        </button>
                    </>
                }
            >
                {logoutError && <ErrorNote message={logoutError} />}
            </Modal>
        </div>
    );
};

export default Settings;