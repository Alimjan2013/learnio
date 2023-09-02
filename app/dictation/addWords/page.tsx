"use client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function AddWords() {
  // const wordList = await getData();
  const [listString, setListString] = useState("");
  const [secondaryCategory, setSecondaryCategory] = useState("");
  const [spelling, setSpelling] = useState("");

  const handleListStringChange = (event: any) => {
    setListString(event.target.value);
    // console.log(listString);
  };
  const handleSecondary = (event: any) => {
    setSecondaryCategory(event.target.value);
    // console.log(listString);
  };
  async function postData(list: string) {
    const response = await fetch("/api/addwords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        list: list,
        primary_category: "测试书",
        secondary_category: secondaryCategory,
      }),
    });
    // Recommendation: handle errors
    if (!response.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to post data");
    }
    return response.json();
  }

  async function handleSubmit() {
    const data = await postData(listString);
    console.log(data);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-8">
      <Label>New Word List</Label>
      <Textarea
        onChange={handleSecondary}
        placeholder="Enter the secondary category"
      />
      {listString}
      <Textarea
        onChange={handleListStringChange}
        placeholder="Enter the word list"
      />

      <button onClick={() => handleSubmit()}>send</button>
    </main>
  );
}
