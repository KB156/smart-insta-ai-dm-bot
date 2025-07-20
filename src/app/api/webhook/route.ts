// src/app/api/webhook/route.ts

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const userMessage = body?.message?.text;

  if (!userMessage) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful Instagram assistant. Answer in a friendly tone.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const groqData = await groqRes.json();
    const reply = groqData?.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "AI processing failed." }, { status: 500 });
  }
}