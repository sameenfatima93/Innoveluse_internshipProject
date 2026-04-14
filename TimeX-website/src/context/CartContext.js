import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen,  setCartOpen]  = useState(false);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
