"use client";

import { useCallback, useState, useEffect } from "react";
import { speechAPI } from "../../lib/utils";

const repeatNumber = 30;

function ClickCount({ context }: { context: string }) {
  const [count, setCount] = useState(0);
  const [buttonName, setButtonName] = useState("+1");

  // Function to make a POST request
  const postOnePace = async (e: any) => {
    const response = await fetch("/api/notion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "这个是文章的标题",
        context: context,
      }),
    });

    let answer = await response;
    console.log(answer.json());
  };

  // Read count value from local storage
  useEffect(() => {
    const storedCount = localStorage.getItem("count");
    if (storedCount !== null) {
      setCount(parseInt(storedCount));
    }
  }, []);

  // Store count value in local storage
  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  // Function to increment count
  const increment = useCallback(() => {
    if (count === repeatNumber - 1) {
      setButtonName("打卡");
    }
    if (count < repeatNumber) {
      setCount((v) => v + 1);
    } else if (count === repeatNumber) {
      reset();
    }
  }, [count, setCount]);

  // Function to reset count
  const reset = useCallback(() => {
    setCount(0);
    localStorage.removeItem("count");
    setButtonName("+1");
  }, [setCount]);

  // Calculate progress percentage
  const progress = count >= repeatNumber ? 100 : (count / repeatNumber) * 100;

  return (
    <div className="flex w-full items-center justify-center flex-col space-y-4">
      <div>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded "
          onClick={increment}
        >
          {buttonName}
        </button>
        <p className="text-base text-gray-600">已完成{count}次</p>
      </div>

      {/* Progress bar component */}
      <div className=" w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-r from-blue-500 to-green-500"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        ></div>
      </div>
      <div>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded"
          onClick={reset}
        >
          清空
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [text, setText] = useState("");

  // Read text value from local storage
  useEffect(() => {
    const storedText = localStorage.getItem("text");
    if (storedText) {
      setText(storedText);
    }
  }, []);

  // Function to handle text change
  const handleChange = (event: any) => {
    const newText = event.target.value;
    setText(newText);
    localStorage.setItem("text", newText);
  };

  // Create divs for each line of text
  const textDivs = text
    ? text.split("\n").map((item, index) => (
        <div
          className="bg-slate-100 border border-slate-300 rounded-md p-2 mt-4 "
          key={index}
          onClick={() => {
            speechAPI(item, 0.9);
          }}
        >
          <p className=" md:text-xl text-2xl ">{item}</p>
        </div>
      ))
    : [];

  return (
    <main className=" space-y-5 container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center text-gray-600">
        Today Learning
      </h1>

      {/* Display error message if no text is entered */}
      {textDivs.length === 0 ? (
        <div className="text-red-500 font-bold mt-4">请输入文本</div>
      ) : (
        <div>{textDivs}</div>
      )}

      <div className="flex justify-center flex-wrap">
        {/* Render ClickCount component */}
        <ClickCount context={text} />
      </div>

      {/* Textarea to enter text */}
      <textarea
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
        value={text}
        onChange={handleChange}
      />
    </main>
  );
}
