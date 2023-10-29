import Image from "next/image";
export default function Menu() {
  return (
    <div className="container flex h-14 items-center">
      <div className="mr-4 hidden md:flex">
        <a className="mr-6 flex items-center space-x-2" href="/welcome">
          <Image
            width={24}
            height={24}
            className="h-6 w-6"
            src="/favicon.ico"
            alt=""
          ></Image>
          <span className="hidden font-bold sm:inline-block">iooslo</span>
        </a>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <a
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href="/dashboard"
          >
            Dashboard
          </a>
          <a
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href="/dictation"
          >
            Dictation
          </a>
          <a
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href="/speaking"
          >
            Speaking
          </a>
          <a
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href="/writing"
          >
            Grammar Check
          </a>
        </nav>
      </div>
    </div>
  );
}
