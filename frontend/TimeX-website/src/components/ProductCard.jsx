import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    navigate("/checkout");
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const discount = product.oldPrice && product.oldPrice > 0
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="card" onClick={handleCardClick}>

      {/* Image */}
      <div
        className="card__img"
        style={{ background: `linear-gradient(135deg, ${product.color || "#1a1a2e"} 0%, #1a1a2e 100%)` }}
      >
        <div
          className="card__img-glow"
          style={{ background: `radial-gradient(circle, ${product.accent || "#4f8ef7"}40 0%, transparent 70%)` }}
        />

        {/* Real image if available, otherwise emoji */}
        {product.image ? (
          <img src={product.image} alt={product.name} className="card__real-img" />
        ) : (
          <span className="card__emoji">⌚</span>
        )}

        {product.badge && product.badge !== "" && (
          <span className={`card__badge card__badge--${product.badge}`}>
            {product.badge === "new" ? "NEW" : "🔥 HOT"}
          </span>
        )}
        {discount && (
          <span className="card__discount">-{discount}%</span>
        )}
      </div>

      {/* Body */}
      <div className="card__body">
        <div className="card__brand-row">
          <span className="card__brand">{product.brand}</span>
          <span className="card__rating">★ {product.rating}</span>
        </div>

        <h3 className="card__name">{product.name}</h3>

        <div className="card__features">
          {Array.isArray(product.features) && product.features.slice(0, 3).map((f, i) => (
            <span key={i} className="card__feature-tag">{f}</span>
          ))}
        </div>

        <div className="card__price-block">
          {product.oldPrice > 0 && (
            <span className="card__old-price">Rs {Number(product.oldPrice).toLocaleString()}</span>
          )}
          <span className="card__price">Rs {Number(product.price).toLocaleString()}</span>
        </div>

        {/* TWO BUTTONS */}
        <div className="card__btns">
          <button
            className="card__btn-buy"
            onClick={handleBuy}
          >
            Buy Now
          </button>
          <button
            className={`card__btn-cart ${added ? "card__btn-cart--added" : ""}`}
            onClick={handleAdd}
          >
            {added ? "✓ Added" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
