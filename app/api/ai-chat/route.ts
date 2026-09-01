import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-build",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    return Response.json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}