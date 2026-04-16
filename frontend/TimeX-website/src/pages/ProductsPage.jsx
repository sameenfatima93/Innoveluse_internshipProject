import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import AuthModal from "../components/AuthModal";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../hooks/useProducts";
import "../styles/global.css";
import "../styles/ProductsPage.css";

const CATEGORIES = [
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

  const discount = product.oldPrice > 0
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

  return (
    <div className="full-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="full-card__img" style={{ background:`linear-gradient(135deg, ${product.color||"#1a1a2e"} 0%, #0d0d2e 100%)` }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle, ${product.accent||"#4f8ef7"}30 0%, transparent 70%)` }} />
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", position:"relative", zIndex:1 }} />
          : <span className="full-card__emoji">⌚</span>
        }
        {product.badge && <span className={`full-card__badge full-card__badge--${product.badge}`}>{product.badge==="new"?"NEW":"🔥 HOT"}</span>}
        {discount && <span className="full-card__discount">-{discount}%</span>}
      </div>

      <div className="full-card__body">
        <div className="full-card__top">
          <span className="full-card__brand">{product.brand}</span>
          <div className="full-card__rating">
            {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=Math.round(product.rating)?"#fbbf24":"#374151",fontSize:11}}>★</span>)}
            <span className="full-card__rating-num">{product.rating}</span>
          </div>
        </div>
        <h3 className="full-card__name">{product.name}</h3>
        <p className="full-card__desc">{product.description}</p>
        <div className="full-card__features">
          {product.features.slice(0,3).map((f,i)=><span key={i} className="full-card__feat">{f}</span>)}
        </div>
        <div className="full-card__price-row">
          {product.oldPrice>0 && <span className="full-card__old-price">Rs {Number(product.oldPrice).toLocaleString()}</span>}
          <span className="full-card__price">Rs {Number(product.price).toLocaleString()}</span>
        </div>
        <div className="full-card__btns">
          <button className="full-card__buy" onClick={handleBuy}>Buy Now</button>
          <button className={`full-card__cart ${added?"full-card__cart--added":""}`} onClick={handleAdd}>
            {added ? "✓ Added" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { showAuth } = useAuth();
  const { products } = useProducts();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [sortBy,       setSortBy]       = useState("default");

  const filtered = products
    .filter(p => {
      const matchCat = activeFilter === "all" || p.category === activeFilter;
      const matchQ   = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQ;
    })
    .sort((a,b) => {
      if (sortBy==="price-asc")  return a.price - b.price;
      if (sortBy==="price-desc") return b.price - a.price;
      if (sortBy==="rating")     return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="products-page">
      <Navbar />

      <div className="products-hero">
        <h1 className="products-hero__title">All Products</h1>
        <p className="products-hero__sub">Discover our complete collection of premium smart watches</p>
      </div>

      <div className="products-controls">
        <div className="search-box">
          <span className="search-box__icon">🔍</span>
          <input className="search-box__input" placeholder="Search watches..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
        </div>
        <div className="filter-group">
          {CATEGORIES.map(c=>(
            <button key={c.id} className={`filter-btn ${activeFilter===c.id?"filter-btn--active":""}`} onClick={()=>setActiveFilter(c.id)}>{c.label}</button>
          ))}
        </div>
        <select className="sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Best Rating</option>
        </select>
      </div>

      <div className="products-main">
        <p className="products-count">{filtered.length} product{filtered.length!==1?"s":""} found</p>
        <div className="products-grid-full">
          {filtered.length === 0
            ? <p style={{color:"rgba(255,255,255,0.3)",gridColumn:"1/-1",textAlign:"center",padding:"3rem"}}>No products found 😕</p>
            : filtered.map(p=><ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>

      <Footer />
      <Cart />
      {showAuth && <AuthModal />}
    </div>
  );
}
