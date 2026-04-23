"use client";

import { useState } from "react";

const tones = ["professional", "friendly", "sales"];
const languages = ["Arabic", "English"];

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("Arabic");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setReply("");

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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>ReplyJet</h1>

      <label htmlFor="message">Customer message</label>
      <textarea
        id="message"
        rows={7}
        style={{ width: "100%", marginTop: 8, marginBottom: 16 }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
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
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      {reply ? (
        <div style={{ marginTop: 16 }}>
          <h2>Reply</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{reply}</pre>
        </div>
      ) : null}
    </main>
  );
}
