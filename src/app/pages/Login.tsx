import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Fish, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft, Shield } from "lucide-react";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1609101419675-60842b69628d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZpc2glMjBwb25kJTIwdGVjaG5vbG9neSUyMGFlcmF0aW9ufGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=1920";

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } else {
      setError(result.error ?? "Login failed. Please try again.");
    }
  };

  const fillDemo = (role: "admin" | "manager") => {
    if (role === "admin") { setEmail("admin@aquafarm.co.ke"); setPassword("admin123"); }
    else { setEmail("manager@aquafarm.co.ke"); setPassword("manager123"); }
    setError(null);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Left — Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={BG_IMAGE} alt="Aquafarm" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-teal-800/80 to-teal-700/70" />
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
              Admin Control<br />Centre
            </h2>
            <p className="text-teal-200 text-lg leading-relaxed mb-8">
              Manage fish stock, track sales, schedule visits, and oversee daily farm operations — all in one place.
            </p>
            {/* Features */}
            <div className="space-y-3">
              {[
                "Real-time fish stock monitoring",
                "Sales & revenue analytics",
                "Supplier & inventory management",
                "Visit & booking management",
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
            <span>Secured with JWT authentication</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
        {/* Back link */}
        <div className="w-full max-w-md mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-600 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Website
          </Link>
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
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-teal-100 p-2 rounded-xl">
                  <Lock size={16} className="text-teal-700" />
                </div>
                <span className="text-teal-600 text-sm font-semibold uppercase tracking-wide">
                  Admin Portal
                </span>
              </div>
              <h1 className="text-gray-900 text-2xl font-bold">Sign in to Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">
                Enter your admin credentials to access the control panel.
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-amber-800 text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Shield size={12} />
                Demo Credentials — Click to Fill
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("admin")}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("manager")}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                >
                  Manager
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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
                    placeholder="admin@aquafarm.co.ke"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="Enter your password"
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

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  <CheckCircle size={15} className="flex-shrink-0" />
                  <span>Login successful! Redirecting to dashboard...</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-teal-700 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-teal-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={16} />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security note */}
          <p className="text-center text-gray-400 text-xs mt-6">
            🔒 This is a secured admin area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
