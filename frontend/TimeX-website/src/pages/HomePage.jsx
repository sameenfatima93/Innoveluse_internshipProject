import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { bestSellers } from "../data/products";
import "../styles/global.css";
import "../styles/App.css";
import "../styles/HomePage.css";

const TESTIMONIALS = [
  { id:1, name:"Ahmed Raza",    city:"Karachi",    initials:"AR", color:"#4f8ef7", rating:5, text:"Absolutely love my Galaxy Watch! Delivery was super fast and packaging was excellent. Will definitely buy again from TimeX." },
  { id:2, name:"Sara Malik",    city:"Lahore",     initials:"SM", color:"#10b981", rating:5, text:"Best smart watch store in Pakistan. Got my Apple Watch in 2 days. The quality is 100% original and the price was very reasonable." },
  { id:3, name:"Usman Tariq",   city:"Islamabad",  initials:"UT", color:"#f59e0b", rating:4, text:"Great experience overall. The Garmin Fenix I ordered is exactly as described. Customer service was also very helpful." },
  { id:4, name:"Fatima Sheikh", city:"Faisalabad", initials:"FS", color:"#ef4444", rating:5, text:"I was skeptical at first but TimeX exceeded my expectations. The Fitbit Sense 2 looks and works perfectly. Highly recommended!" },
  { id:5, name:"Bilal Khan",    city:"Rawalpindi", initials:"BK", color:"#8b5cf6", rating:5, text:"Amazing deals! Got 20% off on my Xiaomi Watch. The build quality is premium and battery life is incredible. 10/10 would recommend." },
  { id:6, name:"Zara Ahmed",    city:"Multan",     initials:"ZA", color:"#ec4899", rating:4, text:"Very satisfied with my purchase. The watch came with all accessories and the strap quality is superb. Fast delivery too!" },
];

const FEATURES = [
  { icon:"🚚", title:"Free Delivery",   desc:"Free shipping on all orders above Rs 5,000" },
  { icon:"✅", title:"100% Original",   desc:"All products are genuine & brand authorized" },
  { icon:"🔄", title:"Easy Returns",    desc:"7-day hassle-free return & exchange policy" },
  { icon:"🛡️", title:"Secure Payment", desc:"Your payment info is always safe with us" },
];

const CATS = [
  { id:"all",    label:"All" },
  { id:"mens",   label:"Men's" },
  { id:"womens", label:"Women's" },
  { id:"wrist",  label:"Wrist" },
];

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { requireLogin } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (requireLogin("/checkout")) {
      addToCart(product);
      navigate("/checkout");
    }
  };

  const discount = product.oldPrice > 0 ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  return (
    <div className="pcard" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="pcard__img" style={{ background:`linear-gradient(135deg, ${product.color||"#1a1a2e"} 0%, #0d0d2e 100%)` }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle, ${product.accent||"#4f8ef7"}30 0%, transparent 70%)` }} />
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", position:"relative", zIndex:1 }} />
          : <span style={{ fontSize:70, position:"relative", zIndex:1 }}>⌚</span>
        }
        {product.badge && <span className={`pcard__badge pcard__badge--${product.badge}`}>{product.badge==="new"?"NEW":"🔥 HOT"}</span>}
        {discount && <span className="pcard__discount">-{discount}%</span>}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{product.name}</h3>
        <div className="pcard__rating">
          {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=Math.round(product.rating)?"#fbbf24":"#374151",fontSize:12}}>★</span>)}
          <span className="pcard__rating-num">{product.rating}</span>
        </div>
        <p className="pcard__desc">{product.description}</p>
        <div className="pcard__price-row">
          {product.oldPrice>0 && <span className="pcard__old-price">Rs {Number(product.oldPrice).toLocaleString()}</span>}
          <span className="pcard__price">Rs {Number(product.price).toLocaleString()}</span>
        </div>
        <div className="pcard__btns">
          <button className="pcard__buy" onClick={handleBuy}>Buy Now</button>
          <button className={`pcard__cart ${added?"pcard__cart--added":""}`} onClick={handleAdd}>{added?"✓ Added":"+ Cart"}</button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const { showAuth } = useAuth();

  const filtered = activeTab === "all" ? bestSellers : bestSellers.filter(p => p.category === activeTab);

  return (
    <div>
      <Navbar />
      <Hero onShopNow={() => document.getElementById("most-selling")?.scrollIntoView({ behavior:"smooth" })} />

      {/* ── Most Selling Products ── */}
      <section id="most-selling" className="ms-section">
        <div className="ms-header">
          <div>
            <p className="ms-label">🔥 Top Picks</p>
            <h2 className="ms-title">Most Selling Products</h2>
            <p className="ms-sub">Our customers' favourite watches — trusted by thousands across Pakistan</p>
          </div>
          <Link to="/products" className="ms-see-all">See All Products →</Link>
        </div>

        {/* Category Tabs */}
        <div className="ms-tabs">
          {CATS.map(c => (
            <button key={c.id} className={`ms-tab ${activeTab===c.id?"ms-tab--active":""}`} onClick={() => setActiveTab(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="ms-grid">
          {filtered.length === 0
            ? <p style={{color:"rgba(255,255,255,0.3)",gridColumn:"1/-1",textAlign:"center",padding:"3rem"}}>No best sellers in this category yet.</p>
            : filtered.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-box">
              <div className="feature-box__icon">{f.icon}</div>
              <p className="feature-box__title">{f.title}</p>
              <p className="feature-box__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background:"#08080f" }}>
        <div className="testimonials">
          <div className="testimonials__header">
            <h2 className="testimonials__title">What Our Customers Say</h2>
            <p className="testimonials__sub">Trusted by thousands of happy customers across Pakistan</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-card__quote">"</div>
                <p className="testimonial-card__text">{t.text}</p>
                <div className="testimonial-card__stars">
                  {[1,2,3,4,5].map(s=><span key={s} className="testimonial-card__star">★</span>)}
                </div>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar" style={{background:`${t.color}22`,color:t.color}}>{t.initials}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__city">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Cart />
      {showAuth && <AuthModal />}
    </div>
  );
}
