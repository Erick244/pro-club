import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { DiscordLogo } from "../../../utils/logos/third-party/DiscordLogo";
import { FacebookLogo } from "../../../utils/logos/third-party/FacebookLogo";
import { GoogleLogo } from "../../../utils/logos/third-party/GoogleLogo";
import { RedditLogo } from "../../../utils/logos/third-party/RedditLogo";
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
