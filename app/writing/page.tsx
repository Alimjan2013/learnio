"use client";

import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [writing, setWriting] = useState("");
  const [deffScript, setDeffScript] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeWriting = (newText: any) => {
    // const newText = event.target.value;
    // setWriting(newText);
    const result = newText
      .split(/(【.*?】)|(\(.*?\))|<.*?>/)
      .filter((part: any) => part)
      .map((part: any) => {
        if (part.startsWith("(")) {
          return { type: "delete", context: part.slice(1, -1) };
        } else if (part.startsWith("【")) {
          return { type: "add", context: part.slice(1, -1) };
        } else if (part.startsWith("<")) {
          return { type: "delete", context: part.slice(1, -1) };
        } else {
          return { type: "normal", context: part };
        }
      });
    // console.log(script);
    console.log(result);
    setDeffScript(result);
  };

  async function getResult() {
    setIsLoading(true);
    const res = await fetch("https://slow-zebra-29.deno.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: writing,
      }),
    });
    const result = await res.json();
    if (res.ok) {
      setIsLoading(false);
    }
    handleChangeWriting(result.choices[0].message.content);
    console.log(result);
  }

  return (
    <main className=" space-y-4 container mx-auto px-4 pt-4">
      <h1 className="text-3xl font-bold text-center text-gray-600">
        Grammar check
      </h1>

      <div className="bg-slate-50 border border-slate-300 rounded-md p-2 mt-4 ">
        {deffScript.map((item: any, index: any) => (
          <p
            className={
              "inline rounded text-xl " +
              (item.type === "delete"
                ? "bg-red-50 px-1 text-red-400 italic"
                : "") +
              (item.type === "add" ? "bg-green-50  px-1 " : "")
            }
            key={index}
          >
            {item.context}
          </p>
        ))}
      </div>

      <textarea
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
        value={writing}
        onChange={(event) => setWriting(event?.target.value)}
      />
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={() => getResult()}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}
        check
      </Button>
    </main>
  );
}
