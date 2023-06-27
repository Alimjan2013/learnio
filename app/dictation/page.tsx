import Dictation from "@/components/tool/dictation";

export default async function DictationPage() {
  // const wordList = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-8">
      {/* <Dictation /> */}
      <form action="/auth/signout" method="post">
        <button className="button block" type="submit">
          Sign out
        </button>
      </form>
    </main>
  );
}
