"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { t, card, INTENTS, HISTORY_KEY } from "@/lib/tokens";

export default function HistoryPage() {
  const [items,  setItems]  = useState([]);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { setItems([]); }
  }, []);

  const handleCopy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement("textarea");
      el.value = text; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    if (confirm("Clear all history?")) {
      localStorage.removeItem(HISTORY_KEY);
      setItems([]);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter', sans-serif" }}>

      <NavBar />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 60px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>History</h1>
            <p style={{ fontSize: 13, color: t.muted, margin: "4px 0 0" }}>
              {items.length} repl{items.length === 1 ? "y" : "ies"} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              style={{ color: t.error, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: t.radiusSm, fontSize: 13, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: t.muted }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📥</div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: t.text, margin: "0 0 8px" }}>No history yet</h2>
            <p style={{ fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>Your generated replies will appear here automatically.</p>
            <a href="/" style={{ color: t.accent, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Generate your first reply →</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* items are stored newest-first — no reverse needed */}
            {items.map((item) => {
              const meta = INTENTS[item.intent] || INTENTS.normal;
              return (
                <div key={item.id} style={card}>
                  {/* Meta row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: t.muted, margin: "0 0 4px" }}>
                        {new Date(item.ts).toLocaleString()}
                      </p>
                      <p style={{ fontSize: 13, color: t.faint, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 460 }}>
                        "{item.message}"
                      </p>
                    </div>
                    <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: meta.dim, color: meta.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  {/* Reply body */}
                  <div style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: t.radiusSm, padding: "10px 14px", fontSize: 14, lineHeight: 1.7, direction: item.language === "Arabic" ? "rtl" : "ltr", textAlign: item.language === "Arabic" ? "right" : "left", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {item.reply}
                  </div>

                  {/* Footer row */}
                  <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: t.faint, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 4, padding: "2px 6px" }}>{item.tone}</span>
                    <span style={{ fontSize: 11, color: t.faint, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 4, padding: "2px 6px" }}>{item.language}</span>
                    <button
                      onClick={() => handleCopy(item.reply, item.id)}
                      style={{ marginLeft: "auto", padding: "5px 12px", background: copied === item.id ? "rgba(74,222,128,0.1)" : t.surface2, color: copied === item.id ? "#4ade80" : t.muted, border: `1px solid ${copied === item.id ? "rgba(74,222,128,0.3)" : t.border}`, borderRadius: t.radiusSm, cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}
                    >
                      {copied === item.id ? <>✓ Copied</> : <>Copy</>}
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
