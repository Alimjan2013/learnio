import Dictation from "@/components/tool/dictation";

export default async function DictationPage({
  params,
}: {
  params: { bookId: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-8">
      <Dictation id={params.bookId} />
    </main>
  );
}
