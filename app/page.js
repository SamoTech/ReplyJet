"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import {
  t, card, labelStyle, segmentBase,
  TONES, LANGUAGES, MODES, INTENTS,
  loadPrefs, saveToHistory, toggleSaved, isSaved,
} from "@/lib/tokens";

export default function HomePage() {
  const [message,   setMessage]   = useState("");
  const [tone,      setTone]      = useState("professional");
  const [language,  setLanguage]  = useState("Arabic");
  const [mode,      setMode]      = useState("auto");
  const [reply,     setReply]     = useState("");
  const [intent,    setIntent]    = useState("");
  const [replyId,   setReplyId]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [regen,     setRegen]     = useState(false);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const prefs = loadPrefs();
    setTone(prefs.defaultTone);
    setLanguage(prefs.defaultLanguage);
    const tpl = typeof window !== "undefined" && sessionStorage.getItem("rj_template");
    if (tpl) {
      setMessage(tpl);
      setCharCount(tpl.length);
      sessionStorage.removeItem("rj_template");
    }
  }, []);

  const generate = async ({ isRegen = false } = {}) => {
    setError(""); setCopied(false); setSaved(false);
    if (!isRegen) { setReply(""); setIntent(""); setReplyId(null); }
    if (!message.trim()) { setError("Please enter a customer message."); return; }
    isRegen ? setRegen(true) : setLoading(true);
    try {
      const { maxTokens } = loadPrefs();
      const res  = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message, tone, language, maxTokens, mode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate reply."); return; }
      const generatedReply = data?.data?.reply  || "";
      const detectedIntent = data?.data?.intent || "";
      const newId = Date.now();
      setReply(generatedReply);
      setIntent(detectedIntent);
      setReplyId(newId);
      setSaved(false);
      if (generatedReply) {
        saveToHistory({ message, tone, language, reply: generatedReply, intent: detectedIntent, mode });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRegen(false);
    }
  };

  const handleGenerate   = () => generate({ isRegen: false });
  const handleRegenerate = () => generate({ isRegen: true });

  const handleCopy = async () => {
    if (!reply) return;
    try { await navigator.clipboard.writeText(reply); }
    catch {
      const el = document.createElement("textarea");
      el.value = reply; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!reply || !replyId) return;
    const nowSaved = toggleSaved({ id: replyId, message, tone, language, reply, intent, mode });
    setSaved(nowSaved);
  };

  const intentMeta = INTENTS[intent];
  const isArabic   = language === "Arabic";
  const isBusy     = loading || regen;

  const charColor =
    charCount >= 1000 ? t.error
    : charCount >= 800  ? t.warning
    : t.faint;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text }}>

      <NavBar />

      {/* Hero */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 16px 32px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          color: t.accent, background: t.accentDim,
          border: "1px solid rgba(0,180,216,0.2)", borderRadius: 999,
          padding: "4px 12px", marginBottom: 16,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill={t.accent}><circle cx="12" cy="12" r="8"/></svg>
          AI-Powered
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 10px", color: t.text }}>
          Reply<span style={{ color: t.accent }}>Jet</span>
        </h1>
        <p style={{ fontSize: "15px", color: t.muted, margin: 0, lineHeight: 1.6 }}>
          Generate smart customer replies in seconds —{" "}
          <span style={{ color: t.text }}>Arabic & English</span>
        </p>
      </div>

      {/* Main */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px", display: "flex", flexDirection: "column", gap: 16, fontFamily: "'Inter', sans-serif" }}>

        {/* Input Card */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="message">Customer message</label>
            <Link href="/templates" style={{ fontSize: "11px", color: t.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "opacity 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              📋 Use template
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setCharCount(e.target.value.length); }}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Paste the customer message here..."
              className="rj-textarea"
              style={{
                width: "100%", background: t.surface2, border: `1px solid ${t.border}`,
                borderRadius: t.radiusSm, color: t.text, fontSize: "14px", lineHeight: 1.6,
                padding: "12px 12px 28px", resize: "vertical", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s", minHeight: 120,
              }}
              onFocus={(e) => (e.target.style.borderColor = t.accent)}
              onBlur={(e)  => (e.target.style.borderColor = t.border)}
            />
            {charCount > 0 && (
              <span style={{
                position: "absolute", bottom: 10, right: 12, fontSize: "11px",
                color: charColor, pointerEvents: "none", transition: "color 0.2s",
              }}>
                {charCount} chars
              </span>
            )}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "11px", color: t.faint }}>
            Tip: Press{" "}
            <kbd style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 3, padding: "1px 4px", fontSize: 10 }}>Ctrl+Enter</kbd>
            {" "}to generate
          </p>
        </div>

        {/* Mode Selector */}
        <div style={card}>
          <label style={labelStyle}>Mode</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
            {MODES.map((item) => {
              const isActive = mode === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setMode(item.value)}
                  title={item.description}
                  style={{
                    ...segmentBase(isActive),
                    flexDirection: "column",
                    padding: "10px 4px",
                    gap: 3,
                    fontSize: "12px",
                  }}
                >
                  <span style={{ fontSize: "16px", lineHeight: 1 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          {mode !== "auto" && (
            <p style={{ margin: "8px 0 0", fontSize: "11px", color: t.accent }}>
              ✦ {MODES.find((m) => m.value === mode)?.description}
            </p>
          )}
        </div>

        {/* Controls Row */}
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

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isBusy}
          className="rj-btn-primary"
          style={{
            width: "100%", padding: "14px",
            background: isBusy ? t.faint : t.accent,
            color: isBusy ? t.muted : "#000",
            border: "none", borderRadius: t.radius,
            fontSize: "15px", fontWeight: 700,
            cursor: isBusy ? "not-allowed" : "pointer",
            fontFamily: "inherit", letterSpacing: "0.02em",
            transition: "background 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Generate Reply
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div style={{ background: t.errorDim, border: `1px solid ${t.error}30`, borderRadius: t.radiusSm, padding: "10px 14px", fontSize: "13px", color: t.error, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Reply Card */}
        {reply && (
          <div style={{ ...card, border: `1px solid ${intentMeta?.color ?? t.accent}30` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted }}>Generated Reply</span>
              {intentMeta && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: intentMeta.dim, color: intentMeta.color, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {intentMeta.icon} {intentMeta.label}
                </span>
              )}
            </div>

            <div style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: t.radiusSm, padding: "14px 16px", fontSize: "15px", lineHeight: 1.75, color: t.text, direction: isArabic ? "rtl" : "ltr", textAlign: isArabic ? "right" : "left", whiteSpace: "pre-wrap", wordBreak: "break-word", opacity: regen ? 0.4 : 1, transition: "opacity 0.2s" }}>
              {reply}
            </div>

            {/* Actions row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCopy}
                  disabled={regen}
                  style={{ padding: "8px 16px", background: copied ? t.successDim : t.surface2, color: copied ? t.success : t.muted, border: `1px solid ${copied ? t.success + "40" : t.border}`, borderRadius: t.radiusSm, cursor: regen ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 500, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}
                >
                  {copied ? (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy reply</>
                  )}
                </button>

                <button
                  onClick={handleRegenerate}
                  disabled={isBusy}
                  className="rj-btn-regen"
                  style={{ padding: "8px 14px", background: t.surface2, color: t.muted, border: `1px solid ${t.border}`, borderRadius: t.radiusSm, cursor: isBusy ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 500, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: regen ? "spin 0.7s linear infinite" : "none" }}>
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  {regen ? "Regenerating..." : "Regenerate"}
                </button>

                {/* Bookmark / Save */}
                <button
                  onClick={handleSave}
                  disabled={regen}
                  title={saved ? "Remove from saved" : "Save reply"}
                  style={{ padding: "8px 12px", background: saved ? "rgba(251,191,36,0.12)" : t.surface2, color: saved ? "#fbbf24" : t.muted, border: `1px solid ${saved ? "rgba(251,191,36,0.3)" : t.border}`, borderRadius: t.radiusSm, cursor: regen ? "not-allowed" : "pointer", fontSize: "14px", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}
                >
                  {saved ? "🔖" : "🔖"}
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>{saved ? "Saved" : "Save"}</span>
                </button>
              </div>

              <Link
                href="/history"
                className="rj-link-muted"
                style={{ fontSize: "12px", color: t.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "color 0.15s", whiteSpace: "nowrap" }}
              >
                🕑 History
              </Link>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::selection { background: rgba(0,180,216,0.25); }
        .rj-textarea::placeholder { color: #444; }
        .rj-textarea::-webkit-scrollbar { width: 4px; }
        .rj-textarea::-webkit-scrollbar-track { background: transparent; }
        .rj-textarea::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        kbd { font-family: inherit; }
        .rj-btn-primary:not(:disabled):hover { background: ${t.accentHov} !important; }
        .rj-btn-regen:not(:disabled):hover { color: ${t.text} !important; border-color: ${t.borderHov} !important; }
        .rj-link-muted:hover { color: ${t.accent} !important; }
      `}</style>
    </div>
  );
}
