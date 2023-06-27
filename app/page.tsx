import AuthForm from "./auth-form";

export default async function Home() {
  // const wordList = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-8">
      <AuthForm />
    </main>
  );
}
