import { NextResponse } from "next/server";

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const openAIbody = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `As an English teacher, you need to help students check their grammar in sentences.
        This is the Output Rule:
        
        * Identify any grammatical, spelling or word choice errors within parentheses ().
        * Replace the text in parentheses with the correct word or phrase within brackets 【】.
        * Identify any unnecessary or redundant words or phrases within <>.
        * Try not to modify too many consecutive parts at once. Keep changes minimal.
`,
      },
      {
        role: "user",
        content: `Many students who graduate from university don't know how to manage money, and there is the reason that they have not recieved enough knowledge from economic education. `,
      },
      {
        role: "assistant",
        content: `Many students who graduate from university don't know how to manage money, and there (is the reason that)【because】 they have not (recieved)【received】 enough <knowledge from> (economic)【financial】 education. `,
      },
      { role: "user", content: prompt },
    ],
  };
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  });
  const url = "https://cn.gptapi.asia/v1/chat/completions";

  const AIReturn = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(openAIbody),
  });
  const Back = await AIReturn.json();
  console.log(Back);
  return NextResponse.json(Back);
}
