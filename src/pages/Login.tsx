import { ArrowRight, Eye, EyeOff, MapPinHouse } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../components/LoadingOverlay";
import { useLogin } from "../hooks/mutations/auth";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const { mutate: loginMutation, isPending } = useLogin();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        loginMutation(
            {
                email,
                password,
            },
            {
                onSuccess: (res: any) => {
                    toast.success("Welcome back!");
                    console.log("Login successful:", res?.data);
                    localStorage.setItem("pknockAdminToken", res?.data?.access);
                    localStorage.setItem("pknockAdminRefreshToken", res?.data?.refresh);
                    navigate("/admin/overview");
                    // navigate("/admin/overview");
                },
                onError: (err: any) => {
                    const data = err?.response?.data;
                    let message = "Something went wrong. Please try again.";

                    if (data) {
                        // 1. Nested detail object (your exact case)
                        if (typeof data.detail === "object" && data.detail?.detail) {
                            message = data.detail.detail;
                        }
                        // 2. Flat detail string
                        else if (typeof data.detail === "string") {
                            message = data.detail;
                        }
                        // 3. message field
                        else if (data.message) {
                            message = data.message;
                        }
                        // 4. non_field_errors
                        else if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
                            message = data.non_field_errors[0];
                        }
                        // 5. Field errors
                        else if (data.email?.[0]) {
                            message = data.email[0];
                        } else if (data.password?.[0]) {
                            message = data.password[0];
                        }
                        // 6. Known codes
                        else if (data.code === "authenticationfailed") {
                            message = "Invalid email or password";
                        } else if (data.code === "token_not_valid") {
                            message = "Your session has expired. Please log in again.";
                        }
                    } else if (err?.message === "Network Error") {
                        message = "Unable to reach the server. Check your connection.";
                    }

                    setErrorMsg(message);
                },
            }
        );
    };

    return (
        <div className="flex min-h-screen w-full">
            <LoadingOverlay visible={isPending} />
            <ToastContainer />

            {/* ── Left brand panel ── */}
            <div className="relative hidden w-1/2 overflow-hidden bg-[#0a0e27] md:block">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(120% 100% at 100% 100%, #3b82f6 0%, #1e3a6e 35%, #0a0e27 70%)",
                    }}
                />
                <div className="relative z-10 flex h-full flex-col p-10 lg:p-14">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-900/40">
                            <MapPinHouse className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-white">
                            P-KNOCK
                        </span>
                    </Link>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex w-full items-center justify-center bg-white px-6 py-16 md:w-1/2">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to continue exploring verified properties and stay updated
                        on the properties that matter to you.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-gray-800"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                disabled={isPending}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-gray-800"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    disabled={isPending}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={keepSignedIn}
                                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                                    disabled={isPending}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
                                />
                                Keep me signed in
                            </label>
                            <Link
                                to="/forgot-password"
                                className="font-medium text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {errorMsg && (
                            <p className="text-sm text-red-500 -mt-1">{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Signing in..." : "Sign In"}
                            {!isPending && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;