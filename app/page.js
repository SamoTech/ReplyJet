"use client";

import { useState } from "react";

const tones = ["professional", "friendly", "sales"];
const languages = ["Arabic", "English"];

const INTENT_LABELS = {
  angry: { label: "🔴 Angry", color: "#c0392b" },
  sales: { label: "🟢 Sales", color: "#27ae60" },
  normal: { label: "🔵 Normal", color: "#2980b9" },
};

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("Arabic");
  const [reply, setReply] = useState("");
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setError("");
    setReply("");
    setIntent("");
    setCopied(false);

    if (!message.trim()) {
      setError("Please enter a customer message.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, tone, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate reply.");
        return;
      }

      setReply(data?.data?.reply || "");
      setIntent(data?.data?.intent || "");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = reply;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const intentMeta = INTENT_LABELS[intent];

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>ReplyJet 🚀</h1>

      <label htmlFor="message">Customer message</label>
      <textarea
        id="message"
        rows={7}
        style={{ width: "100%", marginTop: 8, marginBottom: 16, display: "block" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Paste the customer message here..."
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label htmlFor="tone">Tone</label>
          <br />
          <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
            {tones.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language">Language</label>
          <br />
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "6px 18px",
            background: loading ? "#999" : "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {reply ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>Reply</h2>
            {intentMeta && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: intentMeta.color,
                  color: "#fff",
                  letterSpacing: 0.3,
                }}
              >
                {intentMeta.label}
              </span>
            )}
          </div>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f6f6f6",
              padding: 12,
              borderRadius: 6,
              border: "1px solid #ddd",
              direction: language === "Arabic" ? "rtl" : "ltr",
              textAlign: language === "Arabic" ? "right" : "left",
            }}
          >
            {reply}
          </pre>

          <button
            onClick={handleCopy}
            style={{
              marginTop: 8,
              padding: "5px 14px",
              background: copied ? "#27ae60" : "#f0f0f0",
              color: copied ? "#fff" : "#333",
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy reply"}
          </button>
        </div>
      ) : null}
    </main>
  );
}
