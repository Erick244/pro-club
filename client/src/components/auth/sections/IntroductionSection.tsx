import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export type IntroductionAuthFormSectionTexts = {
    h1: string;
    muted: string;
};

interface IntroductionSectionProps extends HTMLAttributes<HTMLElement> {
    texts: IntroductionAuthFormSectionTexts;
}

export function IntroductionSection({
    texts,
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
            <H1>{texts.h1}</H1>
            <Muted className="text-center text-xs">{texts.muted}</Muted>
        </section>
    );
}
