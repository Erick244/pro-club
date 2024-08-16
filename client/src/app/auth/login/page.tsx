import { SignInFormForm } from "@/components/auth/forms/SignInForm";
import { AuthAuthFormSection } from "@/components/auth/sections/AuthFormSection";
import { IntroductionCardSection } from "@/components/auth/sections/IntroductionCardSection";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";

const introductionTexts = {
    h1: "LOGIN",
    muted: "Enter with an account or fill in the information to log in your account.",
};

export default function Page() {
    return (
        <div className="mt-5 space-y-10 lg:flex lg:justify-center lg:items-center lg:gap-10">
            <IntroductionSection
                texts={introductionTexts}
                className="lg:hidden"
            />

            <IntroductionCardSection
                texts={introductionTexts}
                className="hidden lg:flex"
            />

            <AuthAuthFormSection className="lg:max-w-4xl lg:w-full">
                <SignInFormForm />
            </AuthAuthFormSection>
        </div>
    );
}
