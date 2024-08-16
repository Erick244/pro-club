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

const signInFormFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(16),
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
                    <Button type="submit" className="w-4/5 h-12">
                        Continue
                    </Button>
                    <Link
                        href="/auth/signup"
                        className="text-center text-sm space-x-1 hover:underline"
                    >
                        <span>Don&apos;t have an account?</span>
                        <span className="text-primary underline">Register</span>
                    </Link>
                </div>
            </form>
        </Form>
    );
}
