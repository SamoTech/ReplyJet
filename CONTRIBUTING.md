# Contributing to ReplyJet

Thank you for your interest in contributing! Please read this guide before opening a PR.

## Getting Started

```bash
git clone https://github.com/SamoTech/ReplyJet.git
cd ReplyJet
npm install
cp .env.example .env.local  # Add your GROQ_API_KEY
npm run dev
```

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — stable only |
| `feat/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation only |

## Pull Request Rules

- Branch from `main`
- One PR per feature or fix
- Write a clear title and description
- Do not touch `app/api/generate/route.js` validation logic without discussion
- Do not change the intent detection priority order (angry → sales → normal)

## Code Style

- JavaScript only (no TypeScript for now)
- No unnecessary comments in production code
- Keep API route minimal and readable
- Prompt changes must be tested against all 3 intent test cases (see README)

## Reporting Issues

Open a GitHub issue with:
- Steps to reproduce
- Expected vs actual output
- Detected intent (shown in the UI badge)

## Questions

Open a Discussion or reach out via the repo's contact.
