"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: "0 16px",
      textAlign: "center",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, marginBottom: 24,
      }}>
        ⚠️
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>Something went wrong</h1>
      <p style={{ color: "#888", fontSize: 14, maxWidth: 320, margin: "0 0 32px", lineHeight: 1.6 }}>
        An unexpected error occurred. You can try again or go back to the home page.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 24px", background: "#00B4D8", color: "#000",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Try again
        </button>
        <a href="/" style={{
          padding: "10px 24px", background: "transparent", color: "#888",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
          fontSize: 14, fontWeight: 500, textDecoration: "none",
          display: "inline-flex", alignItems: "center",
        }}>
          ← Home
        </a>
      </div>

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
