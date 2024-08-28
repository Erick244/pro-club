"use client";

import { profileColorAtom } from "@/atoms/user.atoms";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import {
    IntroductionCardSection,
    IntroductionCardSectionProps,
} from "./IntroductionCardSection";

export function IntroductionCardSectionProfile({
    children,
    ...props
}: IntroductionCardSectionProps) {
    const profileColor = useAtomValue(profileColorAtom);

    return (
        <IntroductionCardSection
            {...props}
            style={{
                background: `linear-gradient(225deg, hsl(var(--primary)) , ${
                    profileColor ? profileColor : "hsl(var(--primary))"
                })`,
                boxShadow: profileColor
                    ? `0px 0px 10px ${profileColor}`
                    : "none",
            }}
            className={cn(
                "border border-primary transition-all",
                props.className
            )}
        >
            {children}
        </IntroductionCardSection>
    );
}
