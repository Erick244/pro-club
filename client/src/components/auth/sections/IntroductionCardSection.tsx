import { BlockLogo } from "@/components/utils/app-logos/BlockLogo";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface IntroductionCardSectionProps
    extends HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function IntroductionCardSection({
    children,
    ...props
}: IntroductionCardSectionProps) {
    return (
        <section
            {...props}
            className={cn(
                "flex flex-col items-center justify-between bg-primary p-5 rounded-lg gap-10 max-w-[500px]",
                props.className
            )}
        >
            <BlockLogo invert className="border border-primary rounded" />
            <div className="flex flex-col justify-center items-center">
                {children}
            </div>
        </section>
    );
}
