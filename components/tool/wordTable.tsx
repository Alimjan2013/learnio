"use client";
import { diffChars } from "diff";
import { useTheme } from "next-themes";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/wordBoard";
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

type TableProps = {
  wrongAnswerList: Word[];
  accuracyRate: number;
};

type Word = {
  word_id: number;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
  user_input?: string;
};

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

export default function WordTable(props: TableProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="w-full">
      <div className="w-full hidden md:contents">
        <Table>
          <TableCaption>
            A list of your Wrong answer. Total:
            {props.wrongAnswerList.length} ;{props.accuracyRate}%
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
      </div>
      <div className="w-full md:hidden">
        <WordResultCard
          wrongAnswerList={props.wrongAnswerList}
          accuracyRate={props.accuracyRate}
        ></WordResultCard>
      </div>
    </div>
  );
}
