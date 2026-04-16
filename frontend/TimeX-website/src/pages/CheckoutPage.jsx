import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

function SuccessPopup({ onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)" }} />
      <div style={{ position:"relative", background:"#0d0d1e", border:"1px solid rgba(79,142,247,0.3)", borderRadius:24, padding:"3rem 2.5rem", width:"min(460px,92vw)", textAlign:"center", zIndex:1, boxShadow:"0 24px 80px rgba(0,0,0,0.6)", animation:"popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
        <div style={{ fontSize:64, marginBottom:"1rem", animation:"bounceIn 0.6s 0.2s both" }}>🎉</div>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(16,185,129,0.15)", border:"2px solid #10b981", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", fontSize:32 }}>✅</div>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 8px", fontFamily:"Georgia,serif" }}>Order Placed!</h2>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:15, margin:"0 0 1.5rem", lineHeight:1.6 }}>
          Your order has been placed successfully!<br />Thank you for shopping with <span style={{ color:"#4f8ef7", fontWeight:700 }}>TimeX</span> 🎁
        </p>
        <div style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:"1.5rem" }}>
          <p style={{ color:"#10b981", fontSize:13, fontWeight:600, margin:0 }}>📦 Your order will be delivered in 2–5 business days</p>
        </div>
        <button onClick={onClose} style={{ background:"linear-gradient(135deg,#4f8ef7,#6366f1)", color:"#fff", border:"none", borderRadius:14, padding:"14px 40px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%" }}>
          Continue Shopping →
        </button>
        <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}} @keyframes bounceIn{from{transform:scale(0)}to{transform:scale(1)}}`}</style>
      </div>
    </div>
  );
}

const inputStyle = {
  width:"100%", boxSizing:"border-box",
  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
  borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none",
  transition:"border-color 0.2s",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name||"", email: user?.email||"", phone:"", address:"", city:"", payment:"cod" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const isCartEmpty = cartItems.length === 0;

  const handleChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCartEmpty) {
      alert("Your cart is empty. Please add at least one product before confirming order.");
      navigate("/products");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          items: cartItems,
          amount: grandTotal,
          shippingAddress: form.address,
          city: form.city,
          phone: form.phone,
          paymentMethod: form.payment,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      setShowSuccess(true);
      clearCart();
    } catch (err) {
      alert(err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => { setShowSuccess(false); navigate("/"); };

  const deliveryFee = cartTotal >= 5000 ? 0 : 200;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div style={{ minHeight:"100vh", background:"#08080f" }}>
      <Navbar />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem" }}>
        <h1 style={{ color:"#fff", fontSize:"clamp(22px,3vw,32px)", fontWeight:800, marginBottom:"2rem", fontFamily:"Georgia,serif" }}>
          Checkout
        </h1>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:"2rem", alignItems:"start" }}>

          {/* LEFT — Form */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

            {/* Contact */}
            <div style={{ background:"#0d0d1e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"1.5rem" }}>
              <h3 style={{ color:"#fff", fontSize:16, fontWeight:700, margin:"0 0 1rem" }}>📋 Contact Information</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[
                  {name:"name",    label:"Full Name *",     placeholder:"Your full name",     type:"text"},
                  {name:"email",   label:"Email Address *", placeholder:"your@email.com",      type:"email"},
                  {name:"phone",   label:"Phone Number *",  placeholder:"0300-0000000",        type:"tel"},
                  {name:"city",    label:"City *",          placeholder:"Karachi",             type:"text"},
                ].map(f=>(
                  <div key={f.name}>
                    <label style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, display:"block", marginBottom:6 }}>{f.label}</label>
                    <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} required
                      onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused(null)}
                      style={{ ...inputStyle, borderColor: focused===f.name?"#4f8ef7":"rgba(255,255,255,0.1)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div style={{ background:"#0d0d1e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"1.5rem" }}>
              <h3 style={{ color:"#fff", fontSize:16, fontWeight:700, margin:"0 0 1rem" }}>📍 Delivery Address</h3>
              <label style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, display:"block", marginBottom:6 }}>Full Address *</label>
              <textarea name="address" placeholder="House #, Street, Area, City" value={form.address} onChange={handleChange} required rows={3}
                onFocus={()=>setFocused("address")} onBlur={()=>setFocused(null)}
                style={{ ...inputStyle, resize:"vertical", borderColor:focused==="address"?"#4f8ef7":"rgba(255,255,255,0.1)" }} />
            </div>

            {/* Payment */}
            <div style={{ background:"#0d0d1e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"1.5rem" }}>
              <h3 style={{ color:"#fff", fontSize:16, fontWeight:700, margin:"0 0 1rem" }}>💳 Payment Method</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { value:"cod",      label:"Cash on Delivery",    icon:"💵", desc:"Pay when your order arrives" },
                  { value:"jazzcash", label:"JazzCash",            icon:"📱", desc:"Pay via JazzCash mobile wallet" },
                  { value:"easypaisa",label:"EasyPaisa",           icon:"💚", desc:"Pay via EasyPaisa mobile wallet" },
                  { value:"card",     label:"Debit / Credit Card", icon:"💳", desc:"Visa, Mastercard, etc." },
                ].map(opt=>(
                  <label key={opt.value} style={{ display:"flex", alignItems:"center", gap:14, background: form.payment===opt.value?"rgba(79,142,247,0.08)":"rgba(255,255,255,0.03)", border:`1px solid ${form.payment===opt.value?"rgba(79,142,247,0.4)":"rgba(255,255,255,0.08)"}`, borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s" }}>
                    <input type="radio" name="payment" value={opt.value} checked={form.payment===opt.value} onChange={handleChange} style={{ accentColor:"#4f8ef7" }} />
                    <span style={{ fontSize:20 }}>{opt.icon}</span>
                    <div>
                      <p style={{ color:"#fff", fontSize:14, fontWeight:600, margin:0 }}>{opt.label}</p>
                      <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, margin:0 }}>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || isCartEmpty} style={{ background:"linear-gradient(135deg,#4f8ef7,#6366f1)", color:"#fff", border:"none", borderRadius:16, padding:"16px", fontSize:16, fontWeight:700, cursor:(loading || isCartEmpty)?"not-allowed":"pointer", opacity:(loading || isCartEmpty)?0.6:1, boxShadow:"0 8px 32px rgba(79,142,247,0.3)", transition:"opacity 0.2s" }}>
              {loading ? "Placing Order..." : isCartEmpty ? "Add Items To Cart First" : "Confirm Order →"}
            </button>
            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:12, margin:0 }}>
              🔒 Your order will be processed securely
            </p>
          </form>

          {/* RIGHT — Order Summary */}
          <div style={{ position:"sticky", top:80 }}>
            <div style={{ background:"#0d0d1e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"1.5rem" }}>
              <h3 style={{ color:"#fff", fontSize:16, fontWeight:700, margin:"0 0 1rem" }}>🛒 Order Summary</h3>

              {cartItems.length === 0 ? (
                <p style={{ color:"rgba(255,255,255,0.3)", fontSize:14, textAlign:"center", padding:"1rem" }}>No items in cart</p>
              ) : (
                <>
                  <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:"1.25rem" }}>
                    {cartItems.map(item=>(
                      <div key={item.id} style={{ display:"flex", gap:12, alignItems:"center" }}>
                        <div style={{ width:52, height:52, borderRadius:10, background:`linear-gradient(135deg,${item.color||"#1a1a2e"},#0d0d2e)`, flexShrink:0, overflow:"hidden" }}>
                          {item.image ? <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:24 }}>⌚</span>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ color:"#fff", fontSize:13, fontWeight:600, margin:"0 0 2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</p>
                          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, margin:0 }}>Qty: {item.qty}</p>
                        </div>
                        <p style={{ color:"#4f8ef7", fontSize:14, fontWeight:700, margin:0, flexShrink:0 }}>Rs {(item.price*item.qty).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"1rem", display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:"rgba(255,255,255,0.5)", fontSize:14 }}>Subtotal</span>
                      <span style={{ color:"#fff", fontSize:14 }}>Rs {cartTotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:"rgba(255,255,255,0.5)", fontSize:14 }}>Delivery</span>
                      <span style={{ color: deliveryFee===0?"#10b981":"#fff", fontSize:14 }}>{deliveryFee===0?"FREE":`Rs ${deliveryFee}`}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:8 }}>
                      <span style={{ color:"#fff", fontSize:16, fontWeight:700 }}>Total</span>
                      <span style={{ color:"#4f8ef7", fontSize:20, fontWeight:900 }}>Rs {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessPopup onClose={handleSuccessClose} />}
    </div>
  );
}
