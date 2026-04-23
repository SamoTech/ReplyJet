export default function Loading() {
  const t = {
    bg: "#0d0d0d", surface: "#141414", surface2: "#1a1a1a",
    border: "rgba(255,255,255,0.08)", radius: "10px", radiusSm: "6px",
  };

  const card = {
    background: t.surface, border: `1px solid ${t.border}`,
    borderRadius: t.radius, padding: "20px",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
  };

  const skel = (w, h = 12) => ({
    background: "linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    borderRadius: 4, height: h, width: w,
  });

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: "#f0f0f0", padding: "0 16px 60px", fontFamily: "'Inter', sans-serif" }}>
      {/* Header skeleton */}
      <header style={{
        maxWidth: 720, margin: "0 auto", padding: "32px 0 28px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: `1px solid ${t.border}`, marginBottom: 32,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, ...skel(32, 32) }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={skel(80, 14)} />
          <div style={skel(56, 9)} />
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Input card */}
        <div style={card}>
          <div style={{ ...skel(120, 10), marginBottom: 12 }} />
          <div style={{ ...skel("100%", 120), borderRadius: t.radiusSm }} />
          <div style={{ ...skel(180, 9), marginTop: 8 }} />
        </div>

        {/* Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={card}>
            <div style={{ ...skel(40, 10), marginBottom: 12 }} />
            <div style={{ ...skel("100%", 36), borderRadius: t.radiusSm }} />
          </div>
          <div style={card}>
            <div style={{ ...skel(60, 10), marginBottom: 12 }} />
            <div style={{ ...skel("100%", 36), borderRadius: t.radiusSm }} />
          </div>
        </div>

        {/* Button */}
        <div style={{ ...skel("100%", 48), borderRadius: t.radius }} />
      </main>

      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
