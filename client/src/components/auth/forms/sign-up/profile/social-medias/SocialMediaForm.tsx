"use client";

import { H2 } from "@/components/typography/H2";
import { Muted } from "@/components/typography/Muted";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import { AnimatedInput } from "@/components/utils/forms/inputs/AnimatedInput";
import { formMessages } from "@/messages/form.messages";
import { SocialMediaNames } from "@/models/enums/social-media-names.enum";
import { SocialMedia } from "@/models/interfaces/social-media.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const messages = formMessages["SocialMediaForm"];
const socialMediaFormSchema = z.object({
    name: z.nativeEnum(SocialMediaNames),
    tag: z.string().optional(),
    profileLink: z
        .string()
        .optional()
        .refine((url) => url?.startsWith("https://"), messages.profileLink.url),
});

export type SocialMediaFormData = z.infer<typeof socialMediaFormSchema>;

interface SocialMediaFormProps {
    defaultValues?: SocialMedia;
    handlerSubmit?: (data: SocialMediaFormData) => void;
    handlerPopoverClose: () => void;
}

export function SocialMediaForm({
    defaultValues,
    handlerSubmit,
    handlerPopoverClose,
}: SocialMediaFormProps) {
    const form = useForm<SocialMediaFormData>({
        resolver: zodResolver(socialMediaFormSchema),
        defaultValues: {
            name: defaultValues?.name,
            tag: !defaultValues?.tag ? undefined : defaultValues.tag,
            profileLink: !defaultValues?.profileLink
                ? undefined
                : defaultValues.profileLink,
        },
    });

    function onSubmit(data: SocialMediaFormData) {
        if (handlerSubmit) {
            handlerSubmit(data);

            toast({
                description: `${data.name} saved in your Profile.`,
            });

            handlerPopoverClose();
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
                className="gap-5 flex flex-col items-center w-full"
            >
                <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <AnimatedInput {...field} label="Tag" />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>
                                Example: @username, user#123
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="profileLink"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <AnimatedInput
                                    {...field}
                                    // type="url"
                                    label="Profile Link"
                                />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>
                                Link to your profile.
                            </FormDescription>
                        </FormItem>
                    )}
                />

                <SubmitButton
                    isLoading={form.formState.isSubmitting}
                    className="mt-2 h-10"
                >
                    Save
                </SubmitButton>
            </form>
        </Form>
    );
}
