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
                    render={({ field }) => (
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
                <SubmitButton
                    style={{
                        backgroundColor: profileColor,
                    }}
                    className="mt-20"
                >
                    <span className="bg-background text-foreground p-1 rounded">
                        Continue
                    </span>
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
    "#03cFC83",
    "#0589FA",
];
