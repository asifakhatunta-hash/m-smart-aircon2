import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { doc, getDoc } from "firebase/firestore";
import { ShoppingCart, Check, ChevronLeft, Star, Truck, Shield, RotateCcw, Zap } from "lucide-react";
import { db } from "@/lib/firebase";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const [, navigate] = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { products } = useProducts();

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    setActiveImg(0);
    getDoc(doc(db, "products", params.id)).then(snap => {
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
      else setProduct(null);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, [params?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="skeleton-pulse rounded-xl" style={{ aspectRatio: "1" }} />
        <div className="space-y-3">
          <div className="skeleton-pulse h-6 rounded w-full" />
          <div className="skeleton-pulse h-6 rounded w-3/4" />
          <div className="skeleton-pulse h-10 rounded w-1/2" />
          <div className="skeleton-pulse h-12 rounded w-full" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-bold text-slate-700 mb-2">Product not found</h2>
      <Link href="/" className="text-blue-600 hover:underline">← Go back home</Link>
    </div>
  );

  const discount = product.discountPercent || (product.originalPrice ? calculateDiscount(product.originalPrice, product.sellingPrice) : 0);
  const images = product.images?.length ? product.images : ["https://placehold.co/600x600/dbeafe/1e40af?text=No+Image"];
  const related = products.filter(p => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 5);

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 mb-3">
              <img
                src={images[activeImg]}
                alt={product.title}
                className="w-full object-contain p-6"
                style={{ aspectRatio: "1" }}
                onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/600x600/dbeafe/1e40af?text=No+Image"; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? "border-blue-500" : "border-slate-200"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1"
                      onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/64x64/dbeafe/1e40af?text=?"; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{product.title}</h1>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500">4.2 (128 reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-blue-700">{formatPrice(product.sellingPrice)}</span>
                {product.originalPrice && product.originalPrice > product.sellingPrice && (
                  <span className="text-lg text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
                {discount > 0 && <span className="badge-discount text-sm">{discount}% OFF</span>}
              </div>
              {discount > 0 && (
                <p className="text-green-600 text-sm font-medium mt-1">
                  You save {formatPrice((product.originalPrice || 0) - product.sellingPrice)}!
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              {product.codAvailable && (
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                  <span className="text-amber-700 font-bold text-xs">💵 COD Available</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 font-bold text-xs">{product.warranty} Warranty</span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold text-sm">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-500 font-semibold text-sm">✗ Out of Stock</span>
              )}
            </div>

            {/* Highlights */}
            {product.highlights?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 mb-2 text-sm">Key Highlights</h3>
                <ul className="space-y-1">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <Zap className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-all ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-brand-gradient text-white hover:opacity-90"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <Link
                href="/cart"
                className="flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Delivery */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Truck, text: "Free Delivery*" },
                { icon: RotateCcw, text: "Easy Returns" },
                { icon: Shield, text: "Genuine Product" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-lg text-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] text-slate-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-8 bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Product Description</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>
        )}

        {/* Specifications */}
        {product.specifications?.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Technical Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                      <td className="py-2.5 px-4 font-semibold text-slate-700 w-1/3 border border-slate-200">{spec.key}</td>
                      <td className="py-2.5 px-4 text-slate-600 border border-slate-200">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
