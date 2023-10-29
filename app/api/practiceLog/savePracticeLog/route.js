import { NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request) {
  const supabase = createClientComponentClient();

  const res = await request.json();
  const { data, error } = await supabase
    .from("practiceLog")
    .insert([
      {
        wrong_answer_list: res.wrongAnswerList,
        user_id: res.userId,
        accuracy_rate: res.accuracyRate,
      },
    ])
    .select();
  console.log(data);

  return NextResponse.json(data);
}
