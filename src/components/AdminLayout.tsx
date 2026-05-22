import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Package, Grid, Image, ShoppingBag, Users,
  LogOut, Menu, X, Zap, ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Grid, label: "Categories" },
  { href: "/admin/banners", icon: Image, label: "Banners" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 admin-sidebar text-white flex flex-col shadow-2xl transition-transform duration-300
        lg:relative lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <div className="font-black text-sm leading-none">M SMART AIRCON</div>
              <div className="text-white/60 text-[10px]">Admin Panel</div>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  active
                    ? "bg-white text-blue-700 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-blue-600" : ""}`} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-slate-700">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-800">Admin Panel</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
