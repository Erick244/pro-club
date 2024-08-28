import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface BlockLogoProps extends HTMLAttributes<HTMLElement> {
    invert?: boolean;
}

export function BlockLogo({ invert, ...props }: BlockLogoProps) {
    return (
        <div {...props} className={cn("overflow-hidden", props.className)}>
            <Image
                className="w-auto h-auto rounded-lg"
                src={
                    invert
                        ? "/logos/logo-block_invert.png"
                        : "/logos/logo-block.png"
                }
                alt="ProClub block logo"
                width={231}
                height={179}
                priority
            />
        </div>
    );
}
