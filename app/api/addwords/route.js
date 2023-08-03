import { NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const makeWordList = (wordString, primary_category, secondary_category) => {
  const items = wordString.split("\n");
  const jsonArray = [];
  for (const item of items) {
    const [word, translate] = item.split(" ");
    jsonArray.push({
      word: word,
      translation: translate,
      primary_category: primary_category,
      secondary_category: secondary_category,
    });
  }
  return jsonArray;
};
export async function POST(request) {
  const supabase = createClientComponentClient();
  const res = await request.json();
  const wordList = makeWordList(
    res.list,
    res.primary_category,
    res.secondary_category
  );
  console.log("im working in addwordAPI");
  const { data, error } = await supabase
    .from("words")
    .insert(wordList)
    .select();
  console.log(data);

  return NextResponse.json(data);
}
