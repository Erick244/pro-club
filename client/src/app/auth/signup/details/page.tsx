import { SignUpDetailsForm } from "@/components/auth/forms/sign-up/SignUpDetailsForm";
import { IntroductionCardSection } from "@/components/auth/sections/IntroductionCardSection";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";
import { IntroductionCardSectionTitle } from "@/components/signup-details/texts/IntroductionSectionTitle";
import { Muted } from "@/components/typography/Muted";
import { FormContainer } from "@/components/utils/forms/containers/FormContainer";

const introductionTexts = {
    muted: "Fill in a few more information's to complete your registration.",
};

export default function Page() {
    return (
        <div className="mt-5 space-y-10 lg:flex lg:justify-center lg:items-center lg:gap-10">
            <IntroductionSection className="lg:hidden">
                <IntroductionCardSectionTitle />
                <Muted className="text-center text-xs">
                    {introductionTexts.muted}
                </Muted>
            </IntroductionSection>

            <IntroductionCardSection className="hidden lg:flex">
                <IntroductionCardSectionTitle />
                <Muted className="text-center text-xs dark:text-background text-foreground">
                    {introductionTexts.muted}
                </Muted>
            </IntroductionCardSection>

            <FormContainer className="m-auto sm:max-w-xl lg:max-w-2xl lg:w-full lg:m-0">
                <SignUpDetailsForm />
            </FormContainer>
        </div>
    );
}
