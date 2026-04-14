import React, { useState, useEffect, useCallback } from "react";
import "../styles/Hero.css";
import logo from "../assets/logo.png";

const SLIDES = [
  {
    id: 1,
    tag: "New Collection 2025",
    title: "Luxury on Your",
    accent: "Wrist.",
    sub: "Pakistan's #1 smart watch store. From fitness to luxury — the perfect watch for every budget.",
    bg: "radial-gradient(ellipse 70% 70% at 80% 50%, rgba(79,142,247,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 10% 80%, rgba(99,102,241,0.12) 0%, transparent 60%)",
    accentColor: "#4f8ef7",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    id: 2,
    tag: "Men's Collection",
    title: "Built for the",
    accent: "Modern Man.",
    sub: "Engineered precision meets timeless style. Discover watches that match your ambition.",
    bg: "radial-gradient(ellipse 70% 70% at 80% 50%, rgba(16,185,129,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 10% 80%, rgba(5,150,105,0.12) 0%, transparent 60%)",
    accentColor: "#10b981",
    image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&q=80",
  },
  {
    id: 3,
    tag: "Women's Collection",
    title: "Elegance",
    accent: "Redefined.",
    sub: "Where fashion meets technology. Stunning designs crafted for the modern woman.",
    bg: "radial-gradient(ellipse 70% 70% at 80% 50%, rgba(236,72,153,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 10% 80%, rgba(168,85,247,0.12) 0%, transparent 60%)",
    accentColor: "#ec4899",
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80",
  },
  {
    id: 4,
    tag: "Adventure Series",
    title: "Push Beyond",
    accent: "Every Limit.",
    sub: "Military-grade toughness meets advanced GPS. Your adventure starts on your wrist.",
    bg: "radial-gradient(ellipse 70% 70% at 80% 50%, rgba(249,115,22,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 10% 80%, rgba(234,88,12,0.12) 0%, transparent 60%)",
    accentColor: "#f97316",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
  },
];

export default function Hero({ onShopNow }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = SLIDES[current];

  return (
    <section className="hero" style={{ background: "#08080f" }}>
      {/* Animated Background */}
      <div className="hero__bg" style={{ background: slide.bg, transition: "background 0.8s ease" }} />

      {/* Floating particles */}
      <div className="hero__particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="hero__particle" style={{ "--delay": `${i * 0.7}s`, "--x": `${10 + i * 12}%`, "--size": `${4 + (i % 3) * 3}px`, "--color": slide.accentColor }} />
        ))}
      </div>

      {/* Content */}
      <div className={`hero__content ${animating ? "hero__content--exit" : "hero__content--enter"}`}>
        <div style={{ marginBottom:"1rem" }}>
          <img src={logo} alt="TimeX" style={{ height:36, width:"auto", objectFit:"contain", mixBlendMode:"lighten", filter:"brightness(1.15)", opacity:0.9 }} />
        </div>
        <div className="hero__eyebrow" style={{ color: slide.accentColor, background: `${slide.accentColor}18`, borderColor: `${slide.accentColor}30` }}>
          {slide.tag}
        </div>
        <h1 className="hero__title">
          {slide.title}<br />
          <span className="hero__title-accent" style={{ color: slide.accentColor }}>{slide.accent}</span>
        </h1>
        <p className="hero__subtitle">{slide.sub}</p>

        <div className="hero__actions">
          <button className="hero__btn" style={{ background: slide.accentColor, boxShadow: `0 8px 32px ${slide.accentColor}50` }} onClick={onShopNow}>
            Shop Now →
          </button>
          <div className="hero__stats">
            <div className="hero__stat"><span className="hero__stat-num">50+</span><span className="hero__stat-label">Models</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span className="hero__stat-num">4.8★</span><span className="hero__stat-label">Rating</span></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span className="hero__stat-num">10k+</span><span className="hero__stat-label">Orders</span></div>
          </div>
        </div>
      </div>

      {/* Watch Image */}
      <div className={`hero__watch ${animating ? "hero__watch--exit" : "hero__watch--enter"}`}>
        <div className="hero__watch-glow" style={{ background: `radial-gradient(circle, ${slide.accentColor}40 0%, transparent 70%)` }} />
        <div className="hero__watch-frame">
          <img src={slide.image} alt="Smart Watch" className="hero__watch-img" />
        </div>
        <div className="hero__ring hero__ring--1" style={{ borderColor: `${slide.accentColor}30` }} />
        <div className="hero__ring hero__ring--2" style={{ borderColor: `${slide.accentColor}15` }} />
      </div>

      {/* Slide Dots */}
      <div className="hero__dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero__dot ${i === current ? "hero__dot--active" : ""}`}
            style={{ background: i === current ? slide.accentColor : "rgba(255,255,255,0.2)" }}
            onClick={() => goTo(i)} />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="hero__progress">
        <div className="hero__progress-bar" style={{ background: slide.accentColor, animationDuration: "5s", animationName: "progress" }} key={current} />
      </div>
    </section>
  );
}
