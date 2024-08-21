"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, ButtonProps } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/utils/forms/SubmitButton";
import { countries } from "@/data/countries";
import { cn } from "@/lib/utils";
import { signUpDetailsMessages } from "@/messages/SignUpDetailsForm.messages";
import { ComponentProps, forwardRef } from "react";
import Flag from "react-country-flag";

const signUpDetailsFormSchema = z.object({
    country: z.string({ required_error: signUpDetailsMessages.required }),
    biography: z.string().max(255, signUpDetailsMessages.biography.max).min(0),
});

type SignUpDetailsFormData = z.infer<typeof signUpDetailsFormSchema>;

export function SignUpDetailsForm() {
    const form = useForm<SignUpDetailsFormData>({
        resolver: zodResolver(signUpDetailsFormSchema),
        defaultValues: {
            biography: "",
        },
    });

    function onSubmit(data: SignUpDetailsFormData) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 h-full flex flex-col justify-between items-center"
            >
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-center">
                                Country
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <PopoverTriggerButton
                                            className="m-auto"
                                            fieldValue={field.value}
                                            role="combobox"
                                        />
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <CountryCommand>
                                        {countries.map((country) => (
                                            <CountryCommandItem
                                                key={country.value}
                                                country={country}
                                                fieldValue={field.value}
                                                onSelect={() => {
                                                    form.setValue(
                                                        "country",
                                                        country.value
                                                    );
                                                }}
                                            />
                                        ))}
                                    </CountryCommand>
                                </PopoverContent>
                            </Popover>
                            <FormDescription className="text-center">
                                This will filter out the players in your
                                discovery list.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Biography (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={6}
                                    cols={200}
                                    className="max-w-[400px] w-full self-stretch resize-none"
                                    placeholder="Hello. My name is..."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-center">
                                Tell us a little about yourself. (This will be
                                public)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SubmitButton className="mt-20">Continue</SubmitButton>
            </form>
        </Form>
    );
}

interface PopoverTriggerButtonProps extends ButtonProps {
    fieldValue: string;
}

const PopoverTriggerButton = forwardRef<
    HTMLButtonElement,
    PopoverTriggerButtonProps
>(({ fieldValue, ...props }, ref) => {
    const currentCountryLabel = countries.find(
        (country) => country.value === fieldValue
    )?.label;

    return (
        <Button
            {...props}
            ref={ref}
            className={cn(
                "max-w-[200px] w-full justify-between bg-transparent text-foreground border-2 border-primary hover:bg-primary/10 focus:border-foreground",
                !fieldValue && "text-muted-foreground",
                props.className
            )}
        >
            {fieldValue ? (
                <span className="space-x-2 max-w-[200px] overflow-hidden text-ellipsis">
                    <Flag countryCode={fieldValue} svg title={fieldValue} />
                    <span>{currentCountryLabel}</span>
                </span>
            ) : (
                "Select your country"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    );
});

PopoverTriggerButton.displayName = "PopoverTriggerButton";

interface CountryCommandProps {
    children: React.ReactNode;
}

function CountryCommand({ children }: CountryCommandProps) {
    return (
        <Command>
            <CommandInput placeholder="Search language..." />
            <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>{children}</CommandGroup>
            </CommandList>
        </Command>
    );
}

interface CountryCommandItemProps extends ComponentProps<typeof CommandItem> {
    country: { label: string; value: string };
    fieldValue: string;
}

function CountryCommandItem({
    country,
    fieldValue,
    ...props
}: CountryCommandItemProps) {
    return (
        <CommandItem value={country.label} {...props}>
            <Check
                className={cn(
                    "mr-2 h-4 w-4 ",
                    country.value === fieldValue ? "opacity-100" : "opacity-0"
                )}
            />
            <Flag
                className="mr-2"
                countryCode={country.value}
                svg
                title={country.label}
            />

            <span>{country.label}</span>
        </CommandItem>
    );
}
