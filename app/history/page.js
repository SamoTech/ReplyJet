"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const t = {
  bg: "#0d0d0d", surface: "#141414", surface2: "#1a1a1a",
  border: "rgba(255,255,255,0.08)", borderHov: "rgba(255,255,255,0.16)",
  text: "#f0f0f0", muted: "#888", faint: "#444",
  accent: "#00B4D8", accentDim: "rgba(0,180,216,0.12)",
  error: "#ff6b6b", radius: "10px", radiusSm: "6px",
  shadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
};

const INTENTS = {
  angry:  { label: "Angry",  icon: "😤", color: "#f87171", dim: "rgba(248,113,113,0.12)" },
  sales:  { label: "Sales",  icon: "💰", color: "#4ade80", dim: "rgba(74,222,128,0.12)"  },
  normal: { label: "Normal", icon: "💬", color: "#60a5fa", dim: "rgba(96,165,250,0.12)"  },
};

const card = {
  background: t.surface, border: `1px solid ${t.border}`,
  borderRadius: t.radius, padding: "16px 20px",
  boxShadow: t.shadow,
};

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("replyjet_history");
      if (raw) setItems(JSON.parse(raw));
    } catch { setItems([]); }
  }, []);

  const handleCopy = async (text, idx) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement("textarea");
      el.value = text; document.body.appendChild(el);
      el.select(); document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    if (confirm("Clear all history?")) {
      localStorage.removeItem("replyjet_history");
      setItems([]);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, padding: "0 16px 60px", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{
        maxWidth: 720, margin: "0 auto", padding: "32px 0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${t.border}`, marginBottom: 32,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill={t.accentDim}/>
              <rect x="5" y="5" width="16" height="13" rx="3" fill={t.accent}/>
              <polygon points="7,18 4,25 13,18" fill={t.accent}/>
              <polygon points="17,8 13,15 15,15 11,22 19,13 17,13" fill={t.bg}/>
            </svg>
          </Link>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              Reply<span style={{ color: t.accent }}>Jet</span>
            </div>
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>History</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          <Link href="/" style={{ color: t.muted, textDecoration: "none", fontSize: 13, padding: "6px 12px", borderRadius: t.radiusSm, border: `1px solid ${t.border}` }}>← Back</Link>
          {items.length > 0 && (
            <button onClick={handleClear} style={{ color: t.error, background: "rgba(255,107,107,0.08)", border: `1px solid rgba(255,107,107,0.2)`, borderRadius: t.radiusSm, fontSize: 13, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: t.muted }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📥</div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: t.text, margin: "0 0 8px" }}>No history yet</h2>
            <p style={{ fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>Your generated replies will appear here automatically.</p>
            <Link href="/" style={{ color: t.accent, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Generate your first reply →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ color: t.muted, fontSize: 13, margin: "0 0 4px" }}>{items.length} repl{items.length === 1 ? "y" : "ies"} saved</p>
            {[...items].reverse().map((item, idx) => {
              const meta = INTENTS[item.intent] || INTENTS.normal;
              return (
                <div key={idx} style={card}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: t.muted, margin: "0 0 4px" }}>{new Date(item.ts).toLocaleString()}</p>
                      <p style={{ fontSize: 13, color: t.faint, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 460 }}>
                        “{item.message}”
                      </p>
                    </div>
                    <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: meta.dim, color: meta.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  <div style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: t.radiusSm, padding: "10px 14px", fontSize: 14, lineHeight: 1.7, direction: item.language === "Arabic" ? "rtl" : "ltr", textAlign: item.language === "Arabic" ? "right" : "left", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {item.reply}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: t.faint, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 4, padding: "2px 6px" }}>{item.tone}</span>
                    <span style={{ fontSize: 11, color: t.faint, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 4, padding: "2px 6px" }}>{item.language}</span>
                    <button
                      onClick={() => handleCopy(item.reply, idx)}
                      style={{ marginLeft: "auto", padding: "5px 12px", background: copied === idx ? "rgba(74,222,128,0.1)" : t.surface2, color: copied === idx ? "#4ade80" : t.muted, border: `1px solid ${copied === idx ? "rgba(74,222,128,0.3)" : t.border}`, borderRadius: t.radiusSm, cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}
                    >
                      {copied === idx ? <>✓ Copied</> : <>Copy</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
