import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

const STATUS_META = {
  pending: { label: "Pending", color: "#f59e0b", note: "Your order is confirmed and waiting for packing." },
  packed: { label: "Packed", color: "#22c55e", note: "Your items are packed and ready for dispatch." },
  out_for_delivery: { label: "Out For Delivery", color: "#3b82f6", note: "Your order is on the way." },
  delivered: { label: "Delivered", color: "#10b981", note: "Delivered successfully." },
  cancelled: { label: "Cancelled", color: "#ef4444", note: "This order was cancelled." },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || { label: status, color: "#94a3b8" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        padding: "6px 12px",
        background: `${meta.color}22`,
        border: `1px solid ${meta.color}66`,
        color: meta.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color }} />
      {meta.label}
    </span>
  );
}

function ProgressTrack({ status }) {
  const steps = ["pending", "packed", "out_for_delivery", "delivered"];
  const current = steps.indexOf(status);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {steps.map((step, idx) => {
        const active = current >= idx;
        const meta = STATUS_META[step];
        return (
          <div key={step} style={{ padding: "10px 8px", borderRadius: 10, border: `1px solid ${active ? `${meta.color}66` : "rgba(255,255,255,0.08)"}`, background: active ? `${meta.color}1a` : "rgba(255,255,255,0.03)" }}>
            <p style={{ margin: 0, fontSize: 11, color: active ? meta.color : "rgba(255,255,255,0.45)", fontWeight: 700, textAlign: "center" }}>
              {meta.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const { user, setShowAuth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadOrders = async (firstLoad = false) => {
      if (firstLoad) setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001/api/orders?userEmail=${encodeURIComponent(user.email)}`);
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.message || "Unable to load orders");
        if (active) {
          setOrders(payload.data || []);
          setError("");
        }
      } catch (err) {
        if (active) setError(err.message || "Unable to load orders");
      } finally {
        if (active && firstLoad) setLoading(false);
      }
    };

    loadOrders(true);
    const timer = setInterval(() => loadOrders(false), 5000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user?.email]);

  const totals = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        acc.total += Number(o.amount || 0);
        if (o.status === "delivered") acc.delivered += 1;
        if (o.status === "out_for_delivery") acc.outForDelivery += 1;
        if (o.status === "packed") acc.packed += 1;
        if (o.status === "pending") acc.pending += 1;
        return acc;
      },
      { total: 0, delivered: 0, outForDelivery: 0, packed: 0, pending: 0 }
    );
  }, [orders]);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 20% 0%, #16213a 0%, #08080f 45%, #06060b 100%)" }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ color: "#fff", margin: 0, fontSize: "clamp(22px,3vw,32px)", fontFamily: "Georgia, serif" }}>My Orders</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8, marginBottom: 0 }}>Track your order status in real time.</p>
          </div>
          <Link
            to="/products"
            style={{
              color: "#fff",
              textDecoration: "none",
              background: "linear-gradient(135deg,#4f8ef7,#6366f1)",
              padding: "10px 14px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Continue Shopping
          </Link>
        </div>

        {!user ? (
          <section style={{ background: "#0d0d1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "2rem", textAlign: "center" }}>
            <h3 style={{ color: "#fff", marginTop: 0 }}>Login Required</h3>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>Please login to view your order history.</p>
            <button
              onClick={() => setShowAuth(true)}
              style={{ background: "linear-gradient(135deg,#4f8ef7,#6366f1)", border: "none", color: "#fff", borderRadius: 12, padding: "11px 18px", fontWeight: 700, cursor: "pointer" }}
            >
              Login Now
            </button>
          </section>
        ) : (
          <>
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: "1.25rem" }}>
              {[
                { title: "Total Orders", value: orders.length, color: "#ffffff" },
                { title: "Pending", value: totals.pending, color: "#f59e0b" },
                { title: "Packed", value: totals.packed, color: "#22c55e" },
                { title: "Out For Delivery", value: totals.outForDelivery, color: "#3b82f6" },
                { title: "Delivered", value: totals.delivered, color: "#10b981" },
              ].map((card) => (
                <div key={card.title} style={{ background: "#0d0d1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px" }}>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>{card.title}</p>
                  <p style={{ margin: "8px 0 0", color: card.color, fontSize: 24, fontWeight: 800 }}>{card.value}</p>
                </div>
              ))}
            </section>

            <section style={{ background: "#0d0d1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "1.25rem" }}>
              {loading ? (
                <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>Loading your orders...</p>
              ) : error ? (
                <p style={{ color: "#ef4444", margin: 0 }}>{error}</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0.5rem" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)" }}>No orders found yet.</p>
                  <Link to="/products" style={{ color: "#4f8ef7", textDecoration: "none", fontWeight: 700 }}>Browse Products</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {orders.map((order) => {
                    const meta = STATUS_META[order.status] || { note: "Status updated." };
                    return (
                      <article key={order.id} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 14, background: "rgba(255,255,255,0.02)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                          <div>
                            <p style={{ margin: 0, color: "#4f8ef7", fontWeight: 800, letterSpacing: 0.6 }}>{order.id}</p>
                            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                              {order.date} • {order.items} item(s) • {order.paymentMethod?.toUpperCase() || "COD"}
                            </p>
                          </div>
                          <StatusPill status={order.status} />
                        </div>

                        <ProgressTrack status={order.status} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 10, flexWrap: "wrap" }}>
                          <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{meta.note}</p>
                          <p style={{ margin: 0, color: "#fff", fontWeight: 800 }}>Rs {Number(order.amount || 0).toLocaleString()}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
