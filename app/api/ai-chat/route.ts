import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-build",
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert AI academic study assistant for Campus Learning Hub. Help university undergraduates understand general studies courses (GST 111, GST 112, GST 212) and engineering concepts clearly and concisely."
        },
        ...messages
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: "Failed to fetch response from AI assistant." }, { status: 500 });
  }
}