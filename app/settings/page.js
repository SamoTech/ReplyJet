"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import {
  t, card, labelStyle, segmentBase,
  TONES, LANGUAGES,
  DEFAULT_PREFS, loadPrefs, savePrefs,
} from "@/lib/tokens";

export default function SettingsPage() {
  const [prefs,  setPrefs]  = useState(DEFAULT_PREFS);
  const [saved,  setSaved]  = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { setPrefs(loadPrefs()); }, []);

  const handleSave = () => {
    try {
      savePrefs(prefs);
      setSaved(true); setNotice("Settings saved.");
      setTimeout(() => { setSaved(false); setNotice(""); }, 2500);
    } catch {
      setSaved(false); setNotice("Could not save — localStorage unavailable.");
    }
  };

  const handleReset = () => {
    setPrefs({ ...DEFAULT_PREFS });
    try { savePrefs(DEFAULT_PREFS); } catch {}
    setNotice("Reset to defaults.");
    setTimeout(() => setNotice(""), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter', sans-serif" }}>

      <NavBar />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 60px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Page title */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Settings</h1>
          <p style={{ fontSize: 13, color: t.muted, margin: "4px 0 0" }}>Saved to your browser — no account needed.</p>
        </div>

        {/* Default Tone */}
        <div style={card}>
          <span style={labelStyle}>Default Tone</span>
          <div style={{ display: "flex", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
            {TONES.map(({ value, icon, label }) => (
              <button key={value} onClick={() => setPrefs(p => ({ ...p, defaultTone: value }))} style={segmentBase(prefs.defaultTone === value)}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Default Language */}
        <div style={card}>
          <span style={labelStyle}>Default Language</span>
          <div style={{ display: "flex", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
            {LANGUAGES.map(({ value, flag, label }) => (
              <button key={value} onClick={() => setPrefs(p => ({ ...p, defaultLanguage: value }))} style={segmentBase(prefs.defaultLanguage === value)}>
                {flag} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Max Tokens */}
        <div style={card}>
          <span style={labelStyle}>
            Max reply length —{" "}
            <span style={{ color: t.accent, textTransform: "none", letterSpacing: 0 }}>{prefs.maxTokens} tokens</span>
          </span>
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
        <div style={{ ...card, border: `1px solid ${t.accentBorder}`, background: "rgba(0,180,216,0.04)" }}>
          <span style={labelStyle}>API Key</span>
          <p style={{ fontSize: 13, color: t.muted, margin: "0 0 12px", lineHeight: 1.6 }}>
            ReplyJet uses the <strong style={{ color: t.text }}>Groq API</strong> on the server side.
            Your key is stored in{" "}
            <code style={{ background: t.surface2, padding: "1px 5px", borderRadius: 3, fontSize: 12 }}>.env.local</code>
            {" "}and never exposed to the browser.
          </p>
          <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" style={{ color: t.accent, fontSize: 13, fontWeight: 500 }}>
            Get a Groq API key ↗
          </a>
        </div>

        {/* Notice */}
        {notice && (
          <div style={{ background: saved ? t.successDim : "rgba(255,107,107,0.1)", border: `1px solid ${saved ? "rgba(74,222,128,0.3)" : "rgba(255,107,107,0.3)"}`, borderRadius: t.radiusSm, padding: "10px 14px", fontSize: 13, color: saved ? t.success : t.error }}>
            {saved ? "✓" : "⚠️"} {notice}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            className="rj-btn-save"
            style={{ flex: 1, padding: "12px", background: t.accent, color: "#000", border: "none", borderRadius: t.radius, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
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
      <style>{`
        * { box-sizing: border-box; }
        .rj-btn-save:hover { background: ${t.accentHov} !important; }
      `}</style>
    </div>
  );
}
