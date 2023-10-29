import Link from "next/link";
import FuncCard from "./FuncCard";

export default function Welcome() {
  // const wordList = await getData();

  return (
    <div className="md:py-5 space-y-8">
      <Link href="/dashboard">
        {" "}
        <p className="text-2xl text-center">welcome</p>{" "}
      </Link>

      <div className="h-full grid place-content-center justify-items-center  md:grid-cols-2 grid-cols-1 gap-4">
        <FuncCard
          title="Dictation"
          description="practice spelling"
          link="dictation"
        ></FuncCard>
        <FuncCard
          title="Speaking"
          description="practice speaking"
          link="speaking"
        ></FuncCard>
        <FuncCard
          title="Grammar Check"
          description="check your grammar"
          link="writing"
        ></FuncCard>
        <FuncCard
          title="Dashboard"
          description="watch the update of your study"
          link="dashboard"
        ></FuncCard>
        <FuncCard
          title="More..."
          description="more are comming...."
          link="..."
        ></FuncCard>
      </div>
    </div>
  );
}
