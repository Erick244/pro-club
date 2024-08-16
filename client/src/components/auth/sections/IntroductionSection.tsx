import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface IntroductionSectionProps extends HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function IntroductionSection({
    children,
    ...props
}: IntroductionSectionProps) {
    return (
        <section
            {...props}
            className={cn(
                "flex flex-col justify-center items-center",
                props.className
            )}
        >
            {children}
        </section>
    );
}
