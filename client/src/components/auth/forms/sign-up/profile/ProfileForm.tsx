"use client";

import { profileColorAtom } from "@/atoms/user.atoms";
import { Button, ButtonProps } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
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
import { SocialMedia } from "@/models/interfaces/social-media.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
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
                    name="color"
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

function SocialMediaInput() {
    return (
        <div className="border-2 border-foreground rounded-lg flex justify-between flex-wrap items-center gap-2 p-2">
            <SocialMediaInputItem className="bg-[#3c5a9a] hover:bg-[#3c5a9a]">
                <DiscordLogo />
            </SocialMediaInputItem>
            <SocialMediaInputItem className="bg-[#37A5E7] hover:bg-[#37A5E7]">
                <TelegramLogo />
            </SocialMediaInputItem>
            <SocialMediaInputItem className="bg-[#000000] hover:bg-[#000000]">
                <XLogo />
            </SocialMediaInputItem>
            <SocialMediaInputItem className="bg-[#D438B5] hover:bg-[#D438B5]">
                <InstagramLogo />
            </SocialMediaInputItem>
            <SocialMediaInputItem className="bg-[#000000] hover:bg-[#000000]">
                <TiktokLogo />
            </SocialMediaInputItem>
            <SocialMediaInputItem className="bg-[#944DFF] hover:bg-[#944DFF]">
                <TwitchTVLogo />
            </SocialMediaInputItem>
            <SocialMediaInputItem className="bg-[#FE0002] hover:bg-[#FE0002]">
                <YoutubeLogo />
            </SocialMediaInputItem>
        </div>
    );
}

function SocialMediaInputItem({ children, ...props }: ButtonProps) {
    return (
        <Button
            {...props}
            size="icon"
            className={cn(
                "hover:-translate-y-0.5 transition-all grayscale",
                props.className
            )}
        >
            {children}
        </Button>
    );
}
