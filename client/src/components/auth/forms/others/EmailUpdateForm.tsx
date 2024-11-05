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
import { emailUpdateMessages } from "@/messages/EmailUpdateForm.messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const emailUpdateSchema = z.object({
    email: z.string().email(emailUpdateMessages.email),
});

type EmailUpdateFormData = z.infer<typeof emailUpdateSchema>;

export function EmailUpdateForm() {
    const form = useForm<EmailUpdateFormData>({
        resolver: zodResolver(emailUpdateSchema),
        defaultValues: {
            email: "",
        },
    });

    const router = useRouter();

    async function onSubmit({ email }: EmailUpdateFormData) {
        try {
            console.log(email);
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
