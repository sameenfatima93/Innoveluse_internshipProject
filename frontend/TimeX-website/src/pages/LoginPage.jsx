import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

export default function LoginPage() {
  const { showAuth, setShowAuth } = useAuth();

  useEffect(() => {
    setShowAuth(true);
    return () => setShowAuth(false);
  }, [setShowAuth]);

  return (
    <div style={{ minHeight: "100vh", background: "#070712" }}>
      <Navbar />
      <section
        style={{
          minHeight: "calc(100vh - 180px)",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Sign In To Continue</h1>
          <p style={{ color: "rgba(255,255,255,0.65)" }}>
            Login as user or admin to continue shopping or manage dashboard.
          </p>
        </div>
      </section>
      <Footer />
      {showAuth && <AuthModal />}
    </div>
  );
}
