# Changelog

All notable changes to ReplyJet are documented here.

Format: [Semantic Versioning](https://semver.org)

---

## [1.2.0] — 2026-04-24

### Added
- Mode selector — `auto / complaint / close_sale / follow_up` with 4-button grid UI
- Mode override: selected mode skips auto-detection and forces intent directly
- Dedicated Egyptian Arabic prompts for `close_sale` (price-first + CTA) and `follow_up` (warm + soft CTA)
- `complaint` and `close_sale` and `follow_up` intent badges with distinct colors
- `mode` field saved to history entries
- Mode description hint shown below selector when non-auto mode is active

---

## [1.1.0] — 2026-04-24

### Added
- Regenerate button in reply card — re-calls API without clearing current reply
- Reply dims to `opacity: 0.4` during regeneration for visual feedback
- Spin animation on regenerate icon while loading
- `isBusy` guard — prevents double-click on Generate and Regenerate simultaneously
- Settings page — defaultTone, defaultLanguage, maxTokens saved to localStorage
- History page — last 50 replies with intent badge, copy, and clear all
- Character counter with color transition (faint → warning at 800+ → error at 1000+)
- `Ctrl+Enter` keyboard shortcut to generate
- About page
- NavBar with History / Settings / About links

### Changed
- `saveToHistory` now stores `mode` field alongside intent

---

## [1.0.0] — 2026-04-23

### Added
- AI-powered reply generation via Groq API (`llama-3.1-8b-instant`)
- Intent detection engine — angry / sales / normal
- Structured Egyptian Arabic prompt for angry intent
- Bilingual support — Arabic (Egyptian dialect) + English
- Tone selector — professional / friendly / sales
- Copy button with clipboard fallback and 2s confirmation state
- Intent badge displayed on every generated reply
- RTL layout support for Arabic replies
- Full input validation on API route
- Structured JSON response: `{ success, data: { reply, tone, language, intent } }`
- `RESPONSE STYLE RULE` appended to all Arabic prompts — no formal Arabic, no complex sentences

---

## Upcoming

### [1.3.0] — Phase 3
- Templates library — pre-built reply templates per intent
- Saved replies — bookmark and reuse replies

### [2.0.0] — Phase 4
- Chrome extension
- WhatsApp / Facebook integration
