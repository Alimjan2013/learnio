import { NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "edge";
type Word = {
  word_id: string;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
};

export async function POST(request: Request) {
  const supabase = createClientComponentClient();
  const res = await request.json();
  const secondary_category = decodeURIComponent(res.bookId);
  console.log(res.bookId);

  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("secondary_category", secondary_category);

  const wordList: Word[] = Array.from(data as Word[], (user) => ({
    word_id: user.word_id,
    word: user.word,
    translation: user.translation,
    primary_category: user.primary_category,
    secondary_category: user.secondary_category,
  }));

  return NextResponse.json({ data: wordList });
}
