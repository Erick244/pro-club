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

    const [currentSocialMediaFormOpen, setCurrentSocialMediaFormOpen] =
        useState<SocialMedia | null>(null);

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

    function handleCurrentSocialMediaFormVisibility(
        isOpen: boolean,
        currentSocialMedia: SocialMedia
    ) {
        if (isOpen) {
            setCurrentSocialMediaFormOpen(currentSocialMedia);
        } else {
            setCurrentSocialMediaFormOpen(null);
        }
    }

    return (
        <div className="border-2 border-foreground rounded-lg flex justify-between flex-wrap items-center gap-2 p-2">
            {socialMediasRenderData.map((socialMediaRender, i) => {
                const currentItem = socialMedias[socialMediaRender.name];
                const itemIsFiled =
                    !!currentItem?.tag || !!currentItem?.profileLink;
                const popoverIsOpen =
                    currentItem === currentSocialMediaFormOpen;

                return (
                    <Popover
                        open={popoverIsOpen}
                        key={i}
                        onOpenChange={(isOpen) =>
                            handleCurrentSocialMediaFormVisibility(
                                isOpen,
                                currentItem
                            )
                        }
                    >
                        <PopoverTrigger asChild>
                            <SocialMediaInputButton
                                formIsVisible={popoverIsOpen}
                                filed={itemIsFiled}
                                style={{
                                    backgroundColor:
                                        socialMediaRender.predominantColor,
                                }}
                            >
                                <socialMediaRender.Icon />
                            </SocialMediaInputButton>
                        </PopoverTrigger>
                        <PopoverContent>
                            <SocialMediaForm
                                handlerPopoverClose={() =>
                                    setCurrentSocialMediaFormOpen(null)
                                }
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

interface SocialMediaInputButtonProps extends ButtonProps {
    filed?: boolean;
    formIsVisible?: boolean;
}

const SocialMediaInputButton = forwardRef<
    HTMLButtonElement,
    SocialMediaInputButtonProps
>(({ children, filed, formIsVisible, ...props }, ref) => {
    return (
        <Button
            {...props}
            ref={ref}
            size="icon"
            type="button"
            className={cn(
                " transition-all grayscale border-2",
                filed ? "grayscale-0 border-primary" : "grayscale border-none",
                formIsVisible
                    ? "scale-110 grayscale-0"
                    : "hover:scale-105 active:scale-95",
                props.className
            )}
        >
            {children}
        </Button>
    );
});

SocialMediaInputButton.displayName = "SocialMediaInputButton";
