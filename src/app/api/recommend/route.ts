import { NextRequest, NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import cards from "@/data/cards.json";
import { buildPrompt } from "@/lib/promptBuilder";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { preferences } = await req.json();

    if (!preferences || !Array.isArray(preferences)) {
      return NextResponse.json(
        { error: "Invalid preferences" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(preferences, cards);

    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      system: "You are a helpful credit card advisor for Indian users.",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.content[0]?.text.trim();
    console.log("Claude response:", reply);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 }
    );
  }
}
