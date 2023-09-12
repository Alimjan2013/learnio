import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../supabase";
import PracticeLog from "./PracticeLog";
import Top100 from "./Top100";

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      <Top100></Top100>
      <PracticeLog session={session} />
    </div>
  );
}
