import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const { user, logout, setShowAuth } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo" style={{ textDecoration: "none" }}>
        <img src={logo} alt="TimeX" className="navbar__logo-img" />
      </Link>

      <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
        <Link to="/"         className={`navbar__link ${isActive("/")         ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/products" className={`navbar__link ${isActive("/products") ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>Products</Link>
        <Link to="/about"    className={`navbar__link ${isActive("/about")    ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/contact"  className={`navbar__link ${isActive("/contact")  ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link to="/login"    className={`navbar__link ${isActive("/login")    ? "navbar__link--active" : ""}`} onClick={() => setMenuOpen(false)}>Login</Link>
      </div>

      <div className="navbar__actions">
        {/* Cart Icon */}
        <button className="navbar__icon-btn" onClick={() => setCartOpen(true)} title="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
        </button>

        {/* Person Icon */}
        {user ? (
          <div className="navbar__user-menu">
            <button className="navbar__icon-btn navbar__icon-btn--active" title={user.name}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <div className="navbar__dropdown">
              <p className="navbar__dropdown-name">Hi, {user.name}!</p>
              <button className="navbar__dropdown-logout" onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <button className="navbar__icon-btn" onClick={() => setShowAuth(true)} title="Login / Sign Up">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        )}

        <button className="navbar__burger" onClick={() => setMenuOpen(m => !m)}>☰</button>
      </div>
    </nav>
  );
}
