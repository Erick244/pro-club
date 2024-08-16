import { SignUpForm } from "@/components/auth/forms/SignUpForm";
import { AuthFormSection } from "@/components/auth/sections/AuthFormSection";
import { IntroductionCardSection } from "@/components/auth/sections/IntroductionCardSection";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";
import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";

export default function Page() {
    return (
        <div className="mt-5 space-y-10 lg:flex lg:justify-center lg:items-center lg:gap-10">
            <IntroductionSection className="lg:hidden">
                <H1>VERIFICATION</H1>
                <Muted className="text-center text-xs">
                    <MutedText />
                </Muted>
            </IntroductionSection>

            <IntroductionCardSection className="hidden lg:flex">
                <H1 className="dark:text-background text-foreground">
                    VERIFICATION
                </H1>
                <Muted className="text-center text-xs dark:text-background text-foreground">
                    <MutedText />
                </Muted>
            </IntroductionCardSection>

            <AuthFormSection className="lg:max-w-4xl lg:w-full">
                <SignUpForm />
            </AuthFormSection>
        </div>
    );
}

function MutedText() {
    return (
        <>
            <span>A code has been sent to the e-mail:</span>
            <strong className="text-primary lg:text-accent">
                example@email.com
            </strong>
            <span>. Copy and paste here.</span>
        </>
    );
}
