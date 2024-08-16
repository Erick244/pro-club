import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";
import { BlockLogo } from "@/components/utils/app-logos/BlockLogo";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { IntroductionAuthFormSectionTexts } from "./IntroductionSection";

interface IntroductionCardSectionProps extends HTMLAttributes<HTMLElement> {
    texts: IntroductionAuthFormSectionTexts;
}

export function IntroductionCardSection({
    texts,
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
            <BlockLogo invert />
            <div className="flex flex-col justify-center items-center">
                <H1 className="dark:text-background text-foreground">
                    {texts.h1}
                </H1>
                <Muted className="text-center text-xs dark:text-background text-foreground">
                    {texts.muted}
                </Muted>
            </div>
        </section>
    );
}
