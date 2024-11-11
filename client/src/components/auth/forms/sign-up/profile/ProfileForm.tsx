"use client";

import { profileColorAtom } from "@/atoms/user.atoms";
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
import { formMessages } from "@/messages/form.messages";
import { SocialMediaNames } from "@/models/enums/social-media-names.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SocialMediaInput } from "./social-medias/SocialMediaInput";

const messages = formMessages["ProfileForm"];
const profileFormSchema = z.object({
    profileImage: z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image"), messages.profileImage)
        .optional(),
    color: z.string(),
    socialMedias: z
        .array(
            z.object({
                name: z.nativeEnum(SocialMediaNames),
                tag: z.string().optional(),
                profileLink: z.string().optional(),
            })
        )
        .refine(
            (socialMedias) => socialMedias.length > 0,
            messages.socialMedias
        ),
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
                                <SocialMediaInput
                                    socialMediasRenderData={
                                        socialMediasRenderData
                                    }
                                    onUpdateSocialMedias={(socialMedias) =>
                                        form.setValue(
                                            "socialMedias",
                                            socialMedias
                                        )
                                    }
                                />
                            </FormControl>
                            <FormDescription>
                                If you want, add your social medias.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SubmitButton
                    isLoading={form.formState.isSubmitting}
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
