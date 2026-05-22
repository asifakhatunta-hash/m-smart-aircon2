import { useRoute } from "wouter";
import { useCategories } from "@/hooks/useCategories";
import { useProductsByCategory, useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";
  const { categories } = useCategories();
  const category = slug === "all" ? null : categories.find(c => c.slug === slug);

  const { products: catProducts, loading: catLoading } = useProductsByCategory(category?.id || "");
  const { products: allProducts, loading: allLoading } = useProducts();

  const products = slug === "all" ? allProducts : catProducts;
  const loading = slug === "all" ? allLoading : catLoading;

  const title = slug === "all" ? "All Products" : category?.name || "Category";
  const icon = category?.icon || "📦";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">
      <div className="flex items-center gap-3 mb-6">
        {slug !== "all" && <span className="text-4xl">{icon}</span>}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {!loading && <p className="text-slate-500 text-sm">{products.length} products found</p>}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <div className="text-5xl mb-3">{icon}</div>
          <div className="text-slate-500 font-medium">No products in {title}</div>
          <div className="text-slate-400 text-sm mt-1">Check back soon!</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
