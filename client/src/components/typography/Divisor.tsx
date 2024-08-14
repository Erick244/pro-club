import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface DivisorProps extends HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

export function Divisor({ children, ...props }: DivisorProps) {
    return (
        <div
            {...props}
            className={cn("flex items-center gap-3", props.className)}
        >
            <div className="w-1/2 h-0.5 bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">{children}</span>
            <div className="w-1/2 h-0.5 bg-muted-foreground" />
        </div>
    );
}
