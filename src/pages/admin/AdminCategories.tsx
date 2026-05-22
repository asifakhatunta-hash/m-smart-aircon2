import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { useCategories } from "@/hooks/useCategories";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

export default function AdminCategories() {
  const { categories } = useCategories();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Category name is required."); return; }
    setError(""); setLoading(true);
    try {
      await addDoc(collection(db, "categories"), {
        name: name.trim(),
        slug: slugify(name.trim()),
        icon: icon.trim() || "📦",
        order: categories.length,
        createdAt: new Date().toISOString(),
      });
      setSuccess(`"${name}" added!`);
      setName("");
      setIcon("📦");
      setTimeout(() => setSuccess(""), 2500);
    } catch {
      setError("Failed to add category. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch {
      alert("Failed to delete.");
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
  };

  const cancelEdit = () => { setEditId(null); };

  const saveEdit = async (cat: Category) => {
    if (!editName.trim()) return;
    setEditLoading(true);
    try {
      await updateDoc(doc(db, "categories", cat.id), {
        name: editName.trim(),
        slug: slugify(editName.trim()),
        icon: editIcon.trim() || "📦",
      });
      setEditId(null);
    } catch {
      alert("Failed to update.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Categories</h1>

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-slate-800 mb-4">Add New Category</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Category name (e.g. Air Conditioners)"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-28">
            <input
              type="text"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              placeholder="Icon (emoji)"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">✓ {success}</p>}
      </div>

      {/* Categories list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <span className="font-bold text-slate-800">All Categories</span>
          <span className="ml-2 text-slate-500 text-sm">({categories.length})</span>
        </div>
        {categories.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No categories yet. Add one above.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 px-4 py-3">
                {editId === cat.id ? (
                  <>
                    <input type="text" value={editIcon} onChange={e => setEditIcon(e.target.value)}
                      className="w-14 px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none" />
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                    <button onClick={() => saveEdit(cat)} disabled={editLoading} className="text-green-600 hover:text-green-700 disabled:opacity-50">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 text-sm">{cat.name}</div>
                      <div className="text-xs text-slate-400">/{cat.slug}</div>
                    </div>
                    <button onClick={() => startEdit(cat)} className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
