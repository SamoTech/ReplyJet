"use client";

import { useState } from "react";

// ── Design Tokens ────────────────────────────────────────────────────
const t = {
  bg:         "#0d0d0d",
  surface:    "#141414",
  surface2:   "#1a1a1a",
  border:     "rgba(255,255,255,0.08)",
  borderHov:  "rgba(255,255,255,0.16)",
  text:       "#f0f0f0",
  muted:      "#888",
  faint:      "#444",
  accent:     "#00B4D8",
  accentHov:  "#0096b4",
  accentDim:  "rgba(0,180,216,0.12)",
  error:      "#ff6b6b",
  errorDim:   "rgba(255,107,107,0.1)",
  success:    "#4ade80",
  successDim: "rgba(74,222,128,0.1)",
  radius:     "10px",
  radiusSm:   "6px",
  shadow:     "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
};

// ── Constants ────────────────────────────────────────────────────────
const TONES = [
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "friendly",     label: "Friendly",     icon: "😊" },
  { value: "sales",        label: "Sales",        icon: "🎯" },
];

const LANGUAGES = [
  { value: "Arabic",  label: "Arabic",  flag: "🇪🇬" },
  { value: "English", label: "English", flag: "🇬🇧" },
];

const INTENTS = {
  angry:  { label: "Angry",  icon: "😤", color: "#f87171",  dim: "rgba(248,113,113,0.12)" },
  sales:  { label: "Sales",  icon: "💰", color: "#4ade80",  dim: "rgba(74,222,128,0.12)"  },
  normal: { label: "Normal", icon: "💬", color: "#60a5fa",  dim: "rgba(96,165,250,0.12)"  },
};

// ── Reusable style helpers ───────────────────────────────────────────
const card = {
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: t.radius,
  padding: "20px",
  boxShadow: t.shadow,
};

const label = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: t.muted,
  marginBottom: "8px",
};

const segmentBase = (active) => ({
  flex: 1,
  padding: "8px 4px",
  fontSize: "13px",
  fontWeight: active ? 600 : 400,
  color: active ? t.accent : t.muted,
  background: active ? t.accentDim : "transparent",
  border: "none",
  borderRadius: t.radiusSm,
  cursor: "pointer",
  transition: "all 0.15s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontFamily: "inherit",
});

