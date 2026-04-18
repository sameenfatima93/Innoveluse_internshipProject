import React, { useState } from "react";
import { ADMIN_APP_URL, API_BASE, useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AuthModal() {
  const { setShowAuth, login, afterLoginRoute, setAfterLoginRoute } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const close = () => { setShowAuth(false); setAfterLoginRoute(null); };
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const navigateAfterLogin = () => {
    if (!afterLoginRoute?.pathname) {
      return;
    }
    navigate(afterLoginRoute.pathname, { state: afterLoginRoute.state });
    setAfterLoginRoute(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOrId = form.email.trim();
    const password = form.password.trim();

    if (!emailOrId || !password) { setError("Please fill all fields."); return; }
    if (tab === "signup" && !form.name) { setError("Please enter your name."); return; }

    // Admin login is validated by backend and returns a session token.
    if (tab === "login" && !emailOrId.includes("@")) {
      try {
        const adminRes = await fetch(`${API_BASE}/auth/admin-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: emailOrId, password }),
        });
        const adminPayload = await adminRes.json();
        if (!adminRes.ok) {
          setError(adminPayload.message || "Invalid admin credentials");
          return;
        }

        localStorage.removeItem("timex_user");
        setShowAuth(false);

        const redirectUrl = new URL(ADMIN_APP_URL);
        redirectUrl.searchParams.set("adminToken", adminPayload.data.token);
        window.location.href = redirectUrl.toString();
      } catch {
        setError("Unable to login. Please try again.");
      }
      return;
    }

    if (tab === "signup") {
      if (form.email.toLowerCase() === "admin123") {
        setError("This ID is reserved for admin.");
        return;
      }

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: emailOrId,
          password,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.message || "Signup failed");
        return;
      }

      login(payload.data);
      navigateAfterLogin();
      setShowAuth(false);
      return;
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailOrId, password }),
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.message || "Invalid credentials");
      return;
    }

    login(payload.data);
    navigateAfterLogin();
    setShowAuth(false);
  };

  const handleGuest = () => {
    login({ name: "Guest", email: "guest@chronostore.pk" });
    navigateAfterLogin();
    setShowAuth(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)" }} onClick={close} />
      <div style={{ position:"relative", background:"#0d0d1e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:24, padding:"2.5rem 2rem", width:"min(420px,92vw)", boxShadow:"0 24px 80px rgba(0,0,0,0.6)", zIndex:1 }}>

        <button onClick={close} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:14 }}>✕</button>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
          <img src={logo} alt="TimeX" style={{ height:52, width:"auto", objectFit:"contain", mixBlendMode:"lighten", filter:"brightness(1.1)" }} />
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginTop:8 }}>
            {tab === "signup" ? "Create your account" : "Welcome back"}
          </p>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:12, marginTop:6, marginBottom:0 }}>
            Admin login: enter Admin ID and password
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.05)", borderRadius:12, padding:4, marginBottom:"1.5rem" }}>
          {["login","signup"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }}
              style={{ flex:1, padding:"8px 0", background:tab===t?"#4f8ef7":"transparent", color:tab===t?"#fff":"rgba(255,255,255,0.5)", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.2s", textTransform:"capitalize" }}>
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {tab === "signup" && (
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box" }} />
          )}
          <input name="email" type="text" placeholder={tab === "login" ? "Email or Admin ID" : "Email Address"} value={form.email} onChange={handleChange}
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box" }} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box" }} />

          {error && <p style={{ color:"#ef4444", fontSize:12, margin:0 }}>{error}</p>}

          <button type="submit"
            style={{ background:"linear-gradient(135deg,#4f8ef7,#6366f1)", color:"#fff", border:"none", borderRadius:12, padding:"13px", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:4 }}>
            {tab === "login" ? "Login →" : "Create Account →"}
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"4px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
            <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>or</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
          </div>

          <button type="button" onClick={handleGuest}
            style={{ background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"11px", fontSize:14, fontWeight:500, cursor:"pointer" }}>
            Continue as Guest
          </button>
        </form>
      </div>
    </div>
  );
}
