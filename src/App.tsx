import { useState, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { SplashScreen } from "@/components/SplashScreen";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BottomNav } from "@/components/BottomNav";
import { AdminLayout } from "@/components/AdminLayout";

import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import CategoryPage from "@/pages/CategoryPage";
import SearchPage from "@/pages/SearchPage";
import LoginPage from "@/pages/Login";
import CartPage from "@/pages/Cart";
import OrdersPage from "@/pages/Orders";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminBanners from "@/pages/admin/AdminBanners";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCustomers from "@/pages/admin/AdminCustomers";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user || !isAdmin) return <Redirect to="/admin/login" />;
  return <AdminLayout>{children}</AdminLayout>;
}

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pb-16 sm:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
    </>
  );
}

function AppRoutes() {
  return (
    <Switch>
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <AdminGuard><AdminDashboard /></AdminGuard>
      </Route>
      <Route path="/admin/products">
        <AdminGuard><AdminProducts /></AdminGuard>
      </Route>
      <Route path="/admin/categories">
        <AdminGuard><AdminCategories /></AdminGuard>
      </Route>
      <Route path="/admin/banners">
        <AdminGuard><AdminBanners /></AdminGuard>
      </Route>
      <Route path="/admin/orders">
        <AdminGuard><AdminOrders /></AdminGuard>
      </Route>
      <Route path="/admin/customers">
        <AdminGuard><AdminCustomers /></AdminGuard>
      </Route>

      {/* Customer routes */}
      <Route path="/">
        <CustomerLayout><Home /></CustomerLayout>
      </Route>
      <Route path="/product/:id">
        <CustomerLayout><ProductDetails /></CustomerLayout>
      </Route>
      <Route path="/category/:slug">
        <CustomerLayout><CategoryPage /></CustomerLayout>
      </Route>
      <Route path="/search">
        <CustomerLayout><SearchPage /></CustomerLayout>
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/cart">
        <CustomerLayout><CartPage /></CustomerLayout>
      </Route>
      <Route path="/orders">
        <CustomerLayout><OrdersPage /></CustomerLayout>
      </Route>
      <Route>
        <CustomerLayout><NotFound /></CustomerLayout>
      </Route>
    </Switch>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  return (
    <AuthProvider>
      <CartProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          {showSplash && <SplashScreen onDone={handleSplashDone} />}
          {!showSplash && <AppRoutes />}
        </WouterRouter>
      </CartProvider>
    </AuthProvider>
  );
}
