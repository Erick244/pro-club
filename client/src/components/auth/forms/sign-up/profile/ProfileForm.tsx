"use client";

import { profileColorAtom } from "@/atoms/user.atoms";
import { H2 } from "@/components/typography/H2";
import { Muted } from "@/components/typography/Muted";
import { Button, ButtonProps } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import { ImagePickerInput } from "@/components/utils/forms/inputs/ImagePickerInput";
import { ColorSelect } from "@/components/utils/forms/selects/ColorSelect";
import { DiscordLogo } from "@/components/utils/logos/third-party/DiscordLogo";
import { InstagramLogo } from "@/components/utils/logos/third-party/InstagramLogo";
import { TelegramLogo } from "@/components/utils/logos/third-party/TelegramLogo";
import { TiktokLogo } from "@/components/utils/logos/third-party/TiktokLogo";
import { TwitchTVLogo } from "@/components/utils/logos/third-party/TwitchTVLogo";
import { XLogo } from "@/components/utils/logos/third-party/XLogo";
import { YoutubeLogo } from "@/components/utils/logos/third-party/YoutubeLogo";
import { cn } from "@/lib/utils";
import { SocialMediaNames } from "@/models/enums/social-media-names.enum";
import { SocialMedia } from "@/models/interfaces/social-media.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileFormSchema = z.object({
    profileImage: z
        .instanceof(File)
        .refine(
            (file) => file.type.startsWith("image"),
            "Please select a image"
        )
        .optional(),
    color: z.string(),
    socialMedias: z.array(z.instanceof(SocialMedia)),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            profileImage: undefined,
            color: "#000000",
            socialMedias: [],
        },
    });

    function onSubmit(data: ProfileFormData) {
        console.log(data);
    }

    const [profileColor, setProfileColor] = useAtom(profileColorAtom);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 flex flex-col justify-center items-center"
            >
                <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ImagePickerInput
                                    {...field}
                                    value=""
                                    onChange={(e) => {
                                        form.setValue(
                                            "profileImage",
                                            e.target.files?.[0]
                                        );
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="color"
                    render={() => (
                        <FormItem>
                            <FormControl>
                                <ColorSelect
                                    predefinedColors={predefinedColors}
                                    onSelectColor={(color) => {
                                        form.setValue("color", color);
                                        setProfileColor(color);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Select a color that suits your profile
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="socialMedias"
                    render={(field) => (
                        <FormItem>
                            <FormControl>
                                <SocialMediaInput />
                            </FormControl>
                            <FormDescription>
                                If you want, add your social medias.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SubmitButton
                    style={{
                        background: `linear-gradient(200deg, hsl(var(--primary)) 40%, ${
                            profileColor ? profileColor : "hsl(var(--primary))"
                        })`,
                        boxShadow: profileColor
                            ? `0px 0px 10px ${profileColor}`
                            : "none",
                    }}
                    className="mt-20"
                >
                    Continue
                </SubmitButton>
            </form>
        </Form>
    );
}

const predefinedColors = [
    "#FFFFFF",
    "#FF0001",
    "#81FF00",
    "#FF00EF",
    "#0056FF",
    "#FF007D",
    "#018600",
    "#02FDFA",
    "#000000",
    "#7C8382",
    "#7E00FF",
    "#FEA101",
    "#FAE905",
    "#03FC83",
    "#0589FA",
];

const socialMediasRenderData = [
    {
        name: SocialMediaNames.Discord,
        Icon: DiscordLogo,
        predominantColor: "#3c5a9a",
    },
    {
        name: SocialMediaNames.Telegram,
        Icon: TelegramLogo,
        predominantColor: "#37A5E7",
    },
    {
        name: SocialMediaNames.Tiktok,
        Icon: TiktokLogo,
        predominantColor: "#000000",
    },
    {
        name: SocialMediaNames.Youtube,
        Icon: YoutubeLogo,
        predominantColor: "#FE0002",
    },
    {
        name: SocialMediaNames.Instagram,
        Icon: InstagramLogo,
        predominantColor: "#D438B5",
    },
    {
        name: SocialMediaNames.TwitchTV,
        Icon: TwitchTVLogo,
        predominantColor: "#944DFF",
    },
    {
        name: SocialMediaNames.X,
        Icon: XLogo,
        predominantColor: "#000000",
    },
];

type SocialMedias = { [key in SocialMediaNames]: SocialMedia };

function SocialMediaInput() {
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

const socialMediaFormSchema = z.object({
    name: z.nativeEnum(SocialMediaNames),
    tag: z.string().optional(),
    profileLink: z
        .string()
        .optional()
        .refine(
            (url) => url?.startsWith("https://") || url?.length === 0,
            "Enter a valid URL"
        ),
});

type SocialMediaFormData = z.infer<typeof socialMediaFormSchema>;

interface SocialMediaFormProps {
    defaultValues?: SocialMedia;
    handlerSubmit?: (data: SocialMediaFormData) => void;
}

function SocialMediaForm({
    defaultValues,
    handlerSubmit,
}: SocialMediaFormProps) {
    const form = useForm<SocialMediaFormData>({
        resolver: zodResolver(socialMediaFormSchema),
        defaultValues: {
            name: defaultValues?.name,
            tag: defaultValues?.tag,
            profileLink: defaultValues?.profileLink,
        },
    });

    function onSubmit(data: SocialMediaFormData) {
        if (handlerSubmit) {
            handlerSubmit(data);
        }
    }

    return (
        <Form {...form}>
            <div className="mb-5 text-center">
                <H2 className="mb-2">{defaultValues?.name}</H2>
                <Muted>Fill in one of the fields below.</Muted>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit(onSubmit)(e);
                }}
                className="flex flex-col justify-between items-center gap-5 w-full"
            >
                <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-3 items-center gap-3">
                            <FormLabel>Tag:</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ex: @user123..."
                                    className="h-8 col-span-2"
                                />
                            </FormControl>
                            <FormMessage className="col-span-3" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="profileLink"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-3 items-center gap-3">
                            <FormLabel className="whitespace-nowrap">
                                Profile Link:
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Your profile link URL"
                                    className="h-8 col-span-2"
                                />
                            </FormControl>
                            <FormMessage className="col-span-3" />
                        </FormItem>
                    )}
                />
                <SubmitButton className="mt-2 h-10">Save</SubmitButton>
            </form>
        </Form>
    );
}
