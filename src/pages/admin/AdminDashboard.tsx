import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Package, ShoppingBag, Users, Grid, TrendingUp } from "lucide-react";
import { db } from "@/lib/firebase";

interface Stats {
  products: number;
  orders: number;
  customers: number;
  categories: number;
  revenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, customers: 0, categories: 0, revenue: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<{ id: string; customerName: string; totalAmount: number; status: string; createdAt: string }[]>([]);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    unsubs.push(onSnapshot(query(collection(db, "products")), snap => {
      setStats(s => ({ ...s, products: snap.size }));
    }));

    unsubs.push(onSnapshot(query(collection(db, "categories")), snap => {
      setStats(s => ({ ...s, categories: snap.size }));
    }));

    unsubs.push(onSnapshot(query(collection(db, "customers")), snap => {
      setStats(s => ({ ...s, customers: snap.size }));
    }));

    unsubs.push(onSnapshot(query(collection(db, "orders")), snap => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as { id: string; customerName: string; totalAmount: number; status: string; createdAt: string }));
      const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
      const pending = orders.filter(o => o.status === "pending").length;
      setStats(s => ({ ...s, orders: snap.size, revenue, pendingOrders: pending }));
      setRecentOrders(orders.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1).slice(0, 5));
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  const cards = [
    { icon: Package, label: "Total Products", value: stats.products, color: "from-blue-500 to-blue-600" },
    { icon: ShoppingBag, label: "Total Orders", value: stats.orders, sub: `${stats.pendingOrders} pending`, color: "from-purple-500 to-purple-600" },
    { icon: Users, label: "Customers", value: stats.customers, color: "from-green-500 to-green-600" },
    { icon: Grid, label: "Categories", value: stats.categories, color: "from-amber-500 to-amber-600" },
    { icon: TrendingUp, label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, color: "from-rose-500 to-rose-600" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-lg`}>
            <Icon className="w-7 h-7 mb-2 opacity-90" />
            <div className="text-2xl font-black">{value}</div>
            <div className="text-white/80 text-xs font-medium mt-0.5">{label}</div>
            {sub && <div className="text-white/60 text-[10px] mt-0.5">{sub}</div>}
          </div>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-800 text-lg mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs">Order ID</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs">Customer</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs">Amount</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs">Status</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs text-slate-600">{o.id.slice(0,10).toUpperCase()}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{o.customerName}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-700">₹{o.totalAmount?.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[o.status] || "bg-slate-100 text-slate-600"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
