
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


interface FuncCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    link: string
}

export default function FuncCard({ title, description, link, className, ...props }: FuncCardProps) {
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
