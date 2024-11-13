"use client";

import { IntroductionSectionTitleSkeleton } from "@/components/skeletons/signup-details/texts/IntroductionSectionTitleSkeleton";
import { H1 } from "@/components/typography/H1";
import { useAuthContext } from "@/contexts/AuthContext";

export function IntroductionCardSectionTitle() {
    const { user } = useAuthContext();

    if (!user) return <IntroductionSectionTitleSkeleton />;

    return (
        <H1 className="lg:dark:text-background lg:text-foreground">
            {user.name}
        </H1>
    );
}
