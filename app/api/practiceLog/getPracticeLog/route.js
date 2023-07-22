import { NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request) {
  const supabase = createClientComponentClient();

  const res = await request.json();
  const { data, error } = await supabase
    .from("practiceLog")
    .select("*")
    .eq("user_id", res.userId);
  // console.log(data);

  return NextResponse.json(data);
}
