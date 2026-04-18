import { useEffect, useState } from "react";
import { API_BASE } from "../context/AuthContext";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProducts(isInitial = false) {
      try {
        if (isInitial) setLoading(true);
        const res = await fetch(`${API_BASE}/products`);
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.message || "Failed to load products");
        if (active) {
          setProducts(payload.data || []);
          setError(null);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active && isInitial) setLoading(false);
      }
    }

    loadProducts(true);
    const timer = setInterval(() => loadProducts(false), 2000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return { products, loading, error };
}
