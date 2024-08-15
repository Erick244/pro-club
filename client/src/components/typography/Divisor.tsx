import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface DivisorProps extends HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    direction?: "horizontal" | "vertical";
}

export function Divisor({
    children,
    direction = "horizontal",
    ...props
}: DivisorProps) {
    const isVertical = direction === "vertical";

    return (
        <div
            {...props}
            className={cn(
                "flex items-center gap-3",
                isVertical ? "flex-col h-full" : "flex-row",
                props.className
            )}
        >
            <div
                className={cn(
                    "bg-muted-foreground",
                    isVertical ? "min-h-[200px]  w-0.5" : "w-1/2 h-0.5"
                )}
            />
            <span className="text-xs text-muted-foreground">{children}</span>
            <div
                className={cn(
                    "bg-muted-foreground",
                    isVertical ? "min-h-[200px] w-0.5" : "w-1/2 h-0.5"
                )}
            />
        </div>
    );
}
