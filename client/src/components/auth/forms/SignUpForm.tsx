"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { AnimatedInput } from "@/components/utils/forms/AnimatedInput";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpFormSchema = z
    .object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(8).max(16),
        confirmPassword: z.string().min(8).max(16),
    })
    .refine(({ confirmPassword, password }) => confirmPassword === password, {
        message: "Passwords don't match",
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
                    <Button type="submit" className="w-4/5 h-12">
                        Continue
                    </Button>
                    <Link
                        href="/auth/login"
                        className="text-center text-sm space-x-1 hover:underline"
                    >
                        <span>Already have an account?</span>
                        <span className="text-primary underline">Login</span>
                    </Link>
                </div>
            </form>
        </Form>
    );
}
