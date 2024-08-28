import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface FormContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function FormContainer({ children, ...props }: FormContainerProps) {
    return (
        <div
            {...props}
            className={cn(
                "bg-primary/15 border-2 border-primary rounded p-5 backdrop-blur-sm",
                props.className
            )}
        >
            {children}
        </div>
    );
}
