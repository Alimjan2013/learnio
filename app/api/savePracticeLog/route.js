import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

export async function POST(request) {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase.from("practiceLog").select();
  console.log(data);
  const res = await request.json();
  const userId = res.userId;
  const Log = {
    wrongAnswerList: res.wrongAnswerList,
    accuracyRate: res.accuracyRate,
  };
  const currentDate = new Date();
  const utcDate = currentDate.toISOString();
  const set = await kv.set("practiceLog/" + userId + "/" + utcDate, Log);
  // const get = await kv.scan(0, ('practiceLog/*') => {});
  return NextResponse.json(set);
}
