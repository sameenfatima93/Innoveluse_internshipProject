import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";
// import logo from "../assets/logo.png";

export default function Cart() {
  const { cartItems, cartTotal, cartOpen, setCartOpen, removeFromCart, updateQty } = useCart();
  const { requireLogin } = useAuth();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false);
    if (requireLogin("/checkout")) navigate("/checkout");
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart__header">
          <h2 className="cart__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Your Cart
          </h2>
          <button className="cart__close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart__empty">
            <div className="cart__empty-icon">⌚</div>
            <p className="cart__empty-text">Your cart is empty!</p>
            <button className="cart__shop-btn" onClick={() => setCartOpen(false)}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart__items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart__item">
                  <div className="cart__item-img" style={{ background: `linear-gradient(135deg, ${item.color || "#1a1a2e"}, #0d0d2e)` }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} />
                      : <span style={{ fontSize:24 }}>⌚</span>
                    }
                  </div>
                  <div className="cart__item-info">
                    <p className="cart__item-name">{item.name}</p>
                    <p className="cart__item-brand">{item.brand}</p>
                    <p className="cart__item-price">Rs {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                  <div className="cart__item-right">
                    <div className="cart__qty-ctrl">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <button className="cart__item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart__footer">
              <div className="cart__total-row">
                <span className="cart__total-label">Total</span>
                <span className="cart__total-amount">Rs {cartTotal.toLocaleString()}</span>
              </div>
              <p className="cart__free-delivery">🚚 Free delivery on orders above Rs 5,000</p>
              <button className="cart__checkout-btn" onClick={handleCheckout}>
                Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
