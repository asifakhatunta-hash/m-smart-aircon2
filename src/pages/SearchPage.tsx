import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function SearchPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const q = params.get("q") || "";
  const { products, loading } = useProducts();
  const [results, setResults] = useState(products);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    const lower = q.toLowerCase();
    setResults(products.filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower) ||
      p.categoryName?.toLowerCase().includes(lower)
    ));
  }, [q, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">
      <h1 className="text-xl font-bold text-slate-800 mb-1">
        Search results for <span className="text-blue-600">"{q}"</span>
      </h1>
      {!loading && <p className="text-slate-500 text-sm mb-6">{results.length} results found</p>}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <div className="text-5xl mb-3">🔍</div>
          <div className="text-slate-500 font-medium">No products found for "{q}"</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {results.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
