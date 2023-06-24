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
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-8">
      <Dictation wordList={wordList} />
    </main>
  );
}
