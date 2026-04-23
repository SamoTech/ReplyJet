import { NextResponse } from "next/server";

const TONES = ["professional", "friendly", "sales"];
const LANGUAGES = ["English", "Arabic"];

function buildSystemPrompt(tone, language) {
  const languageInstruction =
    language === "Arabic"
      ? [
          "Write in Arabic.",
          "Use clear, customer-friendly wording.",
          "Choose Egyptian Arabic for casual/customer-chat style and Modern Standard Arabic for formal/business style.",
        ].join(" ")
      : "Write in natural, clear English.";

  return [
    "You are an expert customer support agent for a modern business.",
    "Write one response to the customer message.",
    `Tone: ${tone}.`,
    languageInstruction,
    "The response must be concise, natural, persuasive, and solution-oriented.",
    "Acknowledge the customer concern, provide a helpful next step, and keep it human.",
    "Avoid fluff, repetitive phrases, and generic AI wording.",
    "Return only the final customer-facing message text.",
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
            content: buildSystemPrompt(tone, language),
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
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
