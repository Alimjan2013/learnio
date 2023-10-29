// "use client";
import { useCallback, useEffect, useState } from "react";
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

export default async function Top100() {
  const res = await fetch("https://top-100-words.deno.dev/");
  const data = await res.json();

  return (
    <div className="form-widget">
      <Dialog>
        <div className="m-3 flex justify-center">
          <DialogTrigger>
            <div className="text-center">Top 100 in 10 days</div>
          </DialogTrigger>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top 100 in 10 days</DialogTitle>
            <DialogDescription>
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead className="w-[100px]">ID</TableHead> */}
                    <TableHead>word</TableHead>
                    <TableHead>count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((log: any) => (
                    <TableRow key={log.word}>
                      <TableCell>{log.word}</TableCell>
                      <TableCell>{log.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
