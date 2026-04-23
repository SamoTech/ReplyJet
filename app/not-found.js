import Link from "next/link";

export const metadata = { title: "404 — ReplyJet" };

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: "0 16px",
      textAlign: "center",
    }}>
      <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style={{ marginBottom: 24 }}>
        <rect width="32" height="32" rx="8" fill="rgba(0,180,216,0.12)"/>
        <rect x="5" y="5" width="16" height="13" rx="3" fill="#00B4D8"/>
        <polygon points="7,18 4,25 13,18" fill="#00B4D8"/>
        <polygon points="17,8 13,15 15,15 11,22 19,13 17,13" fill="#0d0d0d"/>
      </svg>

      <div style={{ fontSize: 72, fontWeight: 700, color: "#00B4D8", lineHeight: 1, marginBottom: 8 }}>404</div>
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>Page not found</h1>
      <p style={{ color: "#888", fontSize: 14, maxWidth: 320, margin: "0 0 32px", lineHeight: 1.6 }}>
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link href="/" style={{
        padding: "10px 24px", background: "#00B4D8", color: "#000",
        borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600,
      }}>
        ← Back to ReplyJet
      </Link>

      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
