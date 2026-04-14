import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { products } from "../data/products";
import "../styles/global.css";
import "../styles/About.css";

const TEAM = [
  { name:"Ali Hassan",     role:"Project Lead",         initials:"AH", color:"#4f8ef7", bio:"Leads the overall project vision and ensures seamless coordination between all team members." },
  { name:"Sara Khan",      role:"Frontend Developer",   initials:"SK", color:"#10b981", bio:"Responsible for building the UI components and ensuring a premium user experience across all pages." },
  { name:"Usman Tariq",    role:"UI/UX Designer",       initials:"UT", color:"#f59e0b", bio:"Crafts the visual design language and user flows that make TimeX intuitive and beautiful." },
  { name:"Fatima Sheikh",  role:"Backend Developer",    initials:"FS", color:"#ec4899", bio:"Handles data management, API integration, and ensures smooth performance of the platform." },
  { name:"Bilal Ahmed",    role:"QA & Testing",         initials:"BA", color:"#8b5cf6", bio:"Ensures every feature works flawlessly by rigorously testing all aspects of the application." },
];

const FAQS = [
  { q:"Are all products 100% original?", a:"Yes, absolutely. We source all our watches directly from authorized distributors and brand partners. Every product comes with an official warranty card and brand packaging." },
  { q:"How long does delivery take?", a:"Delivery within Karachi takes 1-2 business days. For other cities across Pakistan, delivery takes 3-5 business days. We use TCS, Leopards, and Daewoo Express for reliable shipping." },
  { q:"What is your return policy?", a:"We offer a 7-day hassle-free return policy. If you're not satisfied with your purchase for any reason, contact us and we'll arrange a pickup and full refund or exchange." },
  { q:"Do you offer warranty on products?", a:"Yes! All products come with the manufacturer's official warranty ranging from 1 to 2 years depending on the brand. We also assist with warranty claims." },
  { q:"Can I pay Cash on Delivery?", a:"Yes, we offer Cash on Delivery (COD) across all major cities in Pakistan. We also accept JazzCash, EasyPaisa, and bank transfers." },
  { q:"Do you ship outside Pakistan?", a:"Currently we only ship within Pakistan. We are working on expanding internationally — stay tuned for updates on our social media." },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const { showAuth } = useAuth();

  return (
    <div style={{ minHeight:"100vh", background:"#08080f" }}>
      <Navbar />

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__bg" />
        <div className="about-hero__content">
          <p className="about-hero__eyebrow">Our Story</p>
          <h1 className="about-hero__title">Pakistan's Most Trusted<br /><span style={{ color:"#4f8ef7" }}>Smart Watch Store</span></h1>
          <p className="about-hero__sub">Founded in 2021 in Karachi, TimeX was built on one simple belief — every Pakistani deserves access to premium smart watches at fair prices.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {[
          { num:"10,000+", label:"Happy Customers" },
          { num:"50+",     label:"Watch Models" },
          { num:"3+",      label:"Years in Business" },
          { num:"4.8★",   label:"Average Rating" },
        ].map(s=>(
          <div key={s.label} className="about-stat">
            <div className="about-stat__num">{s.num}</div>
            <div className="about-stat__label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Story */}
      <section className="about-story">
        <div className="about-story__img">
          <div className="about-story__img-bg" />
          <img
            src={products[0]?.image}
            alt="Featured smartwatch"
            className="about-story__image"
            loading="lazy"
          />
        </div>
        <div className="about-story__text">
          <p className="about-story__label">Who We Are</p>
          <h2 className="about-story__title">Built With Passion,<br />Driven by Quality</h2>
          <p className="about-story__body">TimeX started as an internship project by a passionate team of 5 students who wanted to build something real — a premium e-commerce platform for smart watches in Pakistan. What began as a college project grew into a fully functional digital store.</p>
          <p className="about-story__body" style={{ marginTop:"1rem" }}>Today, TimeX showcases products from top brands like Samsung, Apple, Garmin, Fitbit, and more — delivering a world-class shopping experience built entirely by our team.</p>
          <Link to="/products" className="about-story__btn">Explore Our Products →</Link>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-team__header">
          <h2 className="about-team__title">Meet The Team</h2>
          <p className="about-team__sub">The 5 people who built TimeX from scratch</p>
        </div>
        <div className="about-team__grid">
          {TEAM.map(m=>(
            <div key={m.name} className="team-card">
              <div className="team-card__avatar" style={{ background:`${m.color}22`, color:m.color, border:`2px solid ${m.color}40` }}>{m.initials}</div>
              <h3 className="team-card__name">{m.name}</h3>
              <p className="team-card__role" style={{ color:m.color }}>{m.role}</p>
              <p className="team-card__bio">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values__inner">
          <h2 className="about-values__title">Our Values</h2>
          <div className="about-values__grid">
            {[
              { icon:"✅", title:"Authenticity",  desc:"We only sell 100% original products. No fakes, no replicas, ever." },
              { icon:"💰", title:"Fair Pricing",  desc:"We believe premium doesn't have to mean unaffordable." },
              { icon:"🤝", title:"Trust",         desc:"Building lasting relationships with our customers is our #1 priority." },
              { icon:"⚡", title:"Fast Delivery", desc:"We know you're excited. That's why we ship the same day when possible." },
            ].map(v=>(
              <div key={v.title} className="value-card">
                <div className="value-card__icon">{v.icon}</div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-faq">
        <div className="about-faq__inner">
          <h2 className="about-faq__title">Frequently Asked Questions</h2>
          <p className="about-faq__sub">Everything you need to know about TimeX</p>
          <div className="faq-list">
            {FAQS.map((faq,i)=>(
              <div key={i} className={`faq-item ${openFaq===i?"faq-item--open":""}`}>
                <button className="faq-question" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span>{faq.q}</span>
                  <span className="faq-arrow">{openFaq===i?"−":"+"}</span>
                </button>
                {openFaq===i && <div className="faq-answer">{faq.a}</div>}
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
