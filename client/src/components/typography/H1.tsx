import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface H1Props extends HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function H1({ children, ...props }: H1Props) {
    return (
        <h1
            className={cn(
                "scroll-m-20 text-4xl font-extrabold tracking-tight sm:text-5xl",
                props.className
            )}
        >
            {children}
        </h1>
    );
}
