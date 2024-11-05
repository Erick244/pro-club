"use client";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/utils/forms/buttons/SubmitButton";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTimer } from "@/hooks/useTimer";
import { emailConfirmationMessages } from "@/messages/EmailConfirmationForm.messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useForm } from "react-hook-form";
import { EmailUpdateForm } from "./EmailUpdateForm";

const emailConformationFormSchema = z.object({
    code: z.string().min(6, emailConfirmationMessages.code),
});

type EmailConfirmationFormData = z.infer<typeof emailConformationFormSchema>;

//TODO: Clean

export function EmailConfirmationForm() {
    const FIVE_MINUTES_IN_SECONDS = 60 * 5;

    const { formattedTimer, timer, resetTimer } = useTimer(
        FIVE_MINUTES_IN_SECONDS,
        "email-confirmation-timer"
    );

    const form = useForm<EmailConfirmationFormData>({
        resolver: zodResolver(emailConformationFormSchema),
        defaultValues: {
            code: "",
        },
    });

    const { confirmEmailCode, sendEmailConfirmation, user } = useAuthContext();

    async function onSubmit(data: EmailConfirmationFormData) {
        try {
            await confirmEmailCode(data.code);

            toast({
                title: "Success",
                description: "Your email has been confirmed.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    }

    async function resendEmailConfirmation() {
        try {
            if (!user?.email || timer) return;

            await sendEmailConfirmation(user?.email);

            resetTimer();

            toast({
                title: "Success",
                description:
                    "Email sent successfully. Please check your inbox.",
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
                    <SubmitButton disabled={!timer}>Continue</SubmitButton>

                    <Button
                        disabled={!!timer}
                        onClick={(e) => {
                            e.preventDefault();
                            resendEmailConfirmation();
                        }}
                    >
                        {timer ? formattedTimer : "Resend"}
                    </Button>

                    {!timer && (
                        <FormMessage>
                            Your code has expired. Please try resend a new
                            e-mail.
                        </FormMessage>
                    )}

                    <EmailUpdateDialog />
                </div>
            </form>
        </Form>
    );
}

function EmailUpdateDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size={"sm"}
                    variant={"link"}
                    className="text-foreground space-x-1"
                >
                    <span>Need to change your email?</span>
                    <span className="text-primary underline">Click here.</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-5">
                    <DialogTitle>Change E-mail</DialogTitle>
                    <DialogDescription>
                        After updating your e-mail address, you will be asked to
                        log in again.
                    </DialogDescription>
                </DialogHeader>
                <EmailUpdateForm />
            </DialogContent>
        </Dialog>
    );
}
