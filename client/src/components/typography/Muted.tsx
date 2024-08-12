import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface MutedProps extends HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export function Muted({ children, ...props }: MutedProps) {
    return (
        <p
            {...props}
            className={cn("text-sm text-muted-foreground", props.className)}
        >
            {children}
        </p>
    );
}
