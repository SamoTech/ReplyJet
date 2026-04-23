// ── ReplyJet Design Tokens ───────────────────────────────────────────
export const t = {
  bg:           "#0d0d0d",
  surface:      "#141414",
  surface2:     "#1a1a1a",
  border:       "rgba(255,255,255,0.08)",
  borderHov:    "rgba(255,255,255,0.16)",
  text:         "#f0f0f0",
  muted:        "#888",
  faint:        "#444",
  accent:       "#00B4D8",
  accentHov:    "#0096b4",
  accentDim:    "rgba(0,180,216,0.12)",
  accentBorder: "rgba(0,180,216,0.2)",
  error:        "#ff6b6b",
  errorDim:     "rgba(255,107,107,0.1)",
  warning:      "#f59e0b",
  warningDim:   "rgba(245,158,11,0.1)",
  success:      "#4ade80",
  successDim:   "rgba(74,222,128,0.1)",
  radius:       "10px",
  radiusSm:     "6px",
  shadow:       "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
};

export const card = {
  background:   t.surface,
  border:       `1px solid ${t.border}`,
  borderRadius: t.radius,
  padding:      "20px",
  boxShadow:    t.shadow,
};

export const labelStyle = {
  display:       "block",
  fontSize:      "12px",
  fontWeight:    600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color:         t.muted,
  marginBottom:  "8px",
};

export const segmentBase = (active) => ({
  flex:           1,
  padding:        "8px 4px",
  fontSize:       "13px",
  fontWeight:     active ? 600 : 400,
  color:          active ? t.accent : t.muted,
  background:     active ? t.accentDim : "transparent",
  border:         "none",
  borderRadius:   t.radiusSm,
  cursor:         "pointer",
  transition:     "all 0.15s ease",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  gap:            "6px",
  fontFamily:     "inherit",
});

export const TONES = [
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "friendly",     label: "Friendly",     icon: "😊" },
  { value: "sales",        label: "Sales",        icon: "🎯" },
];

export const LANGUAGES = [
  { value: "Arabic",  label: "Arabic",  flag: "🇪🇬" },
  { value: "English", label: "English", flag: "🇬🇧" },
];

export const MODES = [
  { value: "auto",       label: "Auto",       icon: "✨", description: "Detect intent automatically" },
  { value: "complaint",  label: "Complaint",  icon: "😤", description: "Handle angry customers"     },
  { value: "close_sale", label: "Close Sale", icon: "💰", description: "Convert & sell"             },
  { value: "follow_up",  label: "Follow Up",  icon: "📩", description: "Re-engage the customer"     },
];

export const INTENTS = {
  angry:      { label: "Angry",     icon: "😤", color: "#f87171", dim: "rgba(248,113,113,0.12)" },
  sales:      { label: "Sales",     icon: "💰", color: "#4ade80", dim: "rgba(74,222,128,0.12)"  },
  normal:     { label: "Normal",    icon: "💬", color: "#60a5fa", dim: "rgba(96,165,250,0.12)"  },
  complaint:  { label: "Complaint", icon: "😤", color: "#f87171", dim: "rgba(248,113,113,0.12)" },
  close_sale: { label: "Close Sale",icon: "💰", color: "#4ade80", dim: "rgba(74,222,128,0.12)"  },
  follow_up:  { label: "Follow Up", icon: "📩", color: "#c084fc", dim: "rgba(192,132,252,0.12)" },
};

export const NAV_LINKS = [
  { href: "/templates", label: "Templates", icon: "📋" },
  { href: "/history",   label: "History",   icon: "🕑" },
  { href: "/settings",  label: "Settings",  icon: "⚙️" },
  { href: "/about",     label: "About",     icon: "ℹ️" },
];

export const PREFS_KEY   = "replyjet_prefs";
export const HISTORY_KEY = "replyjet_history";
export const HISTORY_MAX = 50;

export const DEFAULT_PREFS = {
  defaultTone:     "professional",
  defaultLanguage: "Arabic",
  maxTokens:       180,
};

/** Read prefs from localStorage (safe — returns DEFAULT_PREFS on error) */
export function loadPrefs() {
  try {
    const raw = typeof window !== "undefined" && localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

/** Save prefs to localStorage (safe — silent fail) */
export function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...DEFAULT_PREFS, ...prefs }));
  } catch { /* silent fail */ }
}

/** Save a history entry (newest first, capped at HISTORY_MAX) */
export function saveToHistory({ message, tone, language, reply, intent, mode }) {
  try {
    const entry = { id: Date.now(), ts: Date.now(), message, tone, language, reply, intent, mode };
    const prev  = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...prev].slice(0, HISTORY_MAX)));
  } catch { /* silent fail */ }
}
