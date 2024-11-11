"use client";

import { GithubLogo } from "@/components/utils/logos/third-party/GithubLogo";
import { BASE_API_URL } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { DiscordLogo } from "../../../utils/logos/third-party/DiscordLogo";
import { FacebookLogo } from "../../../utils/logos/third-party/FacebookLogo";
import { GoogleLogo } from "../../../utils/logos/third-party/GoogleLogo";
import { OAuthButton } from "./OAuthButton";

export function OAuthGroupButtons(props: HTMLAttributes<HTMLDivElement>) {
    const BASE_PATH = `${BASE_API_URL}/oauth`;

    return (
        <div className={cn("space-y-2", props.className)}>
            <OAuthButton className="bg-white">
                <Link href={`${BASE_PATH}/google`}>
                    <GoogleLogo />
                </Link>
            </OAuthButton>

            <div className="flex gap-2">
                <OAuthButton className="bg-[#3c5a9a]">
                    <Link href={`${BASE_PATH}/facebook`}>
                        <FacebookLogo />
                    </Link>
                </OAuthButton>
                <OAuthButton className="bg-[#010409]">
                    <Link href={`${BASE_PATH}/github`}>
                        <GithubLogo />
                    </Link>
                </OAuthButton>
                <OAuthButton className="bg-[#5865F2]">
                    <Link href={`${BASE_PATH}/discord`}>
                        <DiscordLogo />
                    </Link>
                </OAuthButton>
            </div>
        </div>
    );
}
