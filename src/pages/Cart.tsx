import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { user, customerProfile } = useAuth();
  const [, navigate] = useLocation();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !customerProfile) { navigate("/login"); return; }
    if (!address.trim() || !city.trim() || !pincode.trim()) { setError("Please fill all delivery details."); return; }
    setError(""); setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        customerId: user.uid,
        customerName: customerProfile.name,
        customerMobile: customerProfile.mobile,
        items: items.map(i => ({
          productId: i.productId,
          productTitle: i.product.title,
          productImage: i.product.images?.[0] || "",
          quantity: i.quantity,
          price: i.product.sellingPrice,
        })),
        totalAmount,
        status: "pending",
        paymentMethod,
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      clearCart();
      setSuccess("Order placed successfully! 🎉");
      setTimeout(() => navigate("/orders"), 2000);
    } catch {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center page-enter">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
      <p className="text-slate-500 mb-6">Add products to get started</p>
      <Link href="/" className="inline-block bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
        Shop Now
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-blue-600" /> My Cart ({items.length} items)
      </h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 font-medium">{success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.productId} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex gap-4">
              <img
                src={item.product.images?.[0] || "https://placehold.co/80x80/dbeafe/1e40af?text=?"}
                alt={item.product.title}
                className="w-20 h-20 object-contain rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80/dbeafe/1e40af?text=?"; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{item.product.title}</h3>
                <div className="text-blue-700 font-bold">{formatPrice(item.product.sellingPrice)}</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-slate-800">{formatPrice(item.product.sellingPrice * item.quantity)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 sticky top-4">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Items ({items.reduce((s,i) => s+i.quantity, 0)})</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800 text-base">
                <span>Total</span>
                <span className="text-blue-700">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {user ? (
              <form onSubmit={handleOrder} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Delivery Address *</label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="House no., Street, Area"
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">City *</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Pincode *</label>
                    <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Pincode" maxLength={6}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Payment Method</label>
                  <div className="flex gap-2">
                    {(["cod", "online"] as const).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${paymentMethod === m ? "bg-blue-600 text-white border-blue-600" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
                      >
                        {m === "cod" ? "💵 COD" : "💳 Online"}
                      </button>
                    ))}
                  </div>
                </div>
                {error && <div className="text-red-500 text-xs">{error}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-gradient text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            ) : (
              <div>
                <p className="text-sm text-slate-600 mb-3">Please login to place an order.</p>
                <Link href="/login" className="block w-full py-3 bg-brand-gradient text-white font-bold rounded-xl text-center hover:opacity-90">
                  Login to Continue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
