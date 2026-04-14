import React from "react";
import "../styles/App.css";

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <button className="modal__close" onClick={onClose}>✕</button>

        <div
          className="modal__img"
          style={{ background: `linear-gradient(135deg, ${product.color} 0%, #1a1a2e 100%)` }}
        >
          <div
            className="modal__img-glow"
            style={{ background: `radial-gradient(circle, ${product.accent}50 0%, transparent 70%)` }}
          />
          <span className="modal__emoji">{product.emoji}</span>
        </div>

        <div className="modal__body">
          <div className="modal__top-row">
            <span className="modal__brand">{product.brand}</span>
            <span className="modal__rating">★ {product.rating} ({product.reviews} reviews)</span>
          </div>

          <h2 className="modal__name">{product.name}</h2>
          <p className="modal__desc">{product.description}</p>

          <div className="modal__features">
            {product.features.map((f) => (
              <div key={f} className="modal__feature">
                <span className="modal__feature-dot" style={{ background: product.accent }} />
                <span className="modal__feature-text">{f}</span>
              </div>
            ))}
          </div>

          <div className="modal__price-row">
            <div>
              {product.oldPrice && (
                <div className="modal__old-price">Rs {product.oldPrice.toLocaleString()}</div>
              )}
              <div className="modal__price">Rs {product.price.toLocaleString()}</div>
              {discount && (
                <div className="modal__saving">
                  {discount}% off — Rs {(product.oldPrice - product.price).toLocaleString()} bachate ho
                </div>
              )}
            </div>

            <button
              className="modal__add-btn"
              style={{ background: product.accent }}
              onClick={() => { onAddToCart(product); onClose(); }}
            >
              Cart mein dalo 🛒
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
