import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Zap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "login" | "register";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loginCustomer, registerCustomer } = useAuth();
  const [, navigate] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!mobile.trim() || !password.trim()) { setError("Please fill all fields."); return; }
    setLoading(true);
    try {
      await loginCustomer(mobile.trim(), password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Invalid mobile number or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!name.trim() || !mobile.trim() || !password.trim()) { setError("Please fill all fields."); return; }
    if (mobile.length !== 10) { setError("Enter a valid 10-digit mobile number."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await registerCustomer(name.trim(), mobile.trim(), password);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "";
      if (msg.includes("email-already-in-use")) {
        setError("This mobile number is already registered. Please login.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-brand-gradient text-white px-4 py-2 rounded-2xl shadow-lg">
            <Zap className="w-6 h-6" fill="white" />
            <span className="font-black text-xl">M SMART AIRCON</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {(["login", "register"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className={`flex-1 py-4 font-semibold text-sm transition-colors ${tab === t ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="Enter 10-digit mobile"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none"
                    maxLength={10}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-[38px] text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 text-sm px-3 py-2 rounded-lg">{success}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-center text-sm text-slate-500">
                  New here?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-blue-600 font-semibold">Register</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="Enter 10-digit mobile"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none"
                    maxLength={10}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-[38px] text-slate-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 text-sm px-3 py-2 rounded-lg">{success}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
                <p className="text-center text-sm text-slate-500">
                  Already registered?{" "}
                  <button type="button" onClick={() => setTab("login")} className="text-blue-600 font-semibold">Login</button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center mt-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
