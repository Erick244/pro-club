import { ProfileGamesForm } from "@/components/auth/forms/sign-up/profile/games/ProfileGamesForm";
import { IntroductionCardSection } from "@/components/auth/sections/IntroductionCardSection";
import { IntroductionSection } from "@/components/auth/sections/IntroductionSection";
import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";
import { FormContainer } from "@/components/utils/forms/containers/FormContainer";

const introductionTexts = {
    h1: "GAMES",
    muted: "Select the online games you usually play on.",
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

            <FormContainer className="m-auto sm:max-w-xl lg:max-w-2xl lg:w-full lg:m-0">
                <ProfileGamesForm />
            </FormContainer>
        </div>
    );
}
