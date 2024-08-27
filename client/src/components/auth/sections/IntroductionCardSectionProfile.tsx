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
                backgroundColor: profileColor,
            }}
            logoclassname={cn(
                profileColor && "grayscale brightness-150",
                props.logoclassname
            )}
            className={cn(
                profileColor && "border border-foreground",
                props.className
            )}
        >
            {children}
        </IntroductionCardSection>
    );
}
