import { NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request) {
  const supabase = createClientComponentClient();

  const res = await request.json();
  const today = new Date();

  const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from("practiceLog")
    .select("*")
    .eq("user_id", res.userId)
    .gt("created_at", tenDaysAgo.toISOString());

  // console.log(data);

  return NextResponse.json(data);
}
