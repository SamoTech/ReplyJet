"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const t = {
  bg: "#0d0d0d", surface: "#141414", surface2: "#1a1a1a",
  border: "rgba(255,255,255,0.08)", text: "#f0f0f0", muted: "#888", faint: "#444",
  accent: "#00B4D8", accentDim: "rgba(0,180,216,0.12)", accentHov: "#0096b4",
  success: "#4ade80", successDim: "rgba(74,222,128,0.1)",
  error: "#ff6b6b", errorDim: "rgba(255,107,107,0.1)",
  radius: "10px", radiusSm: "6px",
  shadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
};

const card = { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "20px", boxShadow: t.shadow };
const label = { display: "block", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted, marginBottom: 8 };

const DEFAULTS = { defaultTone: "professional", defaultLanguage: "Arabic", maxTokens: 180 };

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [saved, setSaved]   = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("replyjet_prefs");
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("replyjet_prefs", JSON.stringify(prefs));
      setSaved(true); setNotice("Settings saved.");
      setTimeout(() => { setSaved(false); setNotice(""); }, 2500);
    } catch {
      setNotice("Could not save settings.");
    }
  };

  const handleReset = () => {
    setPrefs(DEFAULTS);
    localStorage.removeItem("replyjet_prefs");
    setNotice("Reset to defaults.");
    setTimeout(() => setNotice(""), 2000);
  };

  const seg = (active) => ({
    flex: 1, padding: "8px 4px", fontSize: 13, fontWeight: active ? 600 : 400,
    color: active ? t.accent : t.muted, background: active ? t.accentDim : "transparent",
    border: "none", borderRadius: t.radiusSm, cursor: "pointer",
    transition: "all 0.15s", fontFamily: "inherit",
  });

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, padding: "0 16px 60px", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ maxWidth: 720, margin: "0 auto", padding: "32px 0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, marginBottom: 32 }}>
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
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px", lineHeight: 1.2 }}>Reply<span style={{ color: t.accent }}>Jet</span></div>
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Settings</div>
          </div>
        </div>
        <Link href="/" style={{ color: t.muted, textDecoration: "none", fontSize: 13, padding: "6px 12px", borderRadius: t.radiusSm, border: `1px solid ${t.border}` }}>← Back</Link>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Default Tone */}
        <div style={card}>
          <span style={label}>Default Tone</span>
          <div style={{ display: "flex", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
            {[["professional","💼","Professional"],["friendly","😊","Friendly"],["sales","🎯","Sales"]].map(([v, ic, lb]) => (
              <button key={v} onClick={() => setPrefs(p => ({ ...p, defaultTone: v }))} style={seg(prefs.defaultTone === v)}>
                {ic} {lb}
              </button>
            ))}
          </div>
        </div>

        {/* Default Language */}
        <div style={card}>
          <span style={label}>Default Language</span>
          <div style={{ display: "flex", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
            {[["Arabic","🇪🇬","Arabic"],["English","🇬🇧","English"]].map(([v, fl, lb]) => (
              <button key={v} onClick={() => setPrefs(p => ({ ...p, defaultLanguage: v }))} style={seg(prefs.defaultLanguage === v)}>
                {fl} {lb}
              </button>
            ))}
          </div>
        </div>

        {/* Max Tokens */}
        <div style={card}>
          <span style={label}>Max reply length — <span style={{ color: t.accent, textTransform: "none", letterSpacing: 0 }}>{prefs.maxTokens} tokens</span></span>
          <input
            type="range" min={60} max={400} step={20}
            value={prefs.maxTokens}
            onChange={(e) => setPrefs(p => ({ ...p, maxTokens: +e.target.value }))}
            style={{ width: "100%", accentColor: t.accent }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.faint, marginTop: 4 }}>
            <span>Short (60)</span><span>Long (400)</span>
          </div>
        </div>

        {/* API Info */}
        <div style={{ ...card, border: `1px solid rgba(0,180,216,0.2)`, background: "rgba(0,180,216,0.04)" }}>
          <span style={label}>API Key</span>
          <p style={{ fontSize: 13, color: t.muted, margin: "0 0 12px", lineHeight: 1.6 }}>
            ReplyJet uses the <strong style={{ color: t.text }}>Groq API</strong> on the server side.
            Your key is stored in the <code style={{ background: t.surface2, padding: "1px 5px", borderRadius: 3, fontSize: 12 }}>.env.local</code> file and never exposed to the browser.
          </p>
          <a
            href="https://console.groq.com/keys"
            target="_blank" rel="noopener noreferrer"
            style={{ color: t.accent, fontSize: 13, fontWeight: 500 }}
          >
            Get a Groq API key ↗
          </a>
        </div>

        {/* Notice */}
        {notice && (
          <div style={{ background: saved ? t.successDim : t.errorDim, border: `1px solid ${saved ? "rgba(74,222,128,0.3)" : "rgba(255,107,107,0.3)"}`, borderRadius: t.radiusSm, padding: "10px 14px", fontSize: 13, color: saved ? t.success : t.error }}>
            {saved ? "✓" : "⚠️"} {notice}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            style={{ flex: 1, padding: "12px", background: t.accent, color: "#000", border: "none", borderRadius: t.radius, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Save settings
          </button>
          <button
            onClick={handleReset}
            style={{ padding: "12px 20px", background: "transparent", color: t.muted, border: `1px solid ${t.border}`, borderRadius: t.radius, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          >
            Reset
          </button>
        </div>

      </main>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
