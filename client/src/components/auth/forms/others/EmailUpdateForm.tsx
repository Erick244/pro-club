"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
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
import { useAuthContext } from "@/contexts/AuthContext";
import { customFetch } from "@/functions/api/custom-fetch";
import { formMessages } from "@/messages/form.messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const messages = formMessages["EmailUpdateForm"];
const emailUpdateSchema = z.object({
    email: z.string().email(messages.email),
});

type EmailUpdateFormData = z.infer<typeof emailUpdateSchema>;

export function EmailUpdateForm() {
    const form = useForm<EmailUpdateFormData>({
        resolver: zodResolver(emailUpdateSchema),
        defaultValues: {
            email: "",
        },
    });

    const { signOut } = useAuthContext();

    async function onSubmit({ email }: EmailUpdateFormData) {
        try {
            await customFetch("/users/update/email", {
                auth: true,
                method: "PUT",
                body: { email },
            });

            await signOut(`/auth/signin?email=${encodeURIComponent(email)}`);

            toast({
                title: "Success",
                description:
                    "Your email has been updated. Now you can sign in with your new email.",
            });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
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

                <div className="flex justify-end gap-5">
                    <DialogClose asChild>
                        <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <SubmitButton
                        className="w-auto h-auto"
                        isLoading={form.formState.isSubmitting}
                    >
                        Update
                    </SubmitButton>
                </div>
            </form>
        </Form>
    );
}
