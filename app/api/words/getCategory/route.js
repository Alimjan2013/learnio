import { NextResponse } from "next/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("category")
    .select("second_category");
  // console.log(data);

  return NextResponse.json(data);
}
