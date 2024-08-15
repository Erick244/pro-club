import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { DiscordLogo } from "../providers-logo/DiscordLogo";
import { FacebookLogo } from "../providers-logo/FacebookLogo";
import { GoogleLogo } from "../providers-logo/GoogleLogo";
import { RedditLogo } from "../providers-logo/RedditLogo";
import { OAuthButton } from "./OAuthButton";

export function OAuthGroupButtons(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("space-y-2", props.className)}>
            <OAuthButton className="bg-white">
                <GoogleLogo />
            </OAuthButton>
            <div className="flex gap-2">
                <OAuthButton className="bg-[#3c5a9a]">
                    <FacebookLogo />
                </OAuthButton>
                <OAuthButton className="bg-[#FC471E]">
                    <RedditLogo />
                </OAuthButton>
                <OAuthButton className="bg-[#5865F2]">
                    <DiscordLogo />
                </OAuthButton>
            </div>
        </div>
    );
}
