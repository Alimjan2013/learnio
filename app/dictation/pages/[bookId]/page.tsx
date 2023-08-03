"use client";
import Dictation from "@/components/tool/dictation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface Word {
  second_category: [any];
}
export default function DictationPage({
  params,
}: {
  params: { bookId: string };
}) {
  const [wordListIndex, setWordListIndex] = useState<Word>();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch("/api/words/getCategory");
        const data = await res.json();
        setWordListIndex(data[0]);
        console.log(data[0]);
      } catch (err: any) {}
    };
    fetchWords();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-4 md:p-24 p-8">
      <div className="w-full flex justify-between">
        <Link href="/dictation">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> back
          </Button>
        </Link>
        <div>{decodeURIComponent(params.bookId)}</div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Switch
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>change</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {wordListIndex?.second_category.map((item: any) => (
              <DropdownMenuItem
                disabled={
                  decodeURIComponent(params.bookId) === item.name ? true : false
                }
                key={item.name}
              >
                <Link href={`/dictation/pages/${item.name}`}>{item.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dictation id={params.bookId} />
    </main>
  );
}
