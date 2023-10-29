"use client";
import { useCallback, useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { DualAxes } from "@antv/g2plot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WordTable from "@/components/tool/wordTable";

type Word = {
  word_id: number;
  word: string;
  translation: string;
  primary_category: string;
  secondary_category: string;
  user_input?: string;
};

type LogList = {
  id: string;
  created_at: Date;
  wrong_answer_list: [Word];
  wrong_answer_number: number;
  accuracy_rate: number;
  total_number: number;
};

export default function AccountForm({ session }: { session: Session | null }) {
  const [loading, setLoading] = useState(true);
  const [practiceLog, setPracticeLog] = useState<LogList[]>([]);
  const user = session?.user.id;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/practiceLog/getPracticeLog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const LogList = await res.json();

      const logListArray: LogList[] = LogList.map((log: any) => {
        const created_at = new Date(log.created_at);

        const wrong_answer_number = log.wrong_answer_list.length;

        const total_number = Math.ceil(
          log.wrong_answer_list.length / (1 - log.accuracy_rate / 100)
        );

        return {
          id: log.id,
          created_at,
          wrong_answer_list: log.wrong_answer_list,
          wrong_answer_number,
          accuracy_rate: log.accuracy_rate,
          total_number,
        };
      });

      creatChart(logListArray);

      setPracticeLog(logListArray);
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const creatChart = (logListArray: LogList[]) => {
    const data1 = logListArray;
    const combinedData = [];

    // Iterate through the data array
    for (let i = 0; i < data1.length; i++) {
      const currentDate = new Date(data1[i].created_at).toDateString();

      // Check if the current date already exists in the combinedData array
      const existingDataIndex = combinedData.findIndex(
        (item) => new Date(item.created_at).toDateString() === currentDate
      );

      // If the current date exists, update the total_number and accuracy_rate
      if (existingDataIndex !== -1) {
        combinedData[existingDataIndex].total_number += data1[i].total_number;
        combinedData[existingDataIndex].accuracy_rate += data1[i].accuracy_rate;
      } else {
        // If the current date doesn't exist, create a new object
        combinedData.push({
          created_at: data1[i].created_at.toDateString(),
          total_number: data1[i].total_number,
          accuracy_rate: data1[i].accuracy_rate,
        });
      }
    }

    // Calculate the average accuracy_rate
    combinedData.forEach((item) => {
      item.accuracy_rate /= logListArray.filter(
        (log) => new Date(log.created_at).toDateString() === item.created_at
      ).length;
    });
    console.log(combinedData);
    const data: any = combinedData;
    const line = new DualAxes("container", {
      data: [data, data],
      xField: "created_at",
      yField: ["total_number", "accuracy_rate"],
      geometryOptions: [
        {
          geometry: "line",
          color: "#5B8FF9",
        },
        {
          geometry: "line",
          color: "#5AD8A6",
        },
      ],
    });

    line.render();
  };

  useEffect(() => {
    getProfile();
  }, [user]);

  return (
    <div className="form-widget p-4">
      <Table>
        <TableCaption>A list of your Practice</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">ID</TableHead> */}
            <TableHead>Date</TableHead>
            <TableHead>total number</TableHead>
            <TableHead>issue number</TableHead>
            <TableHead>accuracyRate</TableHead>
            <TableHead>details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {practiceLog.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <p>
                  {log.created_at.toDateString()}{" "}
                  {log.created_at.toLocaleTimeString()}
                </p>
              </TableCell>
              <TableCell>{log.total_number}</TableCell>
              <TableCell>{log.wrong_answer_number}</TableCell>
              <TableCell>
                <p>{log.accuracy_rate}%</p>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>Open</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {new Date(log.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "Asia/Shanghai",
                        })}
                      </DialogTitle>
                      <DialogDescription>
                        <WordTable
                          wrongAnswerList={log.wrong_answer_list}
                          accuracyRate={log.accuracy_rate}
                        ></WordTable>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="max-h-[500px] p-5" id="container"></div>
    </div>
  );
}
