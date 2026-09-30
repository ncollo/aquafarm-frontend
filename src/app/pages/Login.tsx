import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Fish, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft, Shield, KeyRound, RefreshCw } from "lucide-react";
import api from "../../utils/api";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1609101419675-60842b69628d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZpc2glMjBwb25kJTIwdGVjaG5vbG9neSUyMGFlcmF0aW9ufGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=1920";

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: "login" | "forgot" | "reset"
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check for reset token in URL parameters (?token=...&id=...)
  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("id");
    if (token && userId) {
      setMode("reset");
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      setSuccessMsg("Login successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } else {
      setError(result.error ?? "Invalid credentials. Please verify your email and password.");
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: email.trim() });
      setSuccessMsg(res.data.message || "A secure password reset link has been dispatched to your email.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Unable to send reset email. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const token = searchParams.get("token");
    const userId = searchParams.get("id");

    if (!token || !userId) {
      setError("Invalid or expired password reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        userId,
        token,
        newPassword,
      });
      setSuccessMsg(res.data.message || "Your password has been successfully updated! You can now log in.");
      setTimeout(() => {
        setMode("login");
        setSuccessMsg(null);
        setPassword("");
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left — Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={BG_IMAGE} alt="Aquafarm" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/95 via-teal-800/85 to-teal-700/75" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
              <Fish size={28} className="text-amber-300" />
            </div>
            <div>
              <div className="font-bold text-2xl leading-none" style={{ fontFamily: "Playfair Display, serif" }}>
                Aquafarm
              </div>
              <div className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                Fisheries
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
              Staff & Operations<br />Control Center
            </h2>
            <p className="text-teal-200 text-lg leading-relaxed mb-8">
              Manage live farm stock, track sales orders, oversee pond telemetry, and coordinate staff operations.
            </p>
            {/* Features */}
            <div className="space-y-3">
              {[
                "Live pond telemetry & stock monitoring",
                "M-Pesa sales reconciliation & receipting",
                "Supply chain & feed inventory logs",
                "Role-based access control & audit trail",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-teal-100">
                  <div className="w-5 h-5 bg-amber-500/20 border border-amber-400/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-amber-300" />
                  </div>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center gap-2 text-teal-300 text-sm">
            <Shield size={14} className="text-amber-400" />
            <span>Encrypted with SHA-256 and JWT session security</span>
          </div>
        </div>
      </div>

      {/* Right — Auth Portal */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
        {/* Back link */}
        <div className="w-full max-w-md mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-600 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Public Website
          </Link>
          {mode !== "login" && (
            <button
              onClick={() => { setMode("login"); setError(null); setSuccessMsg(null); }}
              className="text-xs text-gray-500 hover:text-teal-700 font-semibold"
            >
              Back to Sign In
            </button>
          )}
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="bg-teal-700 p-2 rounded-xl">
            <Fish size={22} className="text-white" />
          </div>
          <div>
            <div className="text-teal-800 font-bold text-xl leading-none" style={{ fontFamily: "Playfair Display, serif" }}>
              Aquafarm
            </div>
            <div className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
              Fisheries
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-teal-100 p-2 rounded-xl">
                  {mode === "login" ? (
                    <Lock size={16} className="text-teal-700" />
                  ) : mode === "forgot" ? (
                    <Mail size={16} className="text-teal-700" />
                  ) : (
                    <KeyRound size={16} className="text-teal-700" />
                  )}
                </div>
                <span className="text-teal-600 text-sm font-semibold uppercase tracking-wide">
                  {mode === "login" ? "Staff Portal" : mode === "forgot" ? "Account Recovery" : "Password Reset"}
                </span>
              </div>
              <h1 className="text-gray-900 text-2xl font-bold">
                {mode === "login"
                  ? "Sign in to Dashboard"
                  : mode === "forgot"
                  ? "Reset Your Password"
                  : "Choose New Password"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {mode === "login"
                  ? "Enter your authorized credentials to access the ERP management dashboard."
                  : mode === "forgot"
                  ? "Enter your registered email address and we'll send a secure password reset link."
                  : "Enter a strong new password for your account."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 mb-5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-center gap-2 p-3.5 mb-5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                <CheckCircle size={16} className="flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ─── Mode 1: Login Form ─── */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="e.g. admin@aquafarm.co.ke"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-gray-700 text-sm font-semibold">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); setError(null); setSuccessMsg(null); }}
                      className="text-xs text-teal-700 hover:text-teal-600 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      placeholder="Enter your secure password"
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-teal-700 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-teal-200 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Sign In to Control Center
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ─── Mode 2: Forgot Password Form ─── */}
            {mode === "forgot" && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="e.g. staff@aquafarm.co.ke"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-700 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-teal-200 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Dispatching Reset Link...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Send Reset Instructions
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); setSuccessMsg(null); }}
                    className="text-xs text-gray-500 hover:text-teal-700 font-semibold"
                  >
                    Remember your password? Sign in
                  </button>
                </div>
              </form>
            )}

            {/* ─── Mode 3: Reset Password Form ─── */}
            {mode === "reset" && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                    New Secure Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
                      placeholder="Minimum 8 characters"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                      placeholder="Re-type your password"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-700 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-teal-200 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <KeyRound size={16} />
                      Set New Password & Log In
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Security note */}
          <p className="text-center text-gray-400 text-xs mt-6">
            🔒 Authorized personnel access only. Sessions are monitored for security.
          </p>
        </div>
      </div>
    </div>
  );
}
