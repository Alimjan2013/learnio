import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../supabase";
import AccountForm from "./account-form";
import PracticeLog from "./PracticeLog";

export default async function Account() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      {/* <AccountForm session={session} /> */}
      <PracticeLog session={session} />
    </div>
  );
}
