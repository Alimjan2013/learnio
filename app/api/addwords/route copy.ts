import { NextResponse } from "next/server";
import { nanoid } from "nanoid/non-secure";
import { kv } from "@vercel/kv";
export const runtime = "edge";

type Word = {
  word_id: string;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
};

const makeWordList = (
  wordString: string,
  primary_category: string,
  secondary_category: string
) => {
  const items = wordString.split("\n");
  const jsonArray = [];
  for (const item of items) {
    const [word, translate] = item.split(" ");
    jsonArray.push({
      word_id: nanoid(),
      word: word,
      translation: translate,
      primary_category: primary_category,
      secondary_category: secondary_category,
    });
  }
  return jsonArray;
};

export async function POST(request: Request) {
  const res = await request.json();
  const wordList = makeWordList(
    res.list,
    res.primary_category,
    res.secondary_category
  ) as Word[];
  console.log(wordList);
  const set = await kv.set("测试/章节五", wordList);
  console.log(set);
  return NextResponse.json({ wordList });
}
