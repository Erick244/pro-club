import { SignUpForm } from "@/components/auth/forms/SignUpForm";
import { OAuthGroupButtons } from "@/components/auth/oauth/buttons/OAuthGroupButtons";
import { Divisor } from "@/components/typography/Divisor";
import { H1 } from "@/components/typography/H1";
import { H2 } from "@/components/typography/H2";
import { Muted } from "@/components/typography/Muted";
import { BlockLogo } from "@/components/utils/app-logos/BlockLogo";
import { FormContainer } from "@/components/utils/forms/FormContainer";

// TODO: Composite this
export default function Page() {
    return (
        <div className="mt-5 space-y-10 lg:flex lg:justify-center lg:items-center lg:gap-10">
            <section className="flex flex-col justify-center items-center lg:hidden">
                <H1>REGISTER</H1>
                <Muted className="text-center text-xs">
                    Sign in with an account or fill in the information to
                    register an account.
                </Muted>
            </section>
            <section className="hidden lg:flex flex-col items-center justify-between bg-primary p-5 rounded-lg gap-10 max-w-[500px]">
                <BlockLogo invert />
                <div className="flex flex-col justify-center items-center">
                    <H1 className="dark:text-background text-foreground">
                        REGISTER
                    </H1>
                    <Muted className="text-center text-xs dark:text-background text-foreground">
                        Sign in with an account or fill in the information to
                        register an account.
                    </Muted>
                </div>
            </section>
            <section className="space-y-3 lg:max-w-4xl lg:w-full">
                <OAuthGroupButtons className="max-w-md m-auto sm:hidden" />
                <Divisor className="sm:hidden">OR</Divisor>
                <FormContainer className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-5 sm:min-h-[500px]">
                    <div className="hidden sm:block w-full space-y-5">
                        <H2 className="text-center">CONTINUE WITH</H2>
                        <OAuthGroupButtons />
                    </div>
                    <Divisor className="hidden sm:flex" direction="vertical">
                        OR
                    </Divisor>
                    <SignUpForm />
                </FormContainer>
            </section>
        </div>
    );
}
