# ReplyJet 🚀

AI-powered customer reply generator — Arabic & English, built for speed and real business outcomes.

> Turn conversations into conversions.

---

## What is ReplyJet?

ReplyJet detects the intent behind every customer message and generates a short, human, Egyptian-Arabic (or English) reply — instantly. No fluff. No robotic phrasing.

| Intent | What happens |
|--------|-------------|
| 😤 Angry | Structured apology → action → order request |
| 💰 Sales | Price/availability first → value → CTA |
| 💬 Normal | Direct, short answer |

---

## Features

- **Intent detection** — auto-detects angry / sales / normal signals
- **Structured Egyptian Arabic** — sounds like a real human, not a chatbot
- **Multiple tones** — professional, friendly, sales
- **Bilingual** — Arabic (Egyptian dialect) + English
- **Copy button** — one-click reply copy
- **Intent badge** — shows detected intent on every reply

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| AI | Groq API — `llama-3.1-8b-instant` |
| Deployment | Vercel |
| Language | JavaScript |

---

## Getting Started

```bash
npm install
npm run dev
```

Create `.env.local`:

```
GROQ_API_KEY=your_key_here
```

Get a free key at [console.groq.com](https://console.groq.com).

---

## Project Structure

```
app/
├── page.js               # Main UI — textarea, tone/language selectors, copy button
├── layout.js             # Root layout
└── api/
    └── generate/
        └── route.js      # Intent detection + prompt engine + Groq API call
```

---

## How It Works

```
User input
   ↓
detectUserIntent()     — scans for angry/sales signals
   ↓
buildSystemPrompt()    — constructs structured prompt per intent
   ↓
Groq API (llama-3.1-8b-instant)
   ↓
Reply + intent badge returned to UI
```

---

## API

**POST** `/api/generate`

**Request:**
```json
{
  "message": "انا هاجي اكسر المطعم",
  "tone": "professional",
  "language": "Arabic"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "حقك علينا على اللي حصل، وآسفين جدًا على الإزعاج. خلينا نحل الموضوع فورًا — ممكن تبعتلنا رقم الطلب؟",
    "tone": "professional",
    "language": "Arabic",
    "intent": "angry"
  }
}
```

**Validation:** `tone` must be `professional | friendly | sales`. `language` must be `Arabic | English`.

---

## Roadmap

- [x] Smart reply generator (Phase 1)
- [ ] Mode buttons — close_sale / complaint / follow_up (Phase 2)
- [ ] Templates library + saved replies (Phase 3)
- [ ] Chrome extension + WhatsApp / Facebook integration (Phase 4)

---

## Monetization

| Plan | Includes |
|------|----------|
| Free | Limited replies/day |
| Pro | Unlimited replies, advanced modes, templates |
| Agency | Team usage, priority support |

---

## License

MIT
