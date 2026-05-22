import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, X, Zap, LogOut, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCategories } from "@/hooks/useCategories";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [, navigate] = useLocation();
  const { user, customerProfile, logout } = useAuth();
  const { totalItems } = useCart();
  const { categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="bg-brand-gradient text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 py-2.5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-black text-lg leading-tight hidden sm:block">M SMART AIRCON</span>
              <span className="font-black text-base leading-tight sm:hidden">MSA</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-2">
              <div className="flex bg-white rounded-lg overflow-hidden shadow-md">
                <input
                  type="search"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 text-slate-800 text-sm outline-none"
                />
                <button type="submit" className="px-4 bg-yellow-400 hover:bg-yellow-500 transition-colors">
                  <Search className="w-4 h-4 text-slate-800" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/orders" className="hidden sm:flex flex-col items-center text-white/90 hover:text-white text-xs">
                    <Package className="w-5 h-5" />
                    <span>Orders</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="hidden sm:flex flex-col items-center text-white/90 hover:text-white text-xs"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                  <span className="hidden sm:block text-white/70 text-xs max-w-[80px] truncate">
                    Hi, {customerProfile?.name || "User"}
                  </span>
                </div>
              ) : (
                <Link href="/login" className="flex flex-col items-center text-white/90 hover:text-white text-xs">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">Login</span>
                </Link>
              )}
              <Link href="/cart" className="flex flex-col items-center text-white/90 hover:text-white text-xs relative">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block">Cart</span>
              </Link>
              <button className="sm:hidden text-white" onClick={() => setMenuOpen(o => !o)}>
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="bg-blue-700 text-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-1.5 whitespace-nowrap">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors shrink-0"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-white shadow-xl border-t sm:hidden">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                <div className="text-sm font-semibold text-slate-700">Hi, {customerProfile?.name || "User"}</div>
                <Link href="/orders" className="block py-2 text-slate-700 text-sm" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block py-2 text-red-500 text-sm w-full text-left">Logout</button>
              </>
            ) : (
              <Link href="/login" className="block py-2 text-blue-600 text-sm font-medium" onClick={() => setMenuOpen(false)}>Login / Register</Link>
            )}
            <div className="border-t pt-2">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-2 py-2 text-sm text-slate-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{cat.icon}</span><span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
