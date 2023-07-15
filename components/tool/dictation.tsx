"use client";
import { Input } from "@/components/ui/input";
import { diffChars } from "diff";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../app/supabase";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/wordBoard";
import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { speechAPI } from "../../lib/utils";

const getDifferences = (word1: string, word2: string) => {
  const differences = diffChars(word1, word2);
  return differences;
};
const checkIsMinorErorr = (differences: any[]) => {
  const newArray = differences.map((obj, index) => ({
    ...obj,
    OrigenIndex: index,
  }));
  const filteredArray = newArray.filter((item) => item.count === 1);
  let count = 0;
  let indexs = [];
  for (let i = 0; i < filteredArray.length; i++) {
    if (filteredArray[i].removed === true) {
      count++;
      indexs.push(filteredArray[i]);
    }
    if (filteredArray[i].added === true) {
      count++;
      indexs.push(filteredArray[i]);
    }
  }
  if (count === 1) {
    return true;
  }
  if (count === 2) {
    if (
      indexs[0].OrigenIndex - indexs[1].OrigenIndex === 1 ||
      indexs[0].OrigenIndex - indexs[1].OrigenIndex === -1
    ) {
      return true;
    }
  }
  return false;
};

export function WordTable(props: TableProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Table>
      <TableCaption>
        A list of your Wrong answer. Total:
        {props.wrongAnswerList.length} ;{" "}
        {(
          (1 -
            props.wrongAnswerList.length /
              (wordListCopy.length - wordList.length)) *
          100
        ).toFixed(2)}
      </TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">ID</TableHead> */}
          <TableHead>WrongSpealing</TableHead>
          <TableHead>Word</TableHead>
          <TableHead>diff</TableHead>
          <TableHead>Translation</TableHead>
          <TableHead>Sec_category</TableHead>
          <TableHead>action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.wrongAnswerList.map((word) => (
          <TableRow
            className={
              checkIsMinorErorr(
                getDifferences(word.user_input as string, word.word)
              )
                ? resolvedTheme === "dark"
                  ? "bg-orange-50/[.3]"
                  : "bg-orange-50"
                : ""
            }
            key={word.word_id}
          >
            <TableCell>
              <p className="underline decoration-dotted underline-offset-4 decoration-red-500">
                {word.user_input}
              </p>
            </TableCell>
            <TableCell>{word.word}</TableCell>
            <TableCell>
              <p>
                {getDifferences(word.user_input as string, word.word).map(
                  (part: any, index: any) => (
                    <span
                      key={index}
                      className={
                        part.added
                          ? "text-green-600"
                          : part.removed
                          ? "text-orange-600 bg-red-200 px-0.5 rounded"
                          : ""
                      }
                    >
                      {part.value}
                    </span>
                  )
                )}
              </p>
            </TableCell>
            <TableCell>{word.translation}</TableCell>
            <TableCell>{word.secondary_category}</TableCell>
            <TableCell>
              {" "}
              <button
                onClick={() => {
                  speechAPI(word.word, 1);
                }}
              >
                play
              </button>{" "}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type TableProps = {
  wrongAnswerList: Word[];
};

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

export function WordResultCard(props: TableProps) {
  let card;
  if (props.wrongAnswerList.length === 0) {
    return "";
  }
  card = props.wrongAnswerList.map((item) => (
    <Card
      onClick={() => {
        speechAPI(item.word, 1);
      }}
      className={
        checkIsMinorErorr(getDifferences(item.user_input as string, item.word))
          ? "border-4 border-orange-200"
          : ""
      }
      key={item.word_id}
    >
      <CardHeader>
        <CardTitle>{item.word as string}</CardTitle>
        <CardDescription>{item.translation}</CardDescription>
        <CardDescription>
          {getDifferences(item.user_input as string, item.word).map(
            (part: any, index: any) => (
              <span
                key={index}
                className={
                  part.added
                    ? "text-green-600"
                    : part.removed
                    ? "text-orange-600 bg-red-200 px-0.5 rounded"
                    : ""
                }
              >
                {part.value}
              </span>
            )
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  ));

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">{card} </div>

      <p>A list of your Wrong answer. Total:{props.wrongAnswerList.length}</p>
    </div>
  );
}
let wordList: Word[] = [];
let wordListCopy: Word[] = [];
export default function Dictation(props: { id: string }) {
  async function getUser() {
    const supabase = createClientComponentClient<Database>();
    const { data: session } = await supabase.auth.getSession();
    console.log(session.session?.user.id);
    return session.session?.user.id;
  }
  async function upDatePracticeLog() {
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

    console.log(res.json());
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
      <div className="w-full hidden md:contents">
        <WordTable wrongAnswerList={wrongAnswerList}></WordTable>
      </div>
      <div className="w-full md:hidden">
        <WordResultCard wrongAnswerList={wrongAnswerList}></WordResultCard>
      </div>
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
      <Button
        onClick={() => {
          upDatePracticeLog();
        }}
        variant="outline"
      >
        提交
      </Button>
    </div>
  );
}
