import { Link } from "wouter";
import { ChevronRight, Zap, Truck, Shield, Headphones } from "lucide-react";
import { BannerCarousel } from "@/components/BannerCarousel";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useBanners } from "@/hooks/useBanners";

const features = [
  { icon: Truck, title: "Fast Delivery", desc: "Doorstep delivery available" },
  { icon: Shield, title: "Quality Assured", desc: "100% genuine products" },
  { icon: Zap, title: "Best Prices", desc: "Lowest prices guaranteed" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function Home() {
  const { banners, loading: bLoading } = useBanners("hero");
  const { banners: offerBanners } = useBanners("offer");
  const { products, loading: pLoading } = useProducts();
  const { products: featured } = useFeaturedProducts();
  const { categories } = useCategories();

  return (
    <div className="page-enter">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <BannerCarousel banners={banners} loading={bLoading} />
      </section>

      {/* Feature strip */}
      <section className="bg-white border-y border-slate-100 mt-4">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">{title}</div>
                  <div className="text-[10px] text-slate-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Offer banner */}
      {offerBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-6">
          <BannerCarousel banners={offerBanners} autoPlayMs={5000} />
        </section>
      )}

      {/* Featured Products */}
      {(featured.length > 0 || pLoading) && (
        <section className="max-w-7xl mx-auto px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-yellow-500">⭐</span> Featured Products
            </h2>
            <Link href="/category/all" className="text-blue-600 text-sm font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {pLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.slice(0, 10).map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="max-w-7xl mx-auto px-4 mt-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-800">All Products</h2>
          <span className="text-sm text-slate-500">{products.length} products</span>
        </div>
        {pLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
            <div className="text-5xl mb-3">📦</div>
            <div className="text-slate-500 font-medium">No products yet</div>
            <div className="text-slate-400 text-sm mt-1">Check back soon!</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
