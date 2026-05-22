import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAllOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const statusOptions: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const { orders, loading } = useAllOrders();
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (id: string, status: Order["status"]) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "orders", id), { status, updatedAt: new Date().toISOString() });
    } catch { alert("Failed to update status."); }
    finally { setUpdatingId(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {(["all", ...statusOptions] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${filter === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            {s} {s === "all" ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton-pulse h-32 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100 text-slate-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className="font-mono text-xs text-slate-500">#{order.id.slice(0,12).toUpperCase()}</div>
                  <div className="font-bold text-slate-800">{order.customerName}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <span>📞 {order.customerMobile}</span>
                    <span>•</span>
                    <span className="capitalize">{order.paymentMethod === "cod" ? "💵 COD" : "💳 Online"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-700 text-lg">{formatPrice(order.totalAmount)}</div>
                  <div className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Items */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 shrink-0 text-sm">
                    <img src={item.productImage || "https://placehold.co/32x32/dbeafe/1e40af?text=?"} alt="" className="w-8 h-8 rounded object-contain"
                      onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/32x32/dbeafe/1e40af?text=?"; }} />
                    <div>
                      <div className="font-medium text-slate-700 max-w-[120px] truncate text-xs">{item.productTitle}</div>
                      <div className="text-slate-500 text-xs">×{item.quantity} · {formatPrice(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-500 mb-3">
                📍 {order.address}, {order.city} - {order.pincode}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-slate-100 text-slate-600"}`}>
                  {order.status.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">Update:</span>
                {statusOptions.filter(s => s !== order.status).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id, s)}
                    disabled={updatingId === order.id}
                    className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 capitalize transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
