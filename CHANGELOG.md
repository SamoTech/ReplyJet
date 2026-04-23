# Changelog

All notable changes to ReplyJet are documented here.

Format: [Semantic Versioning](https://semver.org)

---

## [1.0.0] — 2026-04-23

### Added
- AI-powered reply generation via Groq API (`llama-3.1-8b-instant`)
- Intent detection engine — angry / sales / normal
- Structured Egyptian Arabic prompt for angry mode
- Bilingual support — Arabic (Egyptian dialect) + English
- Tone selector — professional / friendly / sales
- Copy button with clipboard fallback
- Intent badge displayed on every generated reply
- RTL layout support for Arabic replies
- Full input validation on API route
- Structured JSON response: `{ success, data: { reply, tone, language, intent } }`

---

## Upcoming

### [1.1.0] — Phase 2
- Mode buttons: close_sale / complaint / follow_up

### [1.2.0] — Phase 3
- Templates library
- Saved replies

### [2.0.0] — Phase 4
- Chrome extension
- WhatsApp / Facebook integration
