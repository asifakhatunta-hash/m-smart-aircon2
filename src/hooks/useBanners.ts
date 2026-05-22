import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Banner } from "@/types";

export function useBanners(type?: Banner["type"]) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q;
    if (type) {
      q = query(collection(db, "banners"), where("active", "==", true), where("type", "==", type), orderBy("order", "asc"));
    } else {
      q = query(collection(db, "banners"), where("active", "==", true), orderBy("order", "asc"));
    }
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner));
      setBanners(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [type]);

  return { banners, loading };
}

export function useAllBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "banners"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner));
      setBanners(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return { banners, loading };
}
