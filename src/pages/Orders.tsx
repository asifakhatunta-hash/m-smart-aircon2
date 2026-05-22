import { Link, useLocation } from "wouter";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-600 bg-blue-50", label: "Confirmed" },
  shipped: { icon: Truck, color: "text-purple-600 bg-purple-50", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Cancelled" },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { orders, loading } = useCustomerOrders(user?.uid || "");

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (!user) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center page-enter">
      <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">Please login to view orders</h2>
      <Link href="/login" className="inline-block bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
        Login
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-blue-600" /> My Orders
      </h1>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton-pulse h-28 rounded-xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <div className="text-slate-500 font-medium">No orders yet</div>
          <Link href="/" className="inline-block mt-4 text-blue-600 font-semibold hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const Icon = status.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <div className="text-xs text-slate-500">Order ID</div>
                    <div className="font-mono text-sm font-bold text-slate-700">{order.id.slice(0,12).toUpperCase()}</div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 shrink-0">
                      <img src={item.productImage || "https://placehold.co/40x40/dbeafe/1e40af?text=?"} alt=""
                        className="w-10 h-10 rounded object-contain"
                        onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/40x40/dbeafe/1e40af?text=?"; }} />
                      <div>
                        <div className="text-xs font-medium text-slate-700 max-w-[120px] truncate">{item.productTitle}</div>
                        <div className="text-xs text-slate-500">Qty: {item.quantity} × {formatPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                  <div className="text-slate-600">
                    <span className="font-semibold">Payment:</span>{" "}
                    <span className="capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span>
                  </div>
                  <div className="font-bold text-blue-700 text-base">{formatPrice(order.totalAmount)}</div>
                </div>

                <div className="text-xs text-slate-400 mt-2">
                  {order.address}, {order.city} - {order.pincode} • {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
