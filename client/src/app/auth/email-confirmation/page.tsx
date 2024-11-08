import { EmailConfirmationForm } from "@/components/auth/forms/others/EmailConfirmationForm";
import { IntroductionCardSection } from "@/components/auth/sections/IntroductionCardSection";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";
import { InfoText } from "@/components/email-confirmation/texts/InfoText";
import { H1 } from "@/components/typography/H1";
import { FormContainer } from "@/components/utils/forms/containers/FormContainer";

export default function Page() {
    return (
        <div className="mt-5 space-y-10 lg:flex lg:justify-center lg:items-center lg:gap-10">
            <IntroductionSection className="lg:hidden">
                <H1>CONFIRMATION</H1>
                <InfoText />
            </IntroductionSection>

            <IntroductionCardSection className="hidden lg:flex">
                <H1 className="dark:text-background text-foreground">
                    CONFIRMATION
                </H1>
                <InfoText className="dark:text-background text-foreground" />
            </IntroductionCardSection>

            <FormContainer className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-5 max-w-xl w-full m-auto lg:m-0">
                <EmailConfirmationForm />
            </FormContainer>
        </div>
    );
}
