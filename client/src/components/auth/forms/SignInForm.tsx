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
import { signInMessages } from "@/messages/SignInForm.messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInFormFormSchema = z.object({
    email: z.string().email(signInMessages.email),
    password: z
        .string()
        .min(8, signInMessages.password.min)
        .max(16, signInMessages.password.max),
});

type SignInFormFormData = z.infer<typeof signInFormFormSchema>;

export function SignInFormForm() {
    const form = useForm<SignInFormFormData>({
        resolver: zodResolver(signInFormFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: SignInFormFormData) {
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
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
                <div className="flex flex-col gap-5 items-center">
                    <SubmitButton>Continue</SubmitButton>
                    <FormRedirectLink
                        href="/auth/signup"
                        initialSentence="Don't have an account?"
                        flashyText="Register"
                    />
                </div>
            </form>
        </Form>
    );
}
