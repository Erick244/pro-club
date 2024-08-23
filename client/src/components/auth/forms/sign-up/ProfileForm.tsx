"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagePickerInput } from "@/components/utils/forms/ImagePickerInput";
import { SubmitButton } from "@/components/utils/forms/SubmitButton";
import { cn } from "@/lib/utils";
import { SocialMedia } from "@/models/interfaces/social-media.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, PipetteIcon } from "lucide-react";
import { ChangeEvent, HTMLAttributes, useState } from "react";
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                <SelectColor
                                    onSelectColor={(color) =>
                                        form.setValue("color", color)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SubmitButton className="mt-20">Continue</SubmitButton>
            </form>
        </Form>
    );
}

interface SelectColorProps {
    onSelectColor: (color: string) => void;
}

function SelectColor({ onSelectColor }: SelectColorProps) {
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

    const [colorSelected, setColorSelected] = useState<string | undefined>(
        undefined
    );

    function onClickInPredefinedColor(color: string) {
        onSelectColor(color);
        setColorSelected(color);
    }

    function onChangeCustomColor(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        const color = e.target.value;
        onSelectColor(color);

        setColorSelected(color);
    }

    return (
        <div className="border-2 border-foreground rounded p-2 flex gap-2 flex-wrap">
            {predefinedColors.map((color, i) => (
                <SelectColorOption
                    color={color}
                    selected={color === colorSelected}
                    onClick={() => onClickInPredefinedColor(color)}
                    key={i}
                />
            ))}
            <div
                style={{ backgroundColor: colorSelected }}
                className="transition-all bg-primary relative flex justify-center items-center rounded-lg h-10 w-10 cursor-pointer border-2 border-foreground overflow-hidden"
            >
                <PipetteIcon className="bg-background p-1 rounded" />
                <Input
                    onChange={onChangeCustomColor}
                    defaultValue={colorSelected}
                    type="color"
                    className="absolute cursor-pointer w-full h-full top-0 left-0 opacity-0"
                />
            </div>
        </div>
    );
}

interface SelectColorOptionProps extends HTMLAttributes<HTMLElement> {
    color: string;
    selected?: boolean;
}

function SelectColorOption({
    color,
    selected,
    ...props
}: SelectColorOptionProps) {
    return (
        <div
            {...props}
            style={{
                backgroundColor: color,
                boxShadow: selected ? `0px 0px 10px ${color}` : "none",
            }}
            className={cn(
                "transition-all overflow-hidden rounded-full h-10 w-10 cursor-pointer border-2 border-foreground flex justify-center items-center",
                props.className
            )}
        >
            <CheckIcon
                className={cn(
                    "bg-background rounded-full p-1 transition-all",
                    selected ? "translate-y-0" : "translate-y-[150%]"
                )}
            />
        </div>
    );
}
