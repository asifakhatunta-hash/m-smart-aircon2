import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-7xl mb-4">😕</div>
      <h1 className="text-2xl font-bold text-slate-700 mb-2">Page Not Found</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link href="/" className="bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
        Go Home
      </Link>
    </div>
  );
}
