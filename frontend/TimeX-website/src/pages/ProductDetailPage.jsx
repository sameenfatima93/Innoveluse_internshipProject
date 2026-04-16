import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import AuthModal from "../components/AuthModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../hooks/useProducts";
import "../styles/ProductDetail.css";
import "../styles/global.css";

const REVIEWS = [
  { id:1, name:"Ahmed Khan",    initials:"AK", color:"#4f8ef7", rating:5, date:"Dec 2024", text:"Absolutely love this watch! The build quality is outstanding and battery life exceeds expectations. Highly recommended!" },
  { id:2, name:"Sara Ali",      initials:"SA", color:"#10b981", rating:4, date:"Nov 2024", text:"Great value for money. The display is crisp and the health tracking features work accurately. Delivery was fast too!" },
  { id:3, name:"Usman Malik",   initials:"UM", color:"#f59e0b", rating:5, date:"Nov 2024", text:"Best smart watch I have owned. The design is sleek and premium. Works perfectly with my Android phone." },
  { id:4, name:"Fatima Sheikh", initials:"FS", color:"#ef4444", rating:3, date:"Oct 2024", text:"Good watch overall but the strap could be more comfortable. Features are solid and the price is reasonable." },
];

const RATING_BARS = [
  { label:"5 ★", pct:62 }, { label:"4 ★", pct:22 },
  { label:"3 ★", pct:10 }, { label:"2 ★", pct:4 }, { label:"1 ★", pct:2 },
];

function SimilarCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { requireLogin } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => { e.stopPropagation(); addToCart(product); setAdded(true); setTimeout(()=>setAdded(false),1400); };
  const handleBuy = (e) => { e.stopPropagation(); if(requireLogin("/checkout")){ addToCart(product); navigate("/checkout"); } };

  return (
    <div className="sim-card" onClick={() => { navigate(`/product/${product.id}`); window.scrollTo(0,0); }}>
      <div className="sim-card__img" style={{ background:`linear-gradient(135deg,${product.color||"#1a1a2e"},#0d0d2e)` }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle,${product.accent||"#4f8ef7"}25 0%,transparent 70%)` }} />
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", position:"relative", zIndex:1 }} />
          : <span style={{ fontSize:50, position:"relative", zIndex:1 }}>⌚</span>
        }
        {product.badge && <span className={`sim-badge sim-badge--${product.badge}`}>{product.badge==="new"?"NEW":"HOT"}</span>}
      </div>
      <div className="sim-card__body">
        <p className="sim-card__brand">{product.brand}</p>
        <h4 className="sim-card__name">{product.name}</h4>
        <div className="sim-card__rating">
          {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=Math.round(product.rating)?"#fbbf24":"#374151",fontSize:11}}>★</span>)}
          <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginLeft:4}}>{product.rating}</span>
        </div>
        <p className="sim-card__desc">{product.description}</p>
        <p className="sim-card__price">Rs {Number(product.price).toLocaleString()}</p>
        <div className="sim-card__btns">
          <button className="sim-card__buy" onClick={handleBuy}>Buy Now</button>
          <button className={`sim-card__cart ${added?"sim-card__cart--added":""}`} onClick={handleAdd}>{added?"✓":"+ Cart"}</button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { requireLogin, showAuth } = useAuth();
  const { products } = useProducts();
  const [added, setAdded] = useState(false);
  

  const product = products.find(p => p.id === id);
  const similar = products.filter(p => p.id !== id && p.category === product?.category).slice(0,4);

  if (!product) {
    return (
      <div style={{ minHeight:"100vh", background:"#08080f" }}>
        <Navbar />
        <div style={{ textAlign:"center", padding:"5rem", color:"rgba(255,255,255,0.4)" }}>
          <p style={{ fontSize:48 }}>😕</p>
          <p style={{ marginTop:"1rem" }}>Product not found.</p>
          <button onClick={() => navigate("/products")} style={{ marginTop:"1rem", background:"#4f8ef7", color:"#fff", border:"none", borderRadius:20, padding:"10px 24px", cursor:"pointer" }}>Back to Products</button>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.oldPrice > 0 ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  const handleAddToCart = () => { addToCart(product); setAdded(true); setTimeout(()=>setAdded(false),1500); };
  const handleBuyNow = () => { if(requireLogin("/checkout")){ addToCart(product); navigate("/checkout"); } };

  return (
    <div className="detail-page">
      <Navbar />

      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <span onClick={()=>navigate("/")} className="detail-bc-link">Home</span>
        <span className="detail-bc-sep">›</span>
        <span onClick={()=>navigate("/products")} className="detail-bc-link">Products</span>
        <span className="detail-bc-sep">›</span>
        <span className="detail-bc-current">{product.name}</span>
      </div>

      <div className="detail-container">
        <div className="detail-layout">

          {/* LEFT — Image */}
          <div className="detail-image-wrap">
            <div className="detail-image-box" style={{ background:`linear-gradient(135deg,${product.color||"#1a1a2e"} 0%,#0d0d2e 100%)` }}>
              <div className="detail-image-glow" style={{ background:`radial-gradient(circle,${product.accent||"#4f8ef7"}40 0%,transparent 65%)` }} />
              {product.image
                ? <img src={product.image} alt={product.name} className="detail-image-real" />
                : <span className="detail-image-emoji">⌚</span>
              }
              {product.badge && (
                <span className={`detail-image-badge detail-image-badge--${product.badge}`}>
                  {product.badge==="new"?"NEW":"🔥 HOT"}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT — Info */}
          <div className="detail-info">
            <p className="detail-brand">{product.brand}</p>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating-row">
              <div style={{ display:"flex", gap:3 }}>
                {[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=Math.round(product.rating)?"#fbbf24":"#374151", fontSize:18 }}>★</span>)}
              </div>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:14 }}>{product.rating} / 5</span>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>({REVIEWS.length} reviews)</span>
            </div>

            <div className="detail-price-block">
              <span className="detail-price">Rs {Number(product.price).toLocaleString()}</span>
              {product.oldPrice > 0 && <span className="detail-old-price">Rs {Number(product.oldPrice).toLocaleString()}</span>}
              {discount && <span className="detail-discount">Save {discount}%</span>}
            </div>

            <p className="detail-desc">{product.fullDescription || product.description}</p>

            {product.features?.length > 0 && (
              <>
                <p className="detail-features-title">Key Features</p>
                <div className="detail-features">
                  {product.features.map((f,i)=>(
                    <div key={i} className="detail-feature">
                      <span className="detail-feature-dot" style={{ background:product.accent||"#4f8ef7" }} />
                      <span className="detail-feature-text">{f}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="detail-actions">
              <button className="detail-btn-buy" onClick={handleBuyNow}>Buy Now</button>
              <button className={`detail-btn-cart ${added?"detail-btn-cart--added":""}`} onClick={handleAddToCart}>
                {added ? "✓ Added to Cart" : "+ Add to Cart"}
              </button>
            </div>

            {/* Tags */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:"1.5rem" }}>
              {["Free Delivery","100% Original","7-Day Return","Secure Payment"].map(t=>(
                <span key={t} style={{ background:"rgba(79,142,247,0.08)", border:"1px solid rgba(79,142,247,0.2)", color:"rgba(79,142,247,0.8)", fontSize:11, padding:"4px 10px", borderRadius:20 }}>✓ {t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="reviews-title">Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="reviews-big-score">
              <div className="reviews-big-num">{product.rating}</div>
              <div className="reviews-big-stars">
                {[1,2,3,4,5].map(s=><span key={s} className={`reviews-big-star ${s<=Math.round(product.rating)?"reviews-big-star--filled":""}`}>★</span>)}
              </div>
              <div className="reviews-big-count">out of 5</div>
            </div>
            <div className="reviews-bars">
              {RATING_BARS.map(bar=>(
                <div key={bar.label} className="review-bar-row">
                  <span className="review-bar-label">{bar.label}</span>
                  <div className="review-bar-track"><div className="review-bar-fill" style={{ width:`${bar.pct}%` }} /></div>
                  <span className="review-bar-pct">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reviews-list">
            {REVIEWS.map(review=>(
              <div key={review.id} className="review-card">
                <div className="review-card__top">
                  <div className="review-card__avatar" style={{ background:`${review.color}22`, color:review.color }}>{review.initials}</div>
                  <div>
                    <div className="review-card__name">{review.name}</div>
                    <div className="review-card__date">{review.date}</div>
                  </div>
                  <div className="review-card__stars">
                    {[1,2,3,4,5].map(s=><span key={s} className={`review-card__star ${s<=review.rating?"review-card__star--filled":""}`}>★</span>)}
                  </div>
                </div>
                <p className="review-card__text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Items */}
        {similar.length > 0 && (
          <div className="similar-section">
            <h2 className="similar-title">Similar Items</h2>
            <p className="similar-sub">You might also like these</p>
            <div className="similar-grid">
              {similar.map(p=><SimilarCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <Cart />
      {showAuth && <AuthModal />}
    </div>
  );
}
