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
    "angry",
    "bad",
    "complaint",
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

  const isAngry = angrySignals.some((signal) => text.includes(signal));
  const isSales = salesSignals.some((signal) => text.includes(signal));

  let intent = "normal";

  if (isAngry) intent = "angry";
  else if (isSales) intent = "sales";

  return intent;
}

function buildSystemPrompt(tone, language, intent) {
  const isArabic = language === "Arabic";

  const languageInstruction = isArabic
    ? [
        "Write in natural Egyptian Arabic (عامية مصرية) by default.",
        "Keep the wording human, warm, and realistic like a real support agent.",
        "Avoid robotic phrasing, stiff MSA, and literal translations.",
        "Use simple words customers actually use in chat.",
      ].join(" ")
    : "Write in natural, clear English with human wording.";

  const intentInstruction =
    intent === "angry"
      ? [
          "The customer is angry or frustrated.",
          "Start with empathy in Egyptian Arabic like: حقك علينا or معلش حصل مشكلة.",
          "De-escalate calmly, take responsibility, offer an immediate fix, and ask for missing details.",
          "Do not sound defensive or blame the customer.",
        ].join(" ")
      : intent === "sales"
      ? [
          "The customer has sales intent and is evaluating buying.",
          "Be persuasive but natural, highlight value clearly, reduce hesitation, and include one clear CTA.",
          "If the customer asked about price or availability, answer directly before the CTA.",
        ].join(" ")
      : "The customer is normal. Respond clearly, directly, and helpfully.";

  const toneInstruction =
    tone === "sales" || intent === "sales"
      ? "Use persuasive but respectful sales language and include one clear call to action."
      : tone === "friendly"
      ? "Use a friendly, conversational, human tone."
      : "Use a professional, concise support tone.";

  return [
    "You are an expert customer support agent for a modern business.",
    `Tone: ${tone}.`,
    languageInstruction,
    intentInstruction,
    toneInstruction,
    "Write one customer-facing reply only.",
    "The response must be concise, natural, solution-oriented, and non-robotic.",
    "Acknowledge the issue, provide a practical next step, and keep trust high.",
    "Return only the final reply text.",
  ].join(" ");
}

export async function POST(request) {
  try {
    const { message, tone, language } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!TONES.includes(tone)) {
      return NextResponse.json({ error: "Invalid tone value." }, { status: 400 });
    }

    if (!LANGUAGES.includes(language)) {
      return NextResponse.json({ error: "Invalid language value." }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Server is missing GROQ_API_KEY." }, { status: 500 });
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
        max_tokens: 220,
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
        { error: "Failed to generate reply.", details: errorText },
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
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
