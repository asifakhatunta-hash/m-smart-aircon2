import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAllBanners } from "@/hooks/useBanners";
import type { Banner } from "@/types";

export default function AdminBanners() {
  const { banners } = useAllBanners();
  const [form, setForm] = useState({ title: "", subtitle: "", imageUrl: "", linkUrl: "", type: "hero" as Banner["type"] });
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl.trim()) { setError("Image URL is required."); return; }
    setError(""); setLoading(true);
    try {
      await addDoc(collection(db, "banners"), {
        ...form,
        active: true,
        order: banners.length,
        createdAt: new Date().toISOString(),
      });
      setSuccess("Banner added!");
      setForm({ title: "", subtitle: "", imageUrl: "", linkUrl: "", type: "hero" });
      setPreviewUrl("");
      setTimeout(() => setSuccess(""), 2500);
    } catch {
      setError("Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await updateDoc(doc(db, "banners", banner.id), { active: !banner.active });
    } catch { alert("Failed to update."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await deleteDoc(doc(db, "banners", id));
    } catch { alert("Failed to delete."); }
  };

  const typeColors = { hero: "bg-blue-100 text-blue-700", offer: "bg-green-100 text-green-700", deal: "bg-amber-100 text-amber-700" };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Banners</h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-slate-800 mb-4">Add New Banner</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Banner title"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder="Banner subtitle"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Image URL *</label>
            <div className="flex gap-2">
              <input type="url" value={form.imageUrl}
                onChange={e => { setForm(f => ({ ...f, imageUrl: e.target.value })); setPreviewUrl(""); }}
                placeholder="https://example.com/banner.jpg"
                className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
              {form.imageUrl && (
                <button type="button" onClick={() => setPreviewUrl(form.imageUrl)}
                  className="px-3 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 text-sm">
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="mt-2 h-24 rounded-lg object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/400x150/dbeafe/1e40af?text=Invalid+URL"; }} />
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Banner["type"] }))}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500">
                <option value="hero">Hero Banner</option>
                <option value="offer">Offer Banner</option>
                <option value="deal">Deal Banner</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Link URL</label>
              <input type="url" value={form.linkUrl} onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">✓ {success}</p>}
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            {loading ? "Adding..." : "Add Banner"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <span className="font-bold text-slate-800">All Banners</span>
          <span className="ml-2 text-slate-500 text-sm">({banners.length})</span>
        </div>
        {banners.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No banners yet.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {banners.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-4">
                <img src={b.imageUrl} alt={b.title} className="w-20 h-12 object-cover rounded-lg bg-slate-100 shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/80x48/dbeafe/1e40af?text=?"; }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm truncate">{b.title || "(No title)"}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColors[b.type] || "bg-slate-100 text-slate-600"}`}>
                      {b.type}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {b.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <button onClick={() => toggleActive(b)} className={`${b.active ? "text-green-500" : "text-slate-400"} hover:scale-110 transition-transform`}>
                  {b.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
