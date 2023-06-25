import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Word = {
  word_id: number;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
};
export async function GET() {
  const users = await prisma.public_words.findMany();
  const wordList: Word[] = Array.from(users, (user) => ({
    word_id: user.word_id,
    word: user.word,
    translation: user.translation,
    primary_category: user.primary_category,
    secondary_category: user.secondary_category,
  }));

  return NextResponse.json({ data: wordList });
}
