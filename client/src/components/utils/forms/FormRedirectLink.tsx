import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps } from "react";

interface FormRedirectLinkProps extends ComponentProps<typeof Link> {
    initialSentence: string;
    flashyText: string;
}

export function FormRedirectLink({
    flashyText,
    initialSentence,
    ...props
}: FormRedirectLinkProps) {
    return (
        <Link
            {...props}
            className={cn(
                "text-center text-sm space-x-1 hover:underline",
                props.className
            )}
        >
            <span>{initialSentence}</span>
            <span className="text-primary underline">{flashyText}</span>
        </Link>
    );
}
