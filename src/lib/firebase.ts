import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7bfNrgIhz3yps0lMMdRBX1B9fEq6XNJw",
  authDomain: "m-smart-aircon.firebaseapp.com",
  projectId: "m-smart-aircon",
  storageBucket: "m-smart-aircon.firebasestorage.app",
  messagingSenderId: "432811453873",
  appId: "1:432811453873:web:f3597860987ded4a862190",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
