import { useState } from "react";
import { useLocation } from "wouter";
import { Zap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@msmartaircon.com");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginAdmin } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(email.trim(), password);
      navigate("/admin");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "";
      if (msg.includes("Access denied")) {
        setError("Access denied. Only admin can login here.");
      } else if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Wrong password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="font-black text-2xl">M SMART AIRCON</span>
          </div>
          <div className="text-blue-300 text-sm font-semibold">Admin Panel</div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7">
          <h2 className="text-xl font-bold text-slate-800 mb-5">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500 pr-10"
              />
              <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-[38px] text-slate-400">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-60 transition-colors"
            >
              {loading ? "Logging in..." : "Login to Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
