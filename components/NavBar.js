"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, NAV_LINKS } from "@/lib/tokens";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position:       "sticky",
      top:            0,
      zIndex:         100,
      background:     "rgba(13,13,13,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom:   `1px solid ${t.border}`,
    }}>
      <div style={{
        maxWidth:       720,
        margin:         "0 auto",
        padding:        "0 16px",
        height:         56,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill={t.accentDim}/>
            <rect x="5" y="5" width="16" height="13" rx="3" fill={t.accent}/>
            <polygon points="7,18 4,25 13,18" fill={t.accent}/>
            <polygon points="17,8 13,15 15,15 11,22 19,13 17,13" fill={t.bg}/>
          </svg>
          <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            Reply<span style={{ color: t.accent }}>Jet</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            5,
                  padding:        "6px 12px",
                  borderRadius:   t.radiusSm,
                  fontSize:       "13px",
                  fontWeight:     active ? 600 : 500,
                  color:          active ? t.accent : t.muted,
                  background:     active ? t.accentDim : "transparent",
                  textDecoration: "none",
                  transition:     "color 0.15s, background 0.15s",
                  border:         active ? `1px solid ${t.accentBorder}` : "1px solid transparent",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.surface2; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = t.muted; e.currentTarget.style.background = "transparent"; } }}
              >
                <span style={{ fontSize: 14 }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
