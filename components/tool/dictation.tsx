"use client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
type Props = {
  wordList: Word[];
};
type Word = {
  word_id: number;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
};

export default function Dictation(props: Props) {
  let wordList = [...props.wordList];
  const [currentWord, setCurrentWord] = useState<Word | undefined>(undefined);
  const [spelling, setSpelling] = useState("");

  function pickRandomWord(words: Word[]): Word | undefined {
    if (words.length === 0) return undefined;
    const index = Math.floor(Math.random() * words.length);
    setCurrentWord(words.splice(index, 1)[0]);
    return currentWord;
  }

  console.log(props.wordList);
  const handleKeyPress = (event: any) => {
    if (event.keyCode === 13) {
      if (spelling === currentWord?.word) {
        pickRandomWord(wordList);
      }
      setSpelling("");
      console.log("Enter key pressed");
    }
  };
  const handleChangeSpell = (event: any) => {
    setSpelling(event.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card>
        <CardHeader>
          <CardTitle>{currentWord?.word}</CardTitle>
          <CardDescription>{currentWord?.translation}</CardDescription>
        </CardHeader>
      </Card>
      <Input
        value={spelling}
        onChange={handleChangeSpell}
        onKeyDown={handleKeyPress}
        placeholder="Type here"
      ></Input>
      <button onClick={() => console.log(pickRandomWord(wordList))}>
        开始
      </button>
    </main>
  );
}
