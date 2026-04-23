"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { t, card, labelStyle, segmentBase } from "@/lib/tokens";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";

export default function TemplatesPage() {
  const router   = useRouter();
  const [filter, setFilter]   = useState("all");
  const [copied, setCopied]   = useState(null);
  const [search, setSearch]   = useState("");

  const filtered = TEMPLATES.filter((tpl) => {
    const matchCat  = filter === "all" || tpl.category === filter;
    const matchText = !search || tpl.label.toLowerCase().includes(search.toLowerCase()) ||
                      tpl.preview.toLowerCase().includes(search.toLowerCase()) ||
                      tpl.text.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  const handleUse = (tpl) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rj_template", tpl.text);
    }
    router.push("/");
  };

  const handleCopy = async (tpl) => {
    try { await navigator.clipboard.writeText(tpl.text); }
    catch {
      const el = document.createElement("textarea");
      el.value = tpl.text; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(tpl.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const catColors = {
    complaint:  { color: "#f87171", dim: "rgba(248,113,113,0.1)" },
    close_sale: { color: "#4ade80", dim: "rgba(74,222,128,0.1)"  },
    follow_up:  { color: "#c084fc", dim: "rgba(192,132,252,0.1)" },
    normal:     { color: "#60a5fa", dim: "rgba(96,165,250,0.1)"  },
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text }}>
      <NavBar />

      {/* Header */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 8px" }}>
          📋 Templates
        </h1>
        <p style={{ fontSize: "14px", color: t.muted, margin: 0 }}>
          جمل جاهزة — اختار وابعت فوراً
        </p>
      </div>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search templates..."
          style={{
            width: "100%", background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: t.radius, color: t.text, fontSize: "14px",
            padding: "12px 16px", outline: "none", fontFamily: "inherit",
            boxSizing: "border-box", transition: "border-color 0.15s",
          }}
          onFocus={(e)  => (e.target.style.borderColor = t.accent)}
          onBlur={(e)   => (e.target.style.borderColor = t.border)}
        />

        {/* Category filter */}
        <div style={card}>
          <label style={labelStyle}>Category</label>
          <div style={{ display: "flex", flexWrap: "wrap", background: t.surface2, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => setFilter(cat.value)} style={{ ...segmentBase(filter === cat.value), flex: "none", padding: "7px 14px" }}>
                <span>{cat.icon}</span><span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p style={{ margin: 0, fontSize: "12px", color: t.faint }}>
          {filtered.length} template{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ ...card, textAlign: "center", padding: "48px 24px", color: t.muted }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <p style={{ margin: 0 }}>No templates found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {filtered.map((tpl) => {
              const meta = catColors[tpl.category] || catColors.normal;
              const isCopied = copied === tpl.id;
              return (
                <div
                  key={tpl.id}
                  style={{
                    ...card,
                    display: "flex", flexDirection: "column", gap: 10,
                    border: `1px solid ${t.border}`,
                    padding: "16px",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = meta.color + "50")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: t.text }}>{tpl.label}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: t.muted }}>{tpl.preview}</p>
                    </div>
                    <span style={{
                      flexShrink: 0, fontSize: "10px", fontWeight: 700, padding: "3px 8px",
                      borderRadius: 999, background: meta.dim, color: meta.color,
                      letterSpacing: "0.05em", textTransform: "uppercase",
                    }}>
                      {TEMPLATE_CATEGORIES.find(c => c.value === tpl.category)?.icon}{" "}
                      {TEMPLATE_CATEGORIES.find(c => c.value === tpl.category)?.label}
                    </span>
                  </div>

                  {/* Text preview */}
                  <div style={{
                    background: t.surface2, border: `1px solid ${t.border}`,
                    borderRadius: t.radiusSm, padding: "10px 12px",
                    fontSize: "13px", lineHeight: 1.65, color: t.muted,
                    direction: /[\u0600-\u06FF]/.test(tpl.text) ? "rtl" : "ltr",
                  }}>
                    {tpl.text}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <button
                      onClick={() => handleUse(tpl)}
                      style={{
                        flex: 1, padding: "8px", background: t.accent, color: "#000",
                        border: "none", borderRadius: t.radiusSm, fontSize: "12px",
                        fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = t.accentHov)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = t.accent)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      Use
                    </button>
                    <button
                      onClick={() => handleCopy(tpl)}
                      style={{
                        padding: "8px 14px",
                        background: isCopied ? t.successDim : t.surface2,
                        color:      isCopied ? t.success    : t.muted,
                        border:     `1px solid ${isCopied ? t.success + "40" : t.border}`,
                        borderRadius: t.radiusSm, fontSize: "12px",
                        fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 5,
                        transition: "all 0.15s",
                      }}
                    >
                      {isCopied ? (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
                      ) : (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
