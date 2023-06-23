import Image from "next/image";
import Dictation from "@/components/tool/dictation";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
type Word = {
  word_id: number;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
};
export default async function Home() {
  let number = 1;
  async function getData() {
    const users = await prisma.public_words.findMany();
    console.log("我在第" + number + "次调用");
    const wordList: Word[] = Array.from(users, (user) => ({
      word_id: user.word_id,
      word: user.word,
      translation: user.translation,
      primary_category: user.primary_category,
      secondary_category: user.secondary_category,
    }));
    number++;
    return wordList;
  }
  const wordList = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <Dictation wordList={wordList} />
    </main>
  );
}
