# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x | ✅ Yes |

## Reporting a Vulnerability

If you discover a security vulnerability in ReplyJet, please **do not** open a public GitHub issue.

Instead, contact us privately:

1. Email: security@samotech.io *(or open a private GitHub Security Advisory)*
2. Include: description, steps to reproduce, potential impact
3. We will respond within 48 hours

## Known Security Considerations

- `GROQ_API_KEY` must never be committed — use `.env.local` only
- The API route validates all inputs (tone, language, message) before calling Groq
- No user data is stored or logged
