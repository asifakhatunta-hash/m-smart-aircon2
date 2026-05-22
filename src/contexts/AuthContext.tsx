import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface CustomerProfile {
  uid: string;
  name: string;
  mobile: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  customerProfile: CustomerProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginCustomer: (mobile: string, password: string) => Promise<void>;
  registerCustomer: (name: string, mobile: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        if (firebaseUser.email === "admin@msmartaircon.com") {
          setIsAdmin(true);
          setCustomerProfile(null);
        } else {
          setIsAdmin(false);
          try {
            const docRef = doc(db, "customers", firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setCustomerProfile(docSnap.data() as CustomerProfile);
            }
          } catch {
            setCustomerProfile(null);
          }
        }
      } else {
        setIsAdmin(false);
        setCustomerProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginCustomer = async (mobile: string, password: string) => {
    const email = `${mobile}@msmartaircon.customer`;
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerCustomer = async (name: string, mobile: string, password: string) => {
    const email = `${mobile}@msmartaircon.customer`;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile: CustomerProfile = {
      uid: cred.user.uid,
      name,
      mobile,
      email,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "customers", cred.user.uid), profile);
    setCustomerProfile(profile);
  };

  const loginAdmin = async (email: string, password: string) => {
    if (email !== "admin@msmartaircon.com") {
      throw new Error("Access denied. Only admin can login here.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, customerProfile, isAdmin, loading, loginCustomer, registerCustomer, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
