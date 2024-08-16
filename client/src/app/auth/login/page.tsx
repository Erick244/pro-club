import { SignInFormForm } from "@/components/auth/forms/SignInForm";
import { AuthAuthFormSection } from "@/components/auth/sections/AuthFormSection";
import { IntroductionCardSection } from "@/components/auth/sections/IntroductionCardSection";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";
import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";

const introductionTexts = {
    h1: "LOGIN",
    muted: "Enter with an account or fill in the information to log in your account.",
};

export default function Page() {
    return (
        <div className="mt-5 space-y-10 lg:flex lg:justify-center lg:items-center lg:gap-10">
            <IntroductionSection className="lg:hidden">
                <H1>{introductionTexts.h1}</H1>
                <Muted className="text-center text-xs">
                    {introductionTexts.muted}
                </Muted>
            </IntroductionSection>

            <IntroductionCardSection className="hidden lg:flex">
                <H1 className="dark:text-background text-foreground">
                    {introductionTexts.h1}
                </H1>
                <Muted className="text-center text-xs dark:text-background text-foreground">
                    {introductionTexts.muted}
                </Muted>
            </IntroductionCardSection>

            <AuthAuthFormSection className="lg:max-w-4xl lg:w-full">
                <SignInFormForm />
            </AuthAuthFormSection>
        </div>
    );
}
