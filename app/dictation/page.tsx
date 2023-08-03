"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
interface Word {
  second_category: [any];
}
export default function DictationPage() {
  const [words, setWords] = useState<Word>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/words/getCategory");
        const data = await res.json();
        setWords(data[0]);
        console.log(data[0]);
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };
    fetchWords();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-8">
      {words
        ? words.second_category.map((word) => (
            <Link key={word.name} href={`/dictation/pages/${word.name}`}>
              Section {word.name}
            </Link>
          ))
        : ""}
    </main>
  );
}
