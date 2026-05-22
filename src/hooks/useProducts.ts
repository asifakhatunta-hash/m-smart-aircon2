import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      setProducts(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return { products, loading };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), where("featured", "==", true), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      setProducts(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return { products, loading };
}

export function useProductsByCategory(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) { setLoading(false); return; }
    const q = query(collection(db, "products"), where("categoryId", "==", categoryId), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      setProducts(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [categoryId]);

  return { products, loading };
}
