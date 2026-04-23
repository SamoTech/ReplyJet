import Link from "next/link";

export const metadata = {
  title: "About — ReplyJet",
  description: "Learn how ReplyJet works — intent detection, tones, and language modes.",
};

const t = {
  bg: "#0d0d0d", surface: "#141414", surface2: "#1a1a1a",
  border: "rgba(255,255,255,0.08)", text: "#f0f0f0", muted: "#888", faint: "#444",
  accent: "#00B4D8", accentDim: "rgba(0,180,216,0.12)",
  radius: "10px", radiusSm: "6px",
  shadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
};

const card = { background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "20px", boxShadow: t.shadow };

const INTENTS = [
  { icon: "😤", label: "Angry",  color: "#f87171", dim: "rgba(248,113,113,0.12)", desc: "Detects frustration keywords in Arabic & English. Generates a structured apology reply with a fixed 4-step format." },
  { icon: "💰", label: "Sales",  color: "#4ade80", dim: "rgba(74,222,128,0.12)",  desc: "Detects pricing and availability questions. Answers the question first, then highlights value with a CTA." },
  { icon: "💬", label: "Normal", color: "#60a5fa", dim: "rgba(96,165,250,0.12)",  desc: "Default mode for general questions. Replies directly and concisely without a fixed template." },
];

const TONES = [
  { icon: "💼", label: "Professional", desc: "Formal, clear, and confident. Best for corporate or B2B customers." },
  { icon: "😊", label: "Friendly",     desc: "Warm and conversational. Best for consumer brands and retail." },
  { icon: "🎯", label: "Sales",        desc: "Persuasive and CTA-focused. Best for closing or upselling." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, padding: "0 16px 60px", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ maxWidth: 720, margin: "0 auto", padding: "32px 0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, marginBottom: 40 }}>
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
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>About</div>
          </div>
        </div>
        <Link href="/" style={{ color: t.muted, textDecoration: "none", fontSize: 13, padding: "6px 12px", borderRadius: t.radiusSm, border: `1px solid ${t.border}` }}>← Back</Link>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Hero */}
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", margin: "0 0 12px" }}>
            What is <span style={{ color: t.accent }}>ReplyJet</span>?
          </h1>
          <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.8, maxWidth: 600, margin: 0 }}>
            ReplyJet is an AI-powered customer support reply engine. Paste a customer message,
            pick a tone and language — and get a natural, human-sounding reply in seconds.
            It detects the customer’s intent automatically and adapts the reply structure accordingly.
          </p>
        </div>

        {/* How it works */}
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted, margin: "0 0 16px" }}>How it works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              ["1", "Paste",   "Drop in the customer’s message."],
              ["2", "Detect",  "ReplyJet automatically detects the intent: angry, sales, or normal."],
              ["3", "Prompt",  "A structured system prompt is built based on intent + tone + language."],
              ["4", "Generate","Groq’s LLaMA 3.1 generates the reply in under a second."],
              ["5", "Copy",    "Copy the reply and send it to your customer."],
            ].map(([num, title, desc], i, arr) => (
              <div key={num} style={{ display: "flex", gap: 16, paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.accentDim, border: `1px solid rgba(0,180,216,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: t.accent, flexShrink: 0 }}>{num}</div>
                  {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: t.border, marginTop: 4 }} />}
                </div>
                <div style={{ paddingTop: 4, paddingBottom: i < arr.length - 1 ? 0 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 13, color: t.muted, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intents */}
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted, margin: "0 0 16px" }}>Intent Detection</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INTENTS.map((item) => (
              <div key={item.label} style={{ ...card, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: item.dim, color: item.color, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                    {item.label}
                  </span>
                  <p style={{ fontSize: 13, color: t.muted, margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tones */}
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted, margin: "0 0 16px" }}>Tones</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {TONES.map((item) => (
              <div key={item.label} style={card}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: t.muted, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech */}
        <div style={card}>
          <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted, margin: "0 0 16px" }}>Tech Stack</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["Framework",   "Next.js 14 (App Router)"],
              ["AI Model",    "LLaMA 3.1 8B via Groq"],
              ["Language",    "JavaScript (no TypeScript)"],
              ["Styling",     "Inline styles — zero CSS deps"],
              ["Analytics",   "Vercel Web Analytics"],
              ["Deployment",  "Vercel"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: t.surface2, borderRadius: t.radiusSm, padding: "10px 14px", border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 11, color: t.faint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Link href="/" style={{ display: "inline-block", padding: "12px 32px", background: t.accent, color: "#000", borderRadius: t.radius, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            Start using ReplyJet →
          </Link>
        </div>

      </main>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
