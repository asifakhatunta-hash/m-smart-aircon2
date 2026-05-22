import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/types";

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      setOrders(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  return { orders, loading };
}

export function useCustomerOrders(customerId: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) { setLoading(false); return; }
    const q = query(collection(db, "orders"), where("customerId", "==", customerId), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      setOrders(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [customerId]);

  return { orders, loading };
}
