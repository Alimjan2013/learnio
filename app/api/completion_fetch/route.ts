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
        content: `As an English teacher, you need help students check their grammar in sentence. 
this is Output Rule: 	
* Identify the incorrect part within parentheses ().
* Replace it with the correct word or phrase within brackets 【】.
* Identify any unnecessary words or phrases within <>.
* Try not to modify too many consecutive parts at once.
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
  const url = "https://api.openai.com/v1/chat/completions";

  const AIReturn = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(openAIbody),
  });
  const Back = await AIReturn.json();
  return NextResponse.json(Back);
}
