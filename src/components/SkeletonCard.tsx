export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="skeleton-pulse" style={{ aspectRatio: "1" }} />
      <div className="p-3 space-y-2">
        <div className="skeleton-pulse h-3 rounded w-full" />
        <div className="skeleton-pulse h-3 rounded w-3/4" />
        <div className="skeleton-pulse h-5 rounded w-1/2" />
        <div className="skeleton-pulse h-8 rounded w-full mt-3" />
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return <div className="skeleton-pulse rounded-xl w-full" style={{ height: 200 }} />;
}

export function SkeletonText({ className }: { className?: string }) {
  return <div className={`skeleton-pulse rounded ${className}`} />;
}
