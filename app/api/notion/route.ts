import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const prompt: any = request.body;
  console.log(prompt);
  let currentDate = new Date();
  let dateString = currentDate;
  let payload = {
    parent: {
      database_id: "088c4c1606b84b4eb226a0e65de63ded",
    },
    properties: {
      name: {
        title: [
          {
            text: {
              content: prompt.title,
            },
          },
        ],
      },
      context: {
        rich_text: [
          {
            text: {
              content: prompt.context,
            },
          },
        ],
      },
      Date: {
        date: {
          start: dateString,
        },
      },
    },
  };

  const response = await fetch("https://api.notion.com/v1/pages", {
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${process.env.NOTION_API ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  console.log(json);
  return NextResponse.json({ data: json });
}
