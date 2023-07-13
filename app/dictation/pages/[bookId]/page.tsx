import Dictation from "@/components/tool/dictation";
import Link from "next/link";
import { ChevronLeft, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { kv } from "@vercel/kv";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function DictationPage({
  params,
}: {
  params: { bookId: string };
}) {
  const wordListIndex = (await kv.get("wordListIndex")) as Array<string>;

  return (
    <main className="flex min-h-screen flex-col items-center space-y-4 md:p-24 p-8">
      <div className="w-full flex justify-between">
        <Link href="/dictation">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> back
          </Button>
        </Link>
        <div>章节{decodeURIComponent(params.bookId)}</div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Switch
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>change</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {wordListIndex.map((item) => (
              <DropdownMenuItem
                disabled={
                  decodeURIComponent(params.bookId) === item ? true : false
                }
                key={item}
              >
                <Link href={`/dictation/pages/${item}`}>章节{item}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dictation id={params.bookId} />
    </main>
  );
}
