"use client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/wordBoard";
import { useState } from "react";
type Props = {
  wordList: Word[];
};
type TextCheckProps = {
  word: Word;
  next: any;
};
type Word = {
  word_id: number;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
};

function CheckWords(props: TextCheckProps) {
  const [spelling, setSpelling] = useState("");
  const handleChangeSpell = (event: any) => {
    setSpelling(event.target.value);
  };
  let rightAnserList: Word[] = [];
  let wrongAnserList: Word[] = [];
  const handleKeyPress = (event: any) => {
    if (event.keyCode === 13) {
      if (spelling === props.word.word) {
        rightAnserList.push(props.word);
      } else {
        wrongAnserList.push(props.word);
      }
      props.next();
      setSpelling("");
      console.log("Enter key pressed");
    }
  };
  return (
    <Input
      className="max-w-sm"
      value={spelling}
      onChange={handleChangeSpell}
      onKeyDown={handleKeyPress}
      placeholder="Type here"
    ></Input>
  );
}

export default function Dictation(props: Props) {
  let wordList = props.wordList;
  const [currentWord, setCurrentWord] = useState<Word | undefined>(undefined);
  // let currentWord = wordList[0];
  function pickRandomWord(words: Word[]): Word | undefined {
    if (words.length === 0) return undefined;
    const index = Math.floor(Math.random() * words.length);
    const randomWord = words.splice(index, 1)[0];
    speechAPI(randomWord.word);
    // currentWord = randomWord;
    setCurrentWord(randomWord);
    return currentWord;
  }

  console.log(props.wordList);

  const speechAPI = (word: string) => {
    const speechSynthesis = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance(word);

    utterance.voice = speechSynthesis.getVoices()[0];

    utterance.addEventListener("start", () => {
      console.log("Speech started");
    });

    utterance.addEventListener("end", () => {
      console.log("Speech ended");
    });

    speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>{currentWord?.word}</CardTitle>
          <CardDescription>{currentWord?.translation}</CardDescription>
        </CardHeader>
      </Card>
      <CheckWords
        word={currentWord as Word}
        next={() => pickRandomWord(wordList)}
      ></CheckWords>
      <button onClick={() => console.log(pickRandomWord(wordList))}>
        开始
      </button>
    </div>
  );
}
