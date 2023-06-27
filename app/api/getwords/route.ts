import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Word = {
  word_id: string;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
};

export async function POST(request: Request) {
  const res = await request.json();
  console.log(res.bookId);
  const cart: Word[] = (await kv.get(
    `测试/章节${decodeURIComponent(res.bookId)}`
  )) as Word[];

  const wordList: Word[] = Array.from(cart as Word[], (user) => ({
    word_id: user.word_id,
    word: user.word,
    translation: user.translation,
    primary_category: user.primary_category,
    secondary_category: user.secondary_category,
  }));

  return NextResponse.json({ data: wordList });
}
