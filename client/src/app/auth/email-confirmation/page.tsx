import { EmailConfirmationForm } from "@/components/auth/forms/others/EmailConfirmationForm";
import { IntroductionCardSection } from "@/components/auth/sections/IntroductionCardSection";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";
import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";
import { FormContainer } from "@/components/utils/forms/containers/FormContainer";
import { Authorization } from "@/functions/authorizations";

export default function Page() {
    Authorization["/auth/email-confirmation"]();

    return (
        <div className="mt-5 space-y-10 lg:flex lg:justify-center lg:items-center lg:gap-10">
            <IntroductionSection className="lg:hidden">
                <H1>CONFIRMATION</H1>
                <Muted className="text-center text-xs">
                    <MutedText />
                </Muted>
            </IntroductionSection>

            <IntroductionCardSection className="hidden lg:flex">
                <H1 className="dark:text-background text-foreground">
                    CONFIRMATION
                </H1>
                <Muted className="text-center text-xs dark:text-background text-foreground">
                    <MutedText />
                </Muted>
            </IntroductionCardSection>

            <FormContainer className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-5 max-w-xl w-full m-auto lg:m-0">
                <EmailConfirmationForm />
            </FormContainer>
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
