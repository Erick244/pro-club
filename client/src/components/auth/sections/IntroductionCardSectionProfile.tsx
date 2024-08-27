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
            className={cn("border border-primary", props.className)}
        >
            {children}
        </IntroductionCardSection>
    );
}