// ── Component ────────────────────────────────────────────────────────
export default function HomePage() {
  const [message,  setMessage]  = useState("");
  const [tone,     setTone]     = useState("professional");
  const [language, setLanguage] = useState("Arabic");
  const [reply,    setReply]    = useState("");
  const [intent,   setIntent]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [copied,   setCopied]   = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleGenerate = async () => {
    setError("");
    setReply("");
    setIntent("");
    setCopied(false);
    if (!message.trim()) { setError("Please enter a customer message."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message, tone, language }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate reply."); return; }
      setReply(data?.data?.reply  || "");
      setIntent(data?.data?.intent || "");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!reply) return;
    try { await navigator.clipboard.writeText(reply); }
    catch {
      const el = document.createElement("textarea");
      el.value = reply;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const intentMeta = INTENTS[intent];
  const isArabic   = language === "Arabic";

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, padding: "0 16px 60px" }}>

      {/* ── Header ── */}
      <header style={{
        maxWidth: 720,
        margin:   "0 auto",
        padding:  "32px 0 28px",
        display:  "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: `1px solid ${t.border}`,
        marginBottom: 32,
      }}>
        {/* Logo mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill={t.accentDim}/>
          <rect x="5" y="5" width="16" height="13" rx="3" fill={t.accent}/>
          <polygon points="7,18 4,25 13,18" fill={t.accent}/>
          <polygon points="17,8 13,15 15,15 11,22 19,13 17,13" fill={t.bg}/>
        </svg>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            Reply<span style={{ color: t.accent }}>Jet</span>
          </div>
          <div style={{ fontSize: "11px", color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AI Reply Engine
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Input Card ── */}
        <div style={card}>
          <label style={label} htmlFor="message">Customer message</label>
          <div style={{ position: "relative" }}>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setCharCount(e.target.value.length); }}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Paste the customer message here..."
              style={{
                width:         "100%",
                background:    t.surface2,
                border:        `1px solid ${t.border}`,
                borderRadius:  t.radiusSm,
                color:         t.text,
                fontSize:      "14px",
                lineHeight:    1.6,
                padding:       "12px",
                resize:        "vertical",
                outline:       "none",
                fontFamily:    "inherit",
                boxSizing:     "border-box",
                transition:    "border-color 0.15s",
              }}
              onFocus={(e)  => (e.target.style.borderColor = t.accent)}
              onBlur={(e)   => (e.target.style.borderColor = t.border)}
            />
            {charCount > 0 && (
              <span style={{
                position:  "absolute", bottom: 8, right: 10,
                fontSize:  "11px", color: t.faint, pointerEvents: "none",
              }}>
                {charCount}
              </span>
            )}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "11px", color: t.faint }}>
            Tip: Press <kbd style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 3, padding: "1px 4px", fontSize: 10 }}>Ctrl+Enter</kbd> to generate
          </p>
        </div>

        {/* ── Controls Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

          {/* Tone */}
          <div style={card}>
            <label style={label}>Tone</label>
            <div style={{
              display:       "flex",
              background:    t.surface2,
              borderRadius:  t.radiusSm,
              border:        `1px solid ${t.border}`,
              padding:       3,
              gap:           2,
            }}>
              {TONES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setTone(item.value)}
                  style={segmentBase(tone === item.value)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div style={card}>
            <label style={label}>Language</label>
            <div style={{
              display:       "flex",
              background:    t.surface2,
              borderRadius:  t.radiusSm,
              border:        `1px solid ${t.border}`,
              padding:       3,
              gap:           2,
            }}>
              {LANGUAGES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setLanguage(item.value)}
                  style={segmentBase(language === item.value)}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Generate Button ── */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width:         "100%",
            padding:       "14px",
            background:    loading ? t.faint : t.accent,
            color:         loading ? t.muted : "#000",
            border:        "none",
            borderRadius:  t.radius,
            fontSize:      "15px",
            fontWeight:    700,
            cursor:        loading ? "not-allowed" : "pointer",
            fontFamily:    "inherit",
            letterSpacing: "0.02em",
            transition:    "background 0.15s, transform 0.1s",
            display:       "flex",
            alignItems:    "center",
            justifyContent: "center",
            gap:           8,
          }}
          onMouseEnter={(e) => { if (!loading) e.target.style.background = t.accentHov; }}
          onMouseLeave={(e) => { if (!loading) e.target.style.background = t.accent; }}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ animation: "spin 0.8s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Generate Reply
            </>
          )}
        </button>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background:   t.errorDim,
            border:       `1px solid ${t.error}30`,
            borderRadius: t.radiusSm,
            padding:      "10px 14px",
            fontSize:     "13px",
            color:        t.error,
            display:      "flex",
            alignItems:   "center",
            gap:          8,
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── Reply Card ── */}
        {reply && (
          <div style={{
            ...card,
            border: `1px solid ${intentMeta?.color}30 ?? ${t.border}`,
          }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted }}>
                Generated Reply
              </span>
              {intentMeta && (
                <span style={{
                  display:      "inline-flex",
                  alignItems:   "center",
                  gap:          5,
                  fontSize:     "11px",
                  fontWeight:   600,
                  padding:      "3px 10px",
                  borderRadius: 999,
                  background:   intentMeta.dim,
                  color:        intentMeta.color,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}>
                  {intentMeta.icon} {intentMeta.label}
                </span>
              )}
            </div>

            {/* Reply text */}
            <div style={{
              background:   t.surface2,
              border:       `1px solid ${t.border}`,
              borderRadius: t.radiusSm,
              padding:      "14px 16px",
              fontSize:     "15px",
              lineHeight:   1.75,
              color:        t.text,
              direction:    isArabic ? "rtl" : "ltr",
              textAlign:    isArabic ? "right" : "left",
              whiteSpace:   "pre-wrap",
              wordBreak:    "break-word",
            }}>
              {reply}
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              style={{
                marginTop:    "12px",
                padding:      "8px 16px",
                background:   copied ? t.successDim : t.surface2,
                color:        copied ? t.success : t.muted,
                border:       `1px solid ${copied ? t.success + "40" : t.border}`,
                borderRadius: t.radiusSm,
                cursor:       "pointer",
                fontSize:     "13px",
                fontWeight:   500,
                fontFamily:   "inherit",
                display:      "inline-flex",
                alignItems:   "center",
                gap:          6,
                transition:   "all 0.15s",
              }}
            >
              {copied ? (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy reply</>
              )}
            </button>
          </div>
        )}

      </main>

      {/* ── Spin keyframe ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::selection { background: rgba(0,180,216,0.25); }
        textarea::placeholder { color: #444; }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        kbd { font-family: inherit; }
      `}</style>
    </div>
  );
}
