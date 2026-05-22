import { Link, useLocation } from "wouter";
import { Home, Grid, ShoppingCart, User, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function BottomNav() {
  const [location] = useLocation();
  const { totalItems } = useCart();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/category/all", icon: Grid, label: "Categories" },
    { href: "/orders", icon: Package, label: "Orders" },
    { href: "/login", icon: User, label: "Account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 sm:hidden mobile-bottom-nav shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around py-2">
        {links.map(({ href, icon: Icon, label }) => {
          const active = location === href;
          return (
            <Link key={href} href={href} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${active ? "text-blue-600" : "text-slate-500"}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        <Link href="/cart" className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${location === "/cart" ? "text-blue-600" : "text-slate-500"}`}>
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
      </div>
    </div>
  );
}
