import React from "react";
import "../styles/App.css";

export default function Loader({ error }) {
  if (error) {
    return (
      <div className="loader">
        <div className="loader__error">
          <p className="loader__error-icon">⚠️</p>
          <p className="loader__error-title">API Error</p>
          <p className="loader__error-msg">{error}</p>
          <p className="loader__error-hint">Check your MockAPI URL or internet connection</p>
        </div>
      </div>
    );
  }
  return (
    <div className="loader">
      <div className="loader__spinner" />
      <p className="loader__text">Loading products...</p>
    </div>
  );
}
