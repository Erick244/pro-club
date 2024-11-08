"use client";

import { InfoTextSkeleton } from "@/components/skeletons/email-confirmation/texts/InfoTextSkeleton";
import { Muted } from "@/components/typography/Muted";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function InfoText({ className }: { className?: string | undefined }) {
    const { user } = useAuthContext();

    if (!user) return <InfoTextSkeleton />;

    return (
        <Muted className={cn("text-center text-xs", className)}>
            <span>A code has been sent to the e-mail:</span>
            <strong className="text-primary ml-1 dark:bg-background bg-foreground rounded py-0.5 px-1">
                {user.email}
            </strong>
            <span>. Copy and paste here.</span>
        </Muted>
    );
}
