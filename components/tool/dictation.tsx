"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../app/supabase";
import WordTable from "@/components/tool/wordTable";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"


import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/wordBoard";
import { useState } from "react";

import { speechAPI } from "../../lib/utils";

type TextCheckProps = {
  word: Word;
  next: any;
  onAnswer: (isCorrect: boolean, spelling: string) => void;
};

type Word = {
  word_id: number;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
  user_input?: string;
};

function CheckWords(props: TextCheckProps) {
  const [spelling, setSpelling] = useState("");
  const handleChangeSpell = (event: any) => {
    setSpelling(event.target.value);
  };

  const handleKeyPress = (event: any) => {
    if (event.keyCode === 13) {
      const isCorrect = (spelling: string, word: string) => {
        const wordOne = spelling.trim().toUpperCase();
        const wordTwo = word.trim().toUpperCase();
        if (wordOne === wordTwo) {
          return true;
        }
        return false;
      };
      props.onAnswer(isCorrect(spelling, props.word.word), spelling);
      props.next();
      setSpelling("");
    }
  };

  return (
    <Input
      className="max-w-sm"
      value={spelling}
      disabled={wordList.length > 0 ? false : true}
      onChange={handleChangeSpell}
      onKeyDown={handleKeyPress}
      placeholder="Type here"
    ></Input>
  );
}

type WordCardProps = {
  word: Word | undefined;
};
export function WordCard(props: WordCardProps) {
  const [isShow, setIsShow] = useState(false);
  const handleShow = () => {
    setIsShow(true);
    setTimeout(() => {
      setIsShow(false);
    }, 1000);
  };
  let card;
  if (props.word !== undefined) {
    card = (
      <CardHeader
        onClick={() => {
          handleShow();
        }}
      >
        <CardTitle>
          {isShow ? props.word.word : "*".repeat(props.word.word.length)}
        </CardTitle>
        <CardDescription>{props.word.translation}</CardDescription>
        <Progress value={(1 - wordList.length / wordListCopy.length) * 100} />
      </CardHeader>
    );
  } else {
    card = (
      <CardHeader>
        <CardTitle>start please</CardTitle>
        <CardDescription>请开始</CardDescription>
      </CardHeader>
    );
  }
  return <Card className="w-80">{card}</Card>;
}

let wordList: Word[] = [];
let wordListCopy: Word[] = [];
export default function Dictation(props: { id: string }) {
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false);
  async function getUser() {
    const supabase = createClientComponentClient<Database>();
    const { data: session } = await supabase.auth.getSession();
    console.log(session.session?.user.id);
    return session.session?.user.id;
  }
  async function upDatePracticeLog() {
    setIsLoading(true);
    const userId = await getUser();
    const wrongAnswerListCopy = wrongAnswerList;
    const accuracyRate = (
      (1 - wrongAnswerList.length / (wordListCopy.length - wordList.length)) *
      100
    ).toFixed(2);
    const res = await fetch("/api/practiceLog/savePracticeLog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        wrongAnswerList: wrongAnswerListCopy,
        accuracyRate: accuracyRate,
        name: "hello",
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    toast({
      title: "successful update",
      description: "已成功提交到听写列表",
    })
    setIsLoading(false);
    console.log(res);
    return res.json();
  }

  const [currentWord, setCurrentWord] = useState<Word | undefined>(undefined);
  const [rightAnswerList, setRightAnswerList] = useState<Word[]>([]);
  const [wrongAnswerList, setWrongAnswerList] = useState<Word[]>([]);
  async function getData(bookId: string) {
    const res = await fetch("/api/getwords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: bookId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  }

  async function getWordList(bookId: string) {
    const data = await getData(bookId);
    wordList = [...data.data];
    wordListCopy = [...data.data];
    pickRandomWord(wordList);
  }

  function pickRandomWord(words: Word[]): Word | undefined {
    console.log(wordListCopy);
    console.log(wordList);
    if (words.length === 0) return undefined;
    const index = Math.floor(Math.random() * words.length);
    const randomWord = words.splice(index, 1)[0];
    speechAPI(randomWord.word, 1);
    setCurrentWord(randomWord);
    return currentWord;
  }

  const handleAnswer = (isCorrect: boolean, spelling: string) => {
    if (isCorrect) {
      setRightAnswerList([...rightAnswerList, currentWord as Word]);
    } else {
      const currentWordCopy = { ...currentWord } as Word;
      currentWordCopy.user_input = spelling;
      setWrongAnswerList([currentWordCopy, ...wrongAnswerList]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8">
      <WordCard word={currentWord as Word}></WordCard>
      <CheckWords
        word={currentWord as Word}
        next={() => pickRandomWord(wordList)}
        onAnswer={handleAnswer}
      ></CheckWords>
      <WordTable
        wrongAnswerList={wrongAnswerList}
        accuracyRate={parseFloat(
          (
            (1 -
              wrongAnswerList.length /
                (wordListCopy.length - wordList.length)) *
            100
          ).toFixed(2)
        )}
      ></WordTable>
      <Button
        onClick={() => {
          getWordList(props.id);
          setWrongAnswerList([]);
          getUser();
        }}
        variant="outline"
      >
        开始
      </Button>
      {wordList.length > 0 ? (
        ""
      ) : (
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => upDatePracticeLog()}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}
          提交
        </Button>
      )}
    </div>
  );
}
