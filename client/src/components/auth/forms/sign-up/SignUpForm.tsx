"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import { AnimatedInput } from "@/components/utils/forms/inputs/AnimatedInput";
import { FormRedirectLink } from "@/components/utils/forms/links/FormRedirectLink";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formMessages } from "@/messages/form.messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const messages = formMessages["SignUpForm"];
const signUpFormSchema = z
    .object({
        name: z.string().min(2, messages.name.min).max(50, messages.name.max),
        email: z.string().email(messages.email),
        password: z
            .string()
            .min(8, messages.password.min)
            .max(16, messages.password.max),
        confirmPassword: z
            .string()
            .min(8, messages.password.min)
            .max(16, messages.password.max),
    })
    .refine(({ confirmPassword, password }) => confirmPassword === password, {
        message: messages.confirmPassword,
        path: ["confirmPassword"],
    });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { signUp } = useAuthContext();

    async function onSubmit(data: SignUpFormData) {
        try {
            await signUp(data);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-10 my-5 w-full"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <AnimatedInput label="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem
                            className={cn(
                                form.getValues("name")
                                    ? "visible"
                                    : "hidden sm:block"
                            )}
                        >
                            <FormControl>
                                <AnimatedInput
                                    label="E-mail"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem
                            className={cn(
                                form.getValues("email")
                                    ? "visible"
                                    : "hidden sm:block"
                            )}
                        >
                            <FormControl>
                                <AnimatedInput
                                    label="Password"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem
                            className={cn(
                                form.getValues("password")
                                    ? "visible"
                                    : "hidden sm:block"
                            )}
                        >
                            <FormControl>
                                <AnimatedInput
                                    type="password"
                                    label="Confirm Password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col gap-5 items-center">
                    <SubmitButton isLoading={form.formState.isSubmitting}>
                        Continue
                    </SubmitButton>
                    <FormRedirectLink
                        href="/auth/signin"
                        initialSentence="Already have an account?"
                        flashyText="Login"
                    />
                </div>
            </form>
        </Form>
    );
}
