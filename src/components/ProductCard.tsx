import { Link } from "wouter";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = product.discountPercent || (product.originalPrice ? calculateDiscount(product.originalPrice, product.sellingPrice) : 0);
  const image = product.images?.[0] || "https://placehold.co/400x400/dbeafe/1e40af?text=No+Image";

  return (
    <div className="product-card bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-slate-50" style={{ aspectRatio: "1" }}>
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/dbeafe/1e40af?text=No+Image"; }}
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 badge-discount">{discount}% OFF</div>
          )}
          {product.featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              ⭐ Featured
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1 hover:text-blue-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`w-3 h-3 ${i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
          ))}
          <span className="text-xs text-slate-500 ml-1">(4.2)</span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-blue-700">{formatPrice(product.sellingPrice)}</span>
          {product.originalPrice && product.originalPrice > product.sellingPrice && (
            <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          {product.codAvailable && <span className="badge-cod">COD</span>}
          {product.warranty && (
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {product.warranty} Warranty
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-brand-gradient text-white text-xs font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
