
import { BellRing, Check } from "lucide-react"
import Link from 'next/link'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


type CardProps = React.ComponentProps<typeof Card>
interface FuncCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    link: string
}

export function FuncCard({ title, description, link, className, ...props }: FuncCardProps) {
    return (
        <Card className={cn("w-[380px]", className)} {...props}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardFooter>
                <Link  className="w-full" href={`/${link}`}>
                    <Button disabled={link==='...'?true:false} className="w-full">
                        Vist
                    </Button>
                </Link>

            </CardFooter>
        </Card>

    )
}



export default async function Welcome() {
    // const wordList = await getData();
    return (
        <div className="md:py-5 space-y-8">
            <Link href="/dashboard"> <p className="text-2xl text-center">welcome</p> </Link>
            
            
            <div className="h-full grid place-content-center justify-items-center  md:grid-cols-2 grid-cols-1 gap-4">
                <FuncCard title="Dictation" description="practice spelling" link="dictation"></FuncCard>
                <FuncCard title="Speaking" description="practice speaking" link="speaking"></FuncCard>
                <FuncCard title="Grammar Check" description="check your grammar" link="writing"></FuncCard>
                <FuncCard title="More..." description="more are comming...." link="..." ></FuncCard>
            </div>
        </div>


    );
}
