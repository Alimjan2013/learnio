import { kv } from "@vercel/kv";
import Link from "next/link";

export default async function DictationPage() {
  // const wordList = await getData();
  const wordListIndex = (await kv.get("wordListIndex")) as Array<string>;
  console.log(typeof wordListIndex);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-8">
      {wordListIndex.map((item) => (
        <Link key={item} href={`dictation/pages/${item}`}>
          章节{item}
        </Link>
      ))}
    </main>
  );
}
