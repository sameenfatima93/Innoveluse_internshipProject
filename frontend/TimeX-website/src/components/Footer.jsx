import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/App.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div style={{ maxWidth: 260 }}>
          <img src={logo} alt="Chrono Store" style={{ height: 120, width: "auto", objectFit: "contain", mixBlendMode: "lighten", filter: "brightness(1.1)", marginBottom: 12 }} />
          <p className="footer__desc">Pakistan's #1 trusted smart watch store. 100% original products, fast delivery across Pakistan.</p>
        </div>
        <div className="footer__links">
          <p className="footer__heading">Quick Links</p>
          <Link to="/"         className="footer__link">Home</Link>
          <Link to="/products" className="footer__link">All Products</Link>
          <Link to="/about"    className="footer__link">About Us</Link>
          <Link to="/contact"  className="footer__link">Contact</Link>
        </div>
        <div className="footer__links">
          <p className="footer__heading">Categories</p>
          <Link to="/products" className="footer__link">Men's Watches</Link>
          <Link to="/products" className="footer__link">Women's Watches</Link>
          <Link to="/products" className="footer__link">Wrist Bands</Link>
        </div>
        <div className="footer__links">
          <p className="footer__heading">Contact</p>
          <p className="footer__link">📞 0300-1234567</p>
          <p className="footer__link">📧 info@chronostore.pk</p>
          <p className="footer__link">📍 Saddar, Karachi</p>
          <p className="footer__link">🕐 Mon–Sat: 10am–8pm</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2025 Chrono Store. All rights reserved. | Made with ❤️ in Pakistan</p>
      </div>
    </footer>
  );
}
