"use client";

import { H2 } from "@/components/typography/H2";
import { Muted } from "@/components/typography/Muted";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import { SocialMediaNames } from "@/models/enums/social-media-names.enum";
import { SocialMedia } from "@/models/interfaces/social-media.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverClose } from "@radix-ui/react-popover";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export type SocialMediaFormData = z.infer<typeof socialMediaFormSchema>;

interface SocialMediaFormProps {
    defaultValues?: SocialMedia;
    handlerSubmit?: (data: SocialMediaFormData) => void;
}

export function SocialMediaForm({
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

            toast({
                description: `${data.name} saved in your Profile.`,
            });
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
                <PopoverClose asChild>
                    <SubmitButton className="mt-2 h-10">Save</SubmitButton>
                </PopoverClose>
            </form>
        </Form>
    );
}
