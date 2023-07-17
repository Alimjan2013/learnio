// const { Configuration, OpenAIApi } = require("openai");

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  //   const response = await openai.createCompletion({
  //     model: "gpt-3.5-turbo",
  //     stream: true,
  //     temperature: 0.6,
  //     prompt: `As an English teacher, you need help students check their grammar in sentence.
  //     this is Output Rule:
  //     * Identify the incorrect part within parentheses ().
  //     * Replace it with the correct word or phrase within brackets 【】.
  //     * Identify any unnecessary words or phrases within <>.
  //     * Try not to modify too many consecutive parts at once.

  //     For example:

  //     Student: Many students who graduate from university don't know how to manage money, and there is the reason that they have not recieved enough knowledge from economic education.

  //     Teacher output: Many students who graduate from university don't know how to manage money, and there (is the reason that)【because】 they have not (recieved)【received】 enough <knowledge from> (economic)【financial】 education.

  //     ———
  //     This is sentence from student:
  //     Student: ${prompt}
  //     Teacher output:`,
  //   });

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello world" },
    ],
  });
  console.log(completion);
  // Convert the response into a friendly text-stream
  //   const stream = OpenAIStream(completion);
  // Respond with the stream
  return completion;
}
