import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

export function InlineLogo({ ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <div
            {...props}
            className={cn(
                "overflow-hidden rounded bg-blue-500",
                props.className
            )}
        >
            <Image
                className="w-auto h-auto"
                src="/logos/logo-inline.png"
                alt="ProClub inline logo"
                width={250}
                height={60}
                priority
            />
        </div>
    );
}
