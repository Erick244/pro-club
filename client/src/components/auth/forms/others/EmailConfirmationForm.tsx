"use client";
import { z } from "zod";

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
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import { FormRedirectLink } from "@/components/utils/forms/links/FormRedirectLink";
import { emailConfirmationMessages } from "@/messages/EmailConfirmationForm.messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useForm } from "react-hook-form";

const emailConformationFormSchema = z.object({
    code: z.string().min(6, emailConfirmationMessages.code),
});

type EmailConfirmationFormData = z.infer<typeof emailConformationFormSchema>;

export function EmailConfirmationForm() {
    const form = useForm<EmailConfirmationFormData>({
        resolver: zodResolver(emailConformationFormSchema),
        defaultValues: {
            code: "",
        },
    });

    function onSubmit(data: EmailConfirmationFormData) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-10 my-5 w-full flex flex-col items-center"
            >
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex justify-center uppercase text-xs">
                                Confirmation Code
                            </FormLabel>
                            <FormControl>
                                <InputOTP
                                    className="w-full"
                                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                    maxLength={6}
                                    {...field}
                                >
                                    <InputOTPGroup className="mt-5 mb-2 w-full justify-around  gap-2 sm:justify-center sm:gap-5 ">
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSeparator />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription className="text-xs">
                                Please enter the code confirmation sent to your
                                e-mail.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col gap-5 items-center w-full">
                    <SubmitButton>Continue</SubmitButton>
                    <FormRedirectLink
                        href="/auth/signup"
                        initialSentence="Do you want to modify the email?"
                        flashyText="Click here"
                    />
                </div>
            </form>
        </Form>
    );
}
