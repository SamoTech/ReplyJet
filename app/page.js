"use client";

import { useState } from "react";
import Link from "next/link";

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

const card = {
  background: t.surface,
  border: `1px solid ${t.border}`,
  borderRadius: t.radius,
  padding: "20px",
  boxShadow: t.shadow,
};

const labelStyle = {
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

const NAV_LINKS = [
  { href: "/history",  label: "History",  icon: "🕑" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/about",    label: "About",    icon: "ℹ️" },
];

// ── Save to history ──────────────────────────────────────────────────
function saveToHistory({ message, tone, language, reply, intent }) {
  try {
    const entry = { id: Date.now(), ts: Date.now(), message, tone, language, reply, intent };
    const prev  = JSON.parse(localStorage.getItem("replyjet_history") || "[]");
    localStorage.setItem("replyjet_history", JSON.stringify([entry, ...prev].slice(0, 50)));
  } catch { /* localStorage blocked in some envs — silent fail */ }
}

// ── Component ────────────────────────────────────────────────────────
export default function HomePage() {
  const [message,   setMessage]   = useState("");
  const [tone,      setTone]      = useState("professional");
  const [language,  setLanguage]  = useState("Arabic");
  const [reply,     setReply]     = useState("");
  const [intent,    setIntent]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleGenerate = async () => {
    setError(""); setReply(""); setIntent(""); setCopied(false);
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
      const generatedReply  = data?.data?.reply  || "";
      const detectedIntent  = data?.data?.intent || "";
      setReply(generatedReply);
      setIntent(detectedIntent);
      // ── Wire history ──
      if (generatedReply) {
        saveToHistory({ message, tone, language, reply: generatedReply, intent: detectedIntent });
      }
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
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text }}>

      {/* ── Top Nav Bar ── */}
      <nav style={{
        position:       "sticky",
        top:            0,
        zIndex:         100,
        background:     "rgba(13,13,13,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom:   `1px solid ${t.border}`,
      }}>
        <div style={{
          maxWidth:       720,
          margin:         "0 auto",
          padding:        "0 16px",
          height:         56,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill={t.accentDim}/>
              <rect x="5" y="5" width="16" height="13" rx="3" fill={t.accent}/>
              <polygon points="7,18 4,25 13,18" fill={t.accent}/>
              <polygon points="17,8 13,15 15,15 11,22 19,13 17,13" fill={t.bg}/>
            </svg>
            <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>
              Reply<span style={{ color: t.accent }}>Jet</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            5,
                  padding:        "6px 12px",
                  borderRadius:   t.radiusSm,
                  fontSize:       "13px",
                  fontWeight:     500,
                  color:          t.muted,
                  textDecoration: "none",
                  transition:     "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.surface2; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = t.muted; e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 14 }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Page Hero ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 16px 32px", textAlign: "center" }}>
        <div style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           6,
          fontSize:      "11px",
          fontWeight:    600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         t.accent,
          background:    t.accentDim,
          border:        "1px solid rgba(0,180,216,0.2)",
          borderRadius:  999,
          padding:       "4px 12px",
          marginBottom:  16,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill={t.accent}><circle cx="12" cy="12" r="8"/></svg>
          AI-Powered
        </div>
        <h1 style={{
          fontSize:      "clamp(28px, 5vw, 42px)",
          fontWeight:    800,
          letterSpacing: "-1px",
          lineHeight:    1.15,
          margin:        "0 0 10px",
          color:         t.text,
        }}>
          Reply<span style={{ color: t.accent }}>Jet</span>
        </h1>
        <p style={{ fontSize: "15px", color: t.muted, margin: 0, lineHeight: 1.6 }}>
          Generate smart customer replies in seconds —{" "}
          <span style={{ color: t.text }}>Arabic & English</span>
        </p>
      </div>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Input Card ── */}
        <div style={card}>
          <label style={labelStyle} htmlFor="message">Customer message</label>
          <div style={{ position: "relative" }}>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setCharCount(e.target.value.length); }}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Paste the customer message here..."
              style={{
                width:        "100%",
                background:   t.surface2,
                border:       `1px solid ${t.border}`,
                borderRadius: t.radiusSm,
                color:        t.text,
                fontSize:     "14px",
                lineHeight:   1.6,
                padding:      "12px 12px 28px",
                resize:       "vertical",
                outline:      "none",
                fontFamily:   "inherit",
                boxSizing:    "border-box",
                transition:   "border-color 0.15s",
                minHeight:    120,
              }}
              onFocus={(e) => (e.target.style.borderColor = t.accent)}
              onBlur={(e)  => (e.target.style.borderColor = t.border)}
            />
            <span style={{
              position:      "absolute",
              bottom:        10,
              right:         12,
              fontSize:      "11px",
              color:         charCount > 0 ? t.faint : "transparent",
              pointerEvents: "none",
              transition:    "color 0.15s",
            }}>
              {charCount} chars
            </span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "11px", color: t.faint }}>
            Tip: Press{" "}
            <kbd style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 3, padding: "1px 4px", fontSize: 10 }}>Ctrl+Enter</kbd>
            {" "}to generate
          </p>
        </div>

        {/* ── Controls Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={card}>
            <label style={labelStyle}>Tone</label>
            <div style={{ display: "flex", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
              {TONES.map((item) => (
                <button key={item.value} onClick={() => setTone(item.value)} style={segmentBase(tone === item.value)}>
                  <span>{item.icon}</span><span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={card}>
            <label style={labelStyle}>Language</label>
            <div style={{ display: "flex", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
              {LANGUAGES.map((item) => (
                <button key={item.value} onClick={() => setLanguage(item.value)} style={segmentBase(language === item.value)}>
                  <span>{item.flag}</span><span>{item.label}</span>
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
            width:          "100%",
            padding:        "14px",
            background:     loading ? t.faint : t.accent,
            color:          loading ? t.muted : "#000",
            border:         "none",
            borderRadius:   t.radius,
            fontSize:       "15px",
            fontWeight:     700,
            cursor:         loading ? "not-allowed" : "pointer",
            fontFamily:     "inherit",
            letterSpacing:  "0.02em",
            transition:     "background 0.15s",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            gap:            8,
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = t.accentHov; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = t.accent; }}
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
          <div style={{ ...card, border: `1px solid ${intentMeta?.color ?? t.accent}30` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted }}>
                Generated Reply
              </span>
              {intentMeta && (
                <span style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           5,
                  fontSize:      "11px",
                  fontWeight:    600,
                  padding:       "3px 10px",
                  borderRadius:  999,
                  background:    intentMeta.dim,
                  color:         intentMeta.color,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}>
                  {intentMeta.icon} {intentMeta.label}
                </span>
              )}
            </div>

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

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
              <button
                onClick={handleCopy}
                style={{
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
              <Link href="/history" style={{ fontSize: "12px", color: t.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = t.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = t.muted)}
              >
                🕑 View history
              </Link>
            </div>
          </div>
        )}

      </main>

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
