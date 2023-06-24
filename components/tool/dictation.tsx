"use client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/wordBoard";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function TableDemo(props: TableProps) {
  return (
    <Table>
      <TableCaption>A list of your Wrong answer.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Word</TableHead>
          <TableHead>Wronganswer</TableHead>
          <TableHead>Translation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.wrongAnswerList.map((word) => (
          <TableRow key={word.word_id}>
            <TableCell className="font-medium">{word.word_id}</TableCell>
            <TableCell>{word.word}</TableCell>
            <TableCell>{word.user_input}</TableCell>
            <TableCell>{word.translation}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type Props = {
  wordList: Word[];
};
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
      const isCorrect = spelling === props.word.word;
      props.onAnswer(isCorrect, spelling);
      props.next();
      setSpelling("");
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
  console.log(wordList);
  const [currentWord, setCurrentWord] = useState<Word | undefined>(undefined);
  const [rightAnswerList, setRightAnswerList] = useState<Word[]>([]);
  const [wrongAnswerList, setWrongAnswerList] = useState<Word[]>([]);

  function pickRandomWord(words: Word[]): Word | undefined {
    if (words.length === 0) return undefined;
    const index = Math.floor(Math.random() * words.length);
    const randomWord = words.splice(index, 1)[0];
    speechAPI(randomWord.word);
    setCurrentWord(randomWord);
    return currentWord;
  }

  const handleAnswer = (isCorrect: boolean, spelling: string) => {
    if (isCorrect) {
      setRightAnswerList([...rightAnswerList, currentWord as Word]);
    } else {
      const currentWordCopy = { ...currentWord } as Word;
      currentWordCopy.user_input = spelling;
      setWrongAnswerList([...wrongAnswerList, currentWordCopy]);
    }
  };

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
        onAnswer={handleAnswer}
      ></CheckWords>
      <TableDemo wrongAnswerList={wrongAnswerList}></TableDemo>
      <button onClick={() => pickRandomWord(wordList)}>开始</button>
    </div>
  );
}
