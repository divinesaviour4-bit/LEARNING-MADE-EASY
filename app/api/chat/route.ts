import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, userToken } = await req.json();

    if (!userToken) {
      return NextResponse.json({ error: "Access token required." }, { status: 401 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: messages,
      temperature: 0.7,
      max_completion_tokens: 500,
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
