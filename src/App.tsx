import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { OrderList } from './components/OrderList/OrderList';
import { MenuGrid } from './components/MenuGrid/MenuGrid';
import { CartSidebar } from './components/CartSidebar/CartSidebar';
import { usePOS } from './context/POSContext';
import { AdminLayout } from './components/Admin/AdminLayout';
import { ProductModal } from './components/ProductModal/ProductModal';
import { OrderDetailModal } from './components/OrderDetailModal/OrderDetailModal';
import { AppDrawer } from './components/AppDrawer/AppDrawer';
import { LoginPage } from './components/LoginPage/LoginPage';
import type { Product, Order } from './types';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = usePOS();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function POSPage() {
  const { orders, categories, products } = usePOS();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Layout onMenuClick={() => setIsDrawerOpen(true)}>
        <OrderList
          orders={orders}
          onOrderClick={(orderId) => {
            const order = orders.find(o => o.id === orderId);
            if (order) setSelectedOrder(order);
          }}
        />
        <MenuGrid
          categories={categories}
          products={products}
          onProductClick={(product) => setSelectedProduct(product)}
        />
        <CartSidebar />
      </Layout>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <OrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <AppDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <POSPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
