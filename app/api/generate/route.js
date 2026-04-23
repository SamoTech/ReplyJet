import { NextResponse } from "next/server";

const TONES = ["professional", "friendly", "sales"];
const LANGUAGES = ["English", "Arabic"];

function detectUserIntent(message = "") {
  const text = message.toLowerCase();

  const angrySignals = [
    "اكسر",
    "هشتكي",
    "غلط",
    "تأخير",
    "سيء",
    "زفت",
    "مش راضي",
    "زعلان",
    "متضايق",
    "غاضب",
    "احتيال",
    "نصب",
    "استرجاع",
    "إلغاء",
    "angry",
    "bad",
    "complaint",
    "refund",
    "cancel",
    "scam",
  ];

  const salesSignals = [
    "سعر",
    "بكام",
    "متاح",
    "تفاصيل",
    "price",
    "how much",
    "available",
  ];

  const isAngry = angrySignals.some((s) => text.includes(s));
  const isSales = salesSignals.some((s) => text.includes(s));

  let intent = "normal";

  if (isAngry) intent = "angry";
  else if (isSales) intent = "sales";

  return intent;
}

function buildSystemPrompt(tone, language, intent) {
  const isArabic = language === "Arabic";

  const languageInstruction = isArabic
    ? [
        "Write in natural Egyptian Arabic (عامية مصرية).",
        "Keep it human, simple, and natural.",
        "Avoid formal Arabic and translations.",
      ].join(" ")
    : "Write in natural conversational English.";

  const intentInstruction =
    intent === "angry"
      ? [
          "Customer is angry.",
          "Start with empathy like: حقك علينا or معلش حصل مشكلة.",
          "Calm them down, take responsibility, fix the issue.",
          "Ask for details to solve quickly.",
          "Never sound robotic or defensive.",
        ].join(" ")
      : intent === "sales"
      ? [
          "Customer has buying intent.",
          "Be persuasive but natural.",
          "Highlight value clearly.",
          "Answer price or availability directly.",
          "End with one clear CTA.",
        ].join(" ")
      : "Customer is normal. Respond clearly and helpfully.";

  const toneInstruction =
    tone === "sales" || intent === "sales"
      ? "Use persuasive tone."
      : tone === "friendly"
      ? "Use friendly human tone."
      : "Use professional calm tone.";

  return [
    "You are a smart customer support and sales agent.",
    languageInstruction,
    intentInstruction,
    toneInstruction,
    "Reply naturally like a real human.",
    "Keep it short and useful.",
    "Return only the reply.",
  ].join(" ");
}

export async function POST(request) {
  try {
    const { message, tone, language } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!TONES.includes(tone)) {
      return NextResponse.json({ error: "Invalid tone." }, { status: 400 });
    }

    if (!LANGUAGES.includes(language)) {
      return NextResponse.json({ error: "Invalid language." }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Missing API key." }, { status: 500 });
    }

    const intent = detectUserIntent(message);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.5,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(tone, language, intent),
          },
          {
            role: "user",
            content: message.trim(),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "AI failed", details: errorText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "No reply generated." }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      data: {
        reply,
        tone,
        language,
        intent,
      },
    });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}