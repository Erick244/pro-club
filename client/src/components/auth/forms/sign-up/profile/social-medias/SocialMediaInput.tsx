"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SocialMediaNames } from "@/models/enums/social-media-names.enum";
import { SocialMedia } from "@/models/interfaces/social-media.interface";
import { forwardRef, useState } from "react";
import { SocialMediaForm, SocialMediaFormData } from "./SocialMediaForm";

type SocialMediaRenderData = {
    name: SocialMediaNames;
    Icon: () => JSX.Element;
    predominantColor: string;
};

interface SocialMediaInputProps {
    onUpdateSocialMedias: (socialMedias: SocialMedia[]) => void;
    socialMediasRenderData: SocialMediaRenderData[];
}

type SocialMedias = { [key in SocialMediaNames]: SocialMedia };

export function SocialMediaInput({
    onUpdateSocialMedias,
    socialMediasRenderData,
}: SocialMediaInputProps) {
    const defaultValuesSocialMedias = Object.values(SocialMediaNames).reduce(
        (accumulator, socialMediaName) => {
            accumulator[socialMediaName] = {
                name: socialMediaName,
                tag: "",
                profileLink: "",
            };

            return accumulator;
        },
        {} as SocialMedias
    );

    const [socialMedias, setSocialMedias] = useState<SocialMedias>(
        defaultValuesSocialMedias
    );

    function handleSubmit(data: SocialMediaFormData) {
        const updatedSocialMedias = { ...socialMedias };

        updatedSocialMedias[data.name] = data;

        setSocialMedias(updatedSocialMedias);

        const updatedSocialMediasArray = Object.values(updatedSocialMedias);
        onUpdateSocialMedias(
            filterHaveValueSocialMedia(updatedSocialMediasArray)
        );
    }

    function filterHaveValueSocialMedia(socialMedias: SocialMedia[]) {
        return socialMedias.filter(
            (socialMedia) => !!socialMedia?.tag || !!socialMedia?.profileLink
        );
    }

    return (
        <div className="border-2 border-foreground rounded-lg flex justify-between flex-wrap items-center gap-2 p-2">
            {socialMediasRenderData.map((socialMediaRender, i) => {
                const currentItem = socialMedias[socialMediaRender.name];
                const itemIsFiled =
                    !!currentItem?.tag || !!currentItem?.profileLink;

                return (
                    <Popover key={i}>
                        <PopoverTrigger asChild>
                            <SocialMediaInputItem
                                filed={itemIsFiled}
                                style={{
                                    backgroundColor:
                                        socialMediaRender.predominantColor,
                                }}
                            >
                                <socialMediaRender.Icon />
                            </SocialMediaInputItem>
                        </PopoverTrigger>
                        <PopoverContent>
                            <SocialMediaForm
                                defaultValues={currentItem}
                                handlerSubmit={handleSubmit}
                            />
                        </PopoverContent>
                    </Popover>
                );
            })}
        </div>
    );
}

interface SocialMediaInputItemProps extends ButtonProps {
    filed?: boolean;
}

const SocialMediaInputItem = forwardRef<
    HTMLButtonElement,
    SocialMediaInputItemProps
>(({ children, filed, ...props }, ref) => {
    return (
        <Button
            {...props}
            ref={ref}
            size="icon"
            type="button"
            className={cn(
                "hover:-translate-y-0.5 transition-all grayscale border",
                filed ? "grayscale-0 border-primary" : "grayscale border-none",
                props.className
            )}
        >
            {children}
        </Button>
    );
});

SocialMediaInputItem.displayName = "SocialMediaInputItem";
