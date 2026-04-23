import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import AuthModal from "../components/AuthModal";
import { API_BASE, useAuth } from "../context/AuthContext";
import "../styles/global.css";
import "../styles/Contact.css";

const CONTACT_INFO = [
  { icon:"📞", label:"Phone / WhatsApp", value:"0300-1234567", sub:"0321-9876543", href:"tel:03001234567" },
  { icon:"📧", label:"Email",            value:"info@chronostore.pk", sub:"support@chronostore.pk", href:"mailto:info@chronostore.pk" },
  { icon:"📍", label:"Address",          value:"Shop #12, Tech Plaza", sub:"Saddar, Karachi, Pakistan" },
  { icon:"🕐", label:"Working Hours",    value:"Mon – Sat: 10am – 8pm", sub:"Sunday: 12pm – 6pm" },
];

export default function ContactPage() {
  const { showAuth } = useAuth();
  const [form, setForm]       = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSubmitMessage("");
      setSubmitError(false);

      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Failed to send message");
      }

      setSubmitMessage("Message sent successfully.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setSubmitError(true);
      setSubmitMessage(error.message || "Could not send message.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width:"100%", boxSizing:"border-box",
    background:"rgba(255,255,255,0.05)", border:`1px solid ${focused===name?"#4f8ef7":"rgba(255,255,255,0.1)"}`,
    borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none",
    transition:"border-color 0.2s", fontFamily:"inherit",
  });

  return (
    <div style={{ minHeight:"100vh", background:"#08080f" }}>
      <Navbar />

      {/* Header */}
      <section className="contact-hero">
        <div className="contact-hero__bg" />
        <h1 className="contact-hero__title">Contact Us</h1>
        <p className="contact-hero__sub">We're here to help — reach out any time</p>
      </section>

      <div className="contact-container">

        {/* Map */}
        <div className="contact-map-wrap">
          <h2 className="contact-section-title">Find Us</h2>
          <div className="contact-map">
            <iframe
              title="Chrono Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.9!2d67.0099!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSaddar%2C+Karachi!5e0!3m2!1sen!2spk!4v1"
              width="100%" height="100%"
              style={{ border:0, borderRadius:16, filter:"invert(90%) hue-rotate(180deg)" }}
              allowFullScreen="" loading="lazy"
            />
          </div>
          <div className="contact-map-caption">
            <span>📍</span>
            <span>Shop #12, Tech Plaza, Saddar, Karachi — Near Empress Market</span>
          </div>
        </div>

        {/* Info + Form row */}
        <div className="contact-main">

          {/* LEFT — Contact Info */}
          <div className="contact-info-panel">
            <h2 className="contact-section-title">Get In Touch</h2>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:"1.5rem", lineHeight:1.6 }}>
              Have a question, suggestion, or need help with an order? We'd love to hear from you.
            </p>

            <div className="contact-info-list">
              {CONTACT_INFO.map(info=>(
                <div key={info.label} className="contact-info-item">
                  <div className="contact-info-item__icon">{info.icon}</div>
                  <div>
                    <p className="contact-info-item__label">{info.label}</p>
                    {info.href
                      ? <a href={info.href} className="contact-info-item__value">{info.value}</a>
                      : <p className="contact-info-item__value">{info.value}</p>
                    }
                    <p className="contact-info-item__sub">{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div style={{ marginTop:"2rem" }}>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:"1rem" }}>Follow Us</p>
              <div style={{ display:"flex", gap:10 }}>
                {["📘","📸","💬","🐦"].map((icon,i)=>(
                  <div key={i} style={{ width:40, height:40, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18, transition:"background 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(79,142,247,0.15)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="contact-form-wrap">
            <h2 className="contact-section-title">Send Us a Message</h2>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:"1.5rem" }}>We'll reply within 24 hours.</p>

            {submitMessage ? (
              <p style={{
                marginBottom:"1rem",
                color: submitError ? "#ff8e8e" : "#92f2b6",
                fontSize:13,
                fontWeight:600,
              }}>
                {submitMessage}
              </p>
            ) : null}

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, display:"block", marginBottom:6 }}>Full Name *</label>
                    <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)} style={inputStyle("name")} />
                  </div>
                  <div>
                    <label style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, display:"block", marginBottom:6 }}>Email *</label>
                    <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} style={inputStyle("email")} />
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, display:"block", marginBottom:6 }}>Phone</label>
                    <input name="phone" placeholder="0300-0000000" value={form.phone} onChange={handleChange} onFocus={()=>setFocused("phone")} onBlur={()=>setFocused(null)} style={inputStyle("phone")} />
                  </div>
                  <div>
                    <label style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, display:"block", marginBottom:6 }}>Subject *</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required onFocus={()=>setFocused("subject")} onBlur={()=>setFocused(null)} style={{ ...inputStyle("subject"), cursor:"pointer" }}>
                      <option value="">Select a topic</option>
                      <option>Product Inquiry</option>
                      <option>Order Status</option>
                      <option>Return / Exchange</option>
                      <option>Warranty Claim</option>
                      <option>Suggestion</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, display:"block", marginBottom:6 }}>Message *</label>
                  <textarea name="message" placeholder="Write your message here..." value={form.message} onChange={handleChange} required rows={5} onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)} style={{ ...inputStyle("message"), resize:"vertical" }} />
                </div>
                <button type="submit" disabled={loading} style={{ background:"linear-gradient(135deg,#4f8ef7,#6366f1)", color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:15, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.8:1, transition:"opacity 0.2s" }}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
      <Cart />
      {showAuth && <AuthModal />}
    </div>
  );
}
