import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsOfService from './pages/policies/TermsOfService';
import ShippingPolicy from './pages/policies/ShippingPolicy';
import ReturnPolicy from './pages/policies/ReturnPolicy';

// Admin imports
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import LogoSettings from './pages/admin/LogoSettings';
import Settings from './pages/admin/Settings';
import ProductsManagement from './pages/admin/ProductsManagement';
import ProductForm from './pages/admin/ProductForm';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import Inventory from './pages/admin/Inventory';
import HomepageManager from './pages/admin/HomepageManager';

import { useEffect } from 'react';
import useAuthStore from './store/authStore';

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="return-policy" element={<ReturnPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="logo" element={<LogoSettings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="homepage" element={<HomepageManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
