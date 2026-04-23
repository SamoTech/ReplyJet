"use client";

import { useState } from "react";

const tones = ["professional", "friendly", "sales"];
const languages = ["English", "Arabic"];

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setCopied(false);
    setError("");
    setResult("");

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

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Could not generate a reply.");
        return;
      }

      setResult(payload.data.reply || "");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ReplyJet</h1>
        <p style={styles.subtitle}>Generate polished customer replies in seconds.</p>

        <label style={styles.label} htmlFor="message">
          Customer Message
        </label>
        <textarea
          id="message"
          style={styles.textarea}
          placeholder="Paste the customer message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="tone">
              Tone
            </label>
            <select id="tone" style={styles.select} value={tone} onChange={(e) => setTone(e.target.value)}>
              {tones.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="language">
              Language
            </label>
            <select
              id="language"
              style={styles.select}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button style={styles.button} onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Reply"}
        </button>

        {error ? <p style={styles.error}>{error}</p> : null}

        {result ? (
          <section style={styles.resultBox}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>Generated Reply</h2>
              <button style={styles.copyButton} onClick={handleCopy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p style={styles.resultText}>{result}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    background: "#f5f7fb",
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "760px",
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)",
  },
  title: {
    margin: 0,
    fontSize: "1.8rem",
    color: "#111827",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: "20px",
    color: "#4b5563",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    color: "#1f2937",
    fontSize: "0.92rem",
  },
  textarea: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    padding: "12px",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    marginBottom: "16px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  field: {
    width: "100%",
  },
  select: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    padding: "10px",
    fontSize: "0.95rem",
    background: "white",
  },
  button: {
    width: "100%",
    border: "none",
    borderRadius: "10px",
    padding: "12px 14px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    marginTop: "12px",
    color: "#b91c1c",
    fontWeight: 500,
  },
  resultBox: {
    marginTop: "20px",
    border: "1px solid #dbe3f0",
    borderRadius: "10px",
    padding: "16px",
    background: "#fafcff",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  resultTitle: {
    margin: 0,
    fontSize: "1rem",
  },
  copyButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "6px 10px",
    background: "white",
    cursor: "pointer",
  },
  resultText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
    color: "#1f2937",
  },
};
