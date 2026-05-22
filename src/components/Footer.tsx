import { Link } from "wouter";
import { Zap, Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-black text-lg">M SMART AIRCON</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted home appliance store. Quality products, affordable prices.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:9564060532" className="hover:text-white">9564060532</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>msmartaircon@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Mitrapur Paikar, Birbhum, West Bengal</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/category/mobiles" className="hover:text-white transition-colors">Mobiles</Link></li>
              <li><Link href="/category/refrigerators" className="hover:text-white transition-colors">Refrigerators</Link></li>
              <li><Link href="/category/air-conditioners" className="hover:text-white transition-colors">Air Conditioners</Link></li>
              <li><Link href="/category/washing-machines" className="hover:text-white transition-colors">Washing Machines</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2024 M SMART AIRCON. All Rights Reserved.</span>
          <Link href="/admin/login" className="hover:text-blue-400 transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
