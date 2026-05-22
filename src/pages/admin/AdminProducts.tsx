import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Edit, X, Eye, Save, Star, Package } from "lucide-react";
import { db } from "@/lib/firebase";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const EMPTY_FORM = {
  title: "",
  sellingPrice: "",
  originalPrice: "",
  discountPercent: "",
  stock: "1",
  warranty: "",
  description: "",
  images: [""],
  highlights: [""],
  specifications: [{ key: "", value: "" }],
  categoryId: "",
  featured: false,
  codAvailable: true,
};

type FormState = typeof EMPTY_FORM;

export default function AdminProducts() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImg, setPreviewImg] = useState(0);

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowForm(true);
    setPreviewImg(0);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      title: p.title,
      sellingPrice: String(p.sellingPrice),
      originalPrice: String(p.originalPrice || ""),
      discountPercent: String(p.discountPercent || ""),
      stock: String(p.stock),
      warranty: p.warranty || "",
      description: p.description || "",
      images: p.images?.length ? p.images : [""],
      highlights: p.highlights?.length ? p.highlights : [""],
      specifications: p.specifications?.length ? p.specifications : [{ key: "", value: "" }],
      categoryId: p.categoryId || "",
      featured: p.featured || false,
      codAvailable: p.codAvailable !== false,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
    setPreviewImg(0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Product title is required."); return; }
    if (!form.sellingPrice || isNaN(Number(form.sellingPrice))) { setError("Valid selling price is required."); return; }
    setSaving(true);
    try {
      const categoryName = categories.find(c => c.id === form.categoryId)?.name || "";
      const data = {
        title: form.title.trim(),
        sellingPrice: Number(form.sellingPrice),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : null,
        stock: Number(form.stock) || 0,
        warranty: form.warranty.trim(),
        description: form.description.trim(),
        images: form.images.filter(i => i.trim()),
        highlights: form.highlights.filter(h => h.trim()),
        specifications: form.specifications.filter(s => s.key.trim()),
        categoryId: form.categoryId,
        categoryName,
        featured: form.featured,
        codAvailable: form.codAvailable,
        updatedAt: new Date().toISOString(),
      };

      if (editProduct) {
        await updateDoc(doc(db, "products", editProduct.id), data);
        setSuccess("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: new Date().toISOString() });
        setSuccess("Product added successfully!");
        setForm(EMPTY_FORM);
      }
      setTimeout(() => { setSuccess(""); if (!editProduct) setShowForm(false); }, 2000);
    } catch {
      setError("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch { alert("Failed to delete."); }
  };

  // Form helpers
  const addImage = () => setForm(f => ({ ...f, images: [...f.images, ""] }));
  const removeImage = (i: number) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const updateImage = (i: number, v: string) => setForm(f => ({ ...f, images: f.images.map((img, idx) => idx === i ? v : img) }));

  const addHighlight = () => setForm(f => ({ ...f, highlights: [...f.highlights, ""] }));
  const removeHighlight = (i: number) => setForm(f => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }));
  const updateHighlight = (i: number, v: string) => setForm(f => ({ ...f, highlights: f.highlights.map((h, idx) => idx === i ? v : h) }));

  const addSpec = () => setForm(f => ({ ...f, specifications: [...f.specifications, { key: "", value: "" }] }));
  const removeSpec = (i: number) => setForm(f => ({ ...f, specifications: f.specifications.filter((_, idx) => idx !== i) }));
  const updateSpec = (i: number, field: "key" | "value", v: string) =>
    setForm(f => ({ ...f, specifications: f.specifications.map((s, idx) => idx === i ? { ...s, [field]: v } : s) }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center p-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-lg">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                {/* Basic info */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Product Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Samsung 1.5 Ton 5 Star AC"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Selling Price (₹) *</label>
                    <input type="number" value={form.sellingPrice} onChange={e => setForm(f => ({ ...f, sellingPrice: e.target.value }))}
                      placeholder="35000" min="0"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Original Price (₹)</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                      placeholder="40000" min="0"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Discount %</label>
                    <input type="number" value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))}
                      placeholder="12" min="0" max="100"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Stock Qty</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      placeholder="10" min="0"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Category</label>
                    <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Warranty</label>
                    <input type="text" value={form.warranty} onChange={e => setForm(f => ({ ...f, warranty: e.target.value }))}
                      placeholder="e.g. 1 Year"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blue-600" />
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.codAvailable} onChange={e => setForm(f => ({ ...f, codAvailable: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blue-600" />
                    <span className="text-sm font-medium text-slate-700">💵 COD Available</span>
                  </label>
                </div>

                {/* Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">Image URLs</label>
                    <button type="button" onClick={addImage} className="text-xs text-blue-600 font-medium hover:text-blue-800">+ Add Image</button>
                  </div>
                  <div className="space-y-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="url" value={img} onChange={e => updateImage(i, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                        {img && (
                          <button type="button" onClick={() => setPreviewImg(i)}
                            className="px-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {form.images.length > 1 && (
                          <button type="button" onClick={() => removeImage(i)} className="px-2 text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {form.images[previewImg] && (
                    <img src={form.images[previewImg]} alt="preview" className="mt-2 h-24 rounded-lg object-contain border border-slate-200"
                      onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/96x96/dbeafe/1e40af?text=Invalid"; }} />
                  )}
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">Key Highlights</label>
                    <button type="button" onClick={addHighlight} className="text-xs text-blue-600 font-medium hover:text-blue-800">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {form.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={h} onChange={e => updateHighlight(i, e.target.value)}
                          placeholder="e.g. 5 Star Energy Rating"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                        {form.highlights.length > 1 && (
                          <button type="button" onClick={() => removeHighlight(i)} className="px-2 text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">Specifications</label>
                    <button type="button" onClick={addSpec} className="text-xs text-blue-600 font-medium hover:text-blue-800">+ Add Row</button>
                  </div>
                  <div className="space-y-2">
                    {form.specifications.map((spec, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={spec.key} onChange={e => updateSpec(i, "key", e.target.value)}
                          placeholder="e.g. Capacity"
                          className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                        <input type="text" value={spec.value} onChange={e => updateSpec(i, "value", e.target.value)}
                          placeholder="e.g. 1.5 Ton"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                        {form.specifications.length > 1 && (
                          <button type="button" onClick={() => removeSpec(i)} className="px-2 text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Product description..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500 resize-none" />
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 text-sm px-3 py-2 rounded-lg">✓ {success}</div>}

                <div className="flex gap-3">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 flex-1 justify-center py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors">
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Products list */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-pulse h-36 rounded-xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <div className="text-slate-500 font-medium">No products yet</div>
          <button onClick={openAdd} className="mt-3 text-blue-600 font-semibold hover:underline">Add your first product</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex gap-3 p-4">
                <img
                  src={p.images?.[0] || "https://placehold.co/64x64/dbeafe/1e40af?text=?"}
                  alt={p.title}
                  className="w-16 h-16 object-contain rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/64x64/dbeafe/1e40af?text=?"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{p.title}</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-blue-700 text-sm">{formatPrice(p.sellingPrice)}</span>
                    {p.featured && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold">⭐ Featured</span>}
                    {p.codAvailable && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">COD</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Stock: {p.stock} · {p.categoryName || "Uncategorized"}</div>
                </div>
              </div>
              <div className="flex border-t border-slate-50">
                <button onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(p.id, p.title)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-500 hover:bg-red-50 text-xs font-semibold transition-colors border-l border-slate-50">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
