"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { AnimatedInput } from "@/components/utils/forms/AnimatedInput";
import { FormRedirectLink } from "@/components/utils/forms/FormRedirectLink";
import { SubmitButton } from "@/components/utils/forms/SubmitButton";
import { cn } from "@/lib/utils";
import { signUpMessages } from "@/messages/SignUpForm.messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpFormSchema = z
    .object({
        name: z
            .string()
            .min(2, signUpMessages.name.min)
            .max(50, signUpMessages.name.max),
        email: z.string().email(signUpMessages.email),
        password: z
            .string()
            .min(8, signUpMessages.password.min)
            .max(16, signUpMessages.password.max),
        confirmPassword: z
            .string()
            .min(8, signUpMessages.password.min)
            .max(16, signUpMessages.password.max),
    })
    .refine(({ confirmPassword, password }) => confirmPassword === password, {
        message: signUpMessages.confirmPassword,
        path: ["confirmPassword"],
    });

type SignUpFormData = z.infer<typeof signUpFormSchema>;

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

    function onSubmit(data: SignUpFormData) {
        console.log(data);
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
                                <AnimatedInput label="E-mail" {...field} />
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
                                <AnimatedInput label="Password" {...field} />
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
                                    label="Confirm Password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col gap-5 items-center">
                    <SubmitButton>Continue</SubmitButton>
                    <FormRedirectLink
                        href="/auth/login"
                        initialSentence="Already have an account?"
                        flashyText="Login"
                    />
                </div>
            </form>
        </Form>
    );
}
