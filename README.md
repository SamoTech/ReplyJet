<div align="center">

<img src="./public/banner.svg" alt="ReplyJet Banner" width="100%"/>

<br/><br/>

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq-llama--3.1--8b-orange)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Commercial-red)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-00B4D8)](https://github.com/SamoTech/ReplyJet/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?logo=github)](CONTRIBUTING.md)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<br/>

**AI-powered customer reply generator — Arabic & English, built for speed and real business outcomes.**

*Turn conversations into conversions.*

</div>

---

## What is ReplyJet?

ReplyJet detects the intent behind every customer message and generates a short, human, Egyptian-Arabic (or English) reply — instantly. No fluff. No robotic phrasing.

| Intent | Trigger signals | What happens |
|--------|----------------|-------------- |
| 😤 Angry | زعلان، غلط، هشتكي، angry, complaint, refund | Structured apology → action → order request |
| 💰 Sales | بكام، سعر، متاح، price, how much, available | Price/availability first → value → CTA |
| 💬 Normal | anything else | Direct, short answer |

---

## Features

- **Intent detection** — auto-detects angry / sales / normal from message content
- **Structured Egyptian Arabic** — sounds like a real human, not a chatbot
- **Multiple tones** — professional, friendly, sales
- **Bilingual** — Arabic (Egyptian dialect) + English
- **Copy button** — one-click reply copy with 2s confirmation
- **Intent badge** — shows detected intent on every reply (🔴 / 🟢 / 🔵)
- **RTL layout** — Arabic replies render right-to-left automatically

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|--------|
| Framework | Next.js (App Router) | 14.2.3 |
| UI | React | 18.2.0 |
| AI Provider | Groq API | `llama-3.1-8b-instant` |
| Deployment | Vercel | — |
| Language | JavaScript | ES2024 |

---

## Getting Started

```bash
git clone https://github.com/SamoTech/ReplyJet.git
cd ReplyJet
npm install
```

Create `.env.local`:

```bash
cp .env.example .env.local
# Add your GROQ_API_KEY
```

Get a free key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
ReplyJet/
├── app/
│   ├── page.js               # UI — textarea, selectors, copy button, intent badge
│   ├── layout.js             # Root layout
│   └── api/
│       └── generate/
│           └── route.js      # Intent engine + prompt builder + Groq API call
├── public/
│   ├── banner.svg            # GitHub README banner
│   ├── logo.svg              # Product logo
│   └── favicon.svg           # Browser favicon
├── .env.example              # Environment variable template
├── CONTRIBUTING.md
├── CHANGELOG.md
├── SECURITY.md
└── LICENSE
```

---

## How It Works

```
User input
   ↓
detectUserIntent()     — keyword scan → angry | sales | normal
   ↓
buildSystemPrompt()    — structured prompt per intent + language
   ↓
Groq API  (llama-3.1-8b-instant, temp=0.4, max_tokens=180)
   ↓
{ reply, tone, language, intent } → UI
```

---

## API Reference

**`POST /api/generate`**

**Request body:**

```json
{
  "message": "انا هاجي اكسر المطعم",
  "tone": "professional",
  "language": "Arabic"
}
```

| Field | Type | Values |
|-------|------|--------|
| `message` | string | Any customer message |
| `tone` | string | `professional` \| `friendly` \| `sales` |
| `language` | string | `Arabic` \| `English` |

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

**Error responses:**

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid input |
| 500 | Missing API key |
| 502 | Groq API failure |

---

## Test Cases

| # | Input | Expected Intent | Expected structure |
|---|-------|----------------|-------------------|
| 1 | `انا هاجي اكسر المطعم` | angry | Starts with حقك علينا / معلش |
| 2 | `بكام المنتج؟` | sales | Price first → value → CTA |
| 3 | `في توصيل؟` | normal | Direct short answer |

---

## Roadmap

- [x] Smart reply generator — Phase 1
- [ ] Mode buttons: close_sale / complaint / follow_up — Phase 2
- [ ] Templates library + saved replies — Phase 3
- [ ] Chrome extension + WhatsApp / Facebook integration — Phase 4

---

## Pricing

| Plan | Includes | Target |
|------|----------|--------|
| **Free** | Limited replies/day | Individuals |
| **Pro** | Unlimited replies, advanced modes, templates | Small businesses |
| **Agency** | Team usage, priority support | Agencies & enterprises |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, branching strategy, and PR rules.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## License

ReplyJet is proprietary software. All rights reserved © 2026 SamoTech.

See [LICENSE](LICENSE) for full terms.
