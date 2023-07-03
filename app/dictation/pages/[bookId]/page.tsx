import Dictation from "@/components/tool/dictation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DictationPage({
  params,
}: {
  params: { bookId: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-4 md:p-24 p-8">
      <div className="w-full flex">
        <Link href="/dictation">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> back
          </Button>
        </Link>
      </div>

      <Dictation id={params.bookId} />
    </main>
  );
}
