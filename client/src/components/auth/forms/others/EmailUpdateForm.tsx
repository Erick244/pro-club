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
import { AnimatedInput } from "@/components/utils/forms/inputs/AnimatedInput";
import { API_BASE_URL } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { authFetch } from "@/functions/api/auth-fetch";
import { throwDefaultError } from "@/functions/errors/exceptions";
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
            const resp = await authFetch(`${API_BASE_URL}/users/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (!resp.ok) {
                await throwDefaultError(resp);
            }

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
                    <Button type="submit">Update</Button>
                </div>
            </form>
        </Form>
    );
}
