import { ProfileForm } from "@/components/auth/forms/sign-up/ProfileForm";
import { IntroductionCardSectionProfile } from "@/components/auth/sections/IntroductionCardSectionProfile";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";
import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";
import { FormContainer } from "@/components/utils/forms/FormContainer";

const introductionTexts = {
    h1: "PROFILE",
    muted: "Now let's set up your profile.",
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

            <IntroductionCardSectionProfile className="hidden lg:flex">
                <H1 className="dark:text-background text-foreground bg-primary p-2 rounded">
                    {introductionTexts.h1}
                </H1>
                <Muted className="text-center text-xs dark:bg-background bg-foreground text-primary p-2 rounded mt-0.5">
                    {introductionTexts.muted}
                </Muted>
            </IntroductionCardSectionProfile>

            <FormContainer className="m-auto sm:max-w-xl lg:max-w-2xl lg:w-full lg:m-0 bg-foreground/15 border-foreground">
                <ProfileForm />
            </FormContainer>
        </div>
    );
}
