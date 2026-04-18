import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import HomePage          from "./pages/HomePage";
import ProductsPage      from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage         from "./pages/AboutPage";
import ContactPage       from "./pages/ContactPage";
import CheckoutPage      from "./pages/CheckoutPage";
import LoginPage         from "./pages/LoginPage";
import OrdersPage        from "./pages/OrdersPage";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/products"    element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about"       element={<AboutPage />} />
            <Route path="/contact"     element={<ContactPage />} />
            <Route path="/checkout"    element={<CheckoutPage />} />
            <Route path="/orders"      element={<OrdersPage />} />
            <Route path="/login"       element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
