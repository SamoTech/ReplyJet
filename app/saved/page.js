"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { t, card, INTENTS, SAVED_KEY } from "@/lib/tokens";

export default function SavedPage() {
  const [items,        setItems]        = useState([]);
  const [copied,       setCopied]       = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
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

  const handleRemove = (id) => {
    const next = items.filter((e) => e.id !== id);
    setItems(next);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch { /* silent */ }
  };

  const handleClear = () => {
    localStorage.removeItem(SAVED_KEY);
    setItems([]);
    setConfirmClear(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter', sans-serif" }}>
      <NavBar />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 60px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
              🔖 Saved Replies
            </h1>
            <p style={{ fontSize: 13, color: t.muted, margin: "4px 0 0" }}>
              {items.length} repl{items.length === 1 ? "y" : "ies"} bookmarked
            </p>
          </div>

          {items.length > 0 && (
            confirmClear ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: t.muted }}>Sure?</span>
                <button onClick={handleClear} style={{ color: t.error, background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: t.radiusSm, fontSize: 12, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Yes, clear</button>
                <button onClick={() => setConfirmClear(false)} style={{ color: t.muted, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: t.radiusSm, fontSize: 12, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} style={{ color: t.error, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: t.radiusSm, fontSize: 13, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>
            )
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: t.muted }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔖</div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: t.text, margin: "0 0 8px" }}>No saved replies yet</h2>
            <p style={{ fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>Tap the bookmark icon on any reply to save it here.</p>
            <Link href="/" style={{ color: t.accent, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Generate a reply →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item) => {
              const meta = INTENTS[item.intent] || INTENTS.normal;
              return (
                <div key={item.id} style={card}>
                  {/* Meta row */}
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
                      style={{ marginLeft: "auto", padding: "5px 12px", background: copied === item.id ? t.successDim : t.surface2, color: copied === item.id ? t.success : t.muted, border: `1px solid ${copied === item.id ? t.success + "40" : t.border}`, borderRadius: t.radiusSm, cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}
                    >
                      {copied === item.id ? <>✓ Copied</> : <>Copy</>}
                    </button>

                    <button
                      onClick={() => handleRemove(item.id)}
                      style={{ padding: "5px 12px", background: "rgba(255,107,107,0.08)", color: t.error, border: "1px solid rgba(255,107,107,0.2)", borderRadius: t.radiusSm, cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}
                    >
                      🔖 Remove
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
