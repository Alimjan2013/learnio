"use client";
import { useCallback, useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
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

type Log = {
  id: string;
  created_at: string;
  wrong_answer_list: [Word];
  accuracy_rate: number;
};

export default function AccountForm({ session }: { session: Session | null }) {
  const [loading, setLoading] = useState(true);
  const [practiceLog, setPracticeLog] = useState<Log[]>([]);
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
      setPracticeLog(LogList);
      console.log(LogList);
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getProfile();
  }, [user]);

  return (
    <div className="form-widget">
      <Table>
        <TableCaption>A list of your Practice</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">ID</TableHead> */}
            <TableHead>Date</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>accuracyRate</TableHead>
            <TableHead>details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {practiceLog.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <p>
                  {new Date(log.created_at)
                    .toISOString()
                    .replace(/T/, " ")
                    .replace(/\..+/, "")}
                </p>
              </TableCell>
              <TableCell>{log.wrong_answer_list.length}</TableCell>
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
    </div>
  );
}
