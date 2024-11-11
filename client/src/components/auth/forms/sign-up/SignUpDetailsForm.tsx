"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, ButtonProps } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
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
import { toast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import { AnimatedInput } from "@/components/utils/forms/inputs/AnimatedInput";
import { Loader } from "@/components/utils/loading/Loader";
import { API_BASE_URL } from "@/constants";
import { countries, getCountries } from "@/data/countries";
import { authFetch } from "@/functions/api/auth-fetch";
import { throwDefaultError } from "@/functions/errors/exceptions";
import { useInfiniteScroll } from "@/hooks/useInfinityScroll";
import { cn } from "@/lib/utils";
import { formMessages } from "@/messages/form.messages";
import { useRouter } from "next/navigation";
import { ComponentProps, forwardRef, UIEvent } from "react";
import Flag from "react-country-flag";

const messages = formMessages["SignUpDetailsForm"];
const signUpDetailsFormSchema = z.object({
    country: z.string({ required_error: messages.country }),
    biography: z.string().max(255, messages.biography.max).min(0),
});

type SignUpDetailsFormData = z.infer<typeof signUpDetailsFormSchema>;

export function SignUpDetailsForm() {
    const form = useForm<SignUpDetailsFormData>({
        resolver: zodResolver(signUpDetailsFormSchema),
        defaultValues: {
            biography: "",
        },
    });

    const router = useRouter();

    async function onSubmit(data: SignUpDetailsFormData) {
        try {
            const resp = await authFetch(`${API_BASE_URL}/users/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!resp.ok) {
                await throwDefaultError(resp);
            }

            router.push("/auth/signup/profile");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    }

    const infinityScroll = useInfiniteScroll(10, 10);

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
                            <Popover
                                onOpenChange={(open) =>
                                    open && infinityScroll.reset()
                                }
                            >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <PopoverTriggerButton
                                            className="m-auto"
                                            fieldValue={field.value}
                                            role="combobox"
                                        />
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] px-0">
                                    <CountryCommand
                                        isLoading={infinityScroll.isLoading}
                                        onSearch={infinityScroll.handleOnSearch}
                                        onListScroll={
                                            infinityScroll.handleOnScroll
                                        }
                                    >
                                        {!infinityScroll.isLoading &&
                                            getCountries(
                                                infinityScroll.take,
                                                infinityScroll.searchTerm
                                            ).map((country) => (
                                                <CountryCommandItem
                                                    key={country.value}
                                                    country={country}
                                                    isSelect={
                                                        field.value ===
                                                        country.value
                                                    }
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
                <SubmitButton
                    isLoading={form.formState.isSubmitting}
                    className="mt-20"
                >
                    Continue
                </SubmitButton>
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
    onListScroll?: (e: UIEvent<HTMLDivElement, globalThis.UIEvent>) => void;
    onSearch?: (search: string) => void;
    isLoading?: boolean;
}

function CountryCommand({
    children,
    onListScroll,
    onSearch,
    isLoading,
}: CountryCommandProps) {
    return (
        <Command className="pt-2">
            <div className="flex px-5 mb-3 justify-center items-center gap-2 relative">
                <SearchIcon className="w-6 h-6 absolute right-5 text-primary" />
                <AnimatedInput
                    label="Search"
                    onChange={(e) =>
                        onSearch?.((e.target as HTMLInputElement).value)
                    }
                />
            </div>
            <CommandList className="px-5" onScroll={onListScroll}>
                <CommandEmpty className="flex justify-center py-10">
                    {isLoading ? <Loader /> : "No country found."}
                </CommandEmpty>
                <CommandGroup>{children}</CommandGroup>
            </CommandList>
        </Command>
    );
}

interface CountryCommandItemProps extends ComponentProps<typeof CommandItem> {
    country: { label: string; value: string };
    isSelect: boolean;
}

function CountryCommandItem({
    country,
    isSelect,
    ...props
}: CountryCommandItemProps) {
    return (
        <CommandItem value={country.label} {...props}>
            <Check
                className={cn(
                    "mr-2 h-4 w-4 ",
                    isSelect ? "opacity-100" : "opacity-0"
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
