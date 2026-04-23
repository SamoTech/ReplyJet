import { NextResponse } from "next/server";

const TONES     = ["professional", "friendly", "sales"];
const LANGUAGES = ["English", "Arabic"];
const MODES     = ["auto", "complaint", "close_sale", "follow_up"];

function detectUserIntent(message = "") {
  const text = message.toLowerCase();

  const angrySignals = [
    "اكسر", "هشتكي", "غلط", "تأخير", "سيء", "زفت",
    "مش راضي", "زعلان", "متضايق", "غاضب", "احتيال",
    "نصب", "استرجاع", "إلغاء",
    "angry", "bad", "complaint", "refund", "cancel", "scam",
  ];

  const salesSignals = [
    "سعر", "بكام", "متاح", "تفاصيل",
    "عايز اشتري", "عايزة اشتري", "اشتري", "خصم", "كود خصم", "عروض",
    "price", "how much", "available", "buy", "discount", "offer",
  ];

  if (angrySignals.some((s) => text.includes(s))) return "angry";
  if (salesSignals.some((s) => text.includes(s))) return "sales";
  return "normal";
}

function buildSystemPrompt(tone, language, intent) {
  const isArabic = language === "Arabic";

  // ── Language rule ────────────────────────────────────────────────────────
  const languageInstruction = isArabic
    ? [
        "You MUST reply ONLY in Egyptian Arabic (عامية مصرية).",
        "You MUST write every word using Arabic letters (أ ب ت ث …).",
        "NEVER use Latin letters, Franco-Arabic, or Arabizi.",
        "NEVER mix languages.",
        "Sound like a real human Egyptian support agent.",
        "Avoid formal Arabic (فصحى) completely.",
      ].join(" ")
    : [
        "You MUST reply ONLY in English.",
        "NEVER use Arabic letters or any other language.",
        "Sound like a real human support agent.",
      ].join(" ");

  // ── Intent/Mode rule ─────────────────────────────────────────────────────
  let intentInstruction;

  if (intent === "angry" || intent === "complaint") {
    intentInstruction = isArabic
      ? [
          "Customer is angry.",
          "You MUST follow this EXACT structure:",
          "1. Start with: 'حقك علينا على اللي حصل' OR 'معلش حصل مشكلة'.",
          "2. Then apology: 'وآسفين جدًا على الإزعاج'.",
          "3. Then action: 'خلينا نحل الموضوع فورًا'.",
          "4. Then ask: 'ممكن تبعتلنا رقم الطلب؟'.",
          "RULES: Use ONLY simple Egyptian Arabic. SHORT sentences. Do NOT change structure.",
        ].join(" ")
      : [
          "Customer is angry.",
          "Apologize sincerely and take responsibility.",
          "Offer to resolve the issue immediately.",
          "Ask for their order number to look into it.",
          "Keep it short, warm, and professional.",
        ].join(" ");

  } else if (intent === "sales" || intent === "close_sale") {
    intentInstruction = isArabic
      ? [
          "Customer wants to buy or is close to buying.",
          "Answer price/availability question FIRST.",
          "Then highlight ONE key value or benefit.",
          "End with ONE clear CTA like: 'هنبعتلك رابط الطلب دلوقتي' or 'ابعتلنا على الخاص نكمل معاك'.",
          "Keep it short, natural Egyptian Arabic.",
        ].join(" ")
      : [
          "Customer wants to buy.",
          "Answer the question FIRST (price or availability).",
          "Then highlight value.",
          "Then include ONE clear CTA.",
        ].join(" ");

  } else if (intent === "follow_up") {
    intentInstruction = isArabic
      ? [
          "This is a follow-up message to re-engage the customer.",
          "Be warm and brief.",
          "Remind them of something valuable without being pushy.",
          "End with a soft CTA like: 'لو محتاج أي حاجة احنا هنا' or 'تقدر ترد علينا في أي وقت'.",
          "Use simple natural Egyptian Arabic.",
        ].join(" ")
      : [
          "This is a follow-up to re-engage the customer.",
          "Be warm, brief, and non-pushy.",
          "Remind them of value and leave a soft CTA.",
        ].join(" ");

  } else {
    intentInstruction = [
      "Customer is asking a normal question.",
      "Answer directly and keep it short.",
    ].join(" ");
  }

  // ── Tone rule ─────────────────────────────────────────────────────────────
  const toneInstruction =
    tone === "sales" || intent === "sales" || intent === "close_sale"
      ? "Use a persuasive tone."
      : tone === "friendly"
      ? "Use a friendly tone."
      : "Use a professional tone.";

  // ── Style rule (appended to all prompts) ─────────────────────────────────
  const styleRule = isArabic
    ? [
        "RESPONSE STYLE RULE:",
        "- Use short Egyptian phrases.",
        "- No complex sentences.",
        "- No formal Arabic.",
        "- No creative wording.",
      ].join(" ")
    : "Keep replies concise and human.";

  return [
    "You are a smart customer support agent.",
    languageInstruction,
    intentInstruction,
    toneInstruction,
    styleRule,
    "Return ONLY the reply text. No labels. No explanations.",
    "STRICT RULES:",
    isArabic
      ? "- Arabic script only. Zero Latin letters. Zero Franco-Arabic."
      : "- English only. Zero Arabic letters.",
    "- Do NOT ignore the customer's question.",
    "- Do NOT invent fake details.",
    "- Keep it concise.",
  ].join(" ");
}

export async function POST(request) {
  try {
    const { message, tone, language, maxTokens, mode } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000 chars)." }, { status: 400 });
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

    const safeTokens = Math.min(Math.max(Number(maxTokens) || 180, 60), 400);

    // Mode override: if mode is not "auto", use it directly as intent
    const intent = (mode && mode !== "auto" && MODES.includes(mode))
      ? mode
      : detectUserIntent(message);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: safeTokens,
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
      return NextResponse.json({ error: "AI failed", details: errorText }, { status: 502 });
    }

    const data  = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "No reply generated." }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      data: { reply, tone, language, intent, mode: mode || "auto" },
    });
  } catch (err) {
    console.error("[generate] error:", err);
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
