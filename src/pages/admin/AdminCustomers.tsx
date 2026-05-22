import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Users, Phone, Search } from "lucide-react";
import { db } from "@/lib/firebase";
import type { Customer } from "@/types";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setCustomers(snap.docs.map(d => d.data() as Customer));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const filtered = customers.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.mobile?.includes(search)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-600" /> Customers
      </h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="font-bold text-slate-800">All Customers</span>
            <span className="ml-2 text-slate-500 text-sm">({filtered.length})</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or mobile"
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500 w-52"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton-pulse h-12 rounded-lg" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No customers found.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((c, i) => (
              <div key={c.uid || i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                  {c.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{c.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {c.mobile}
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                </div>
                <a
                  href={`https://wa.me/91${c.mobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-700 text-xs font-medium px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
