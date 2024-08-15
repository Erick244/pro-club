import { SignUpForm } from "@/components/auth/forms/SignUpForm";
import { OAuthGroupButtons } from "@/components/auth/oauth/buttons/OAuthGroupButtons";
import { Divisor } from "@/components/typography/Divisor";
import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";
import { FormContainer } from "@/components/utils/forms/FormContainer";

export default function Page() {
    return (
        <div className="mt-5 space-y-10">
            <section className="flex flex-col justify-center items-center">
                <H1>REGISTER</H1>
                <Muted className="text-center text-xs">
                    Sign in with an account or fill in the information to
                    register an account.
                </Muted>
            </section>
            <section className="space-y-3">
                <OAuthGroupButtons className="max-w-md m-auto sm:hidden" />
                <Divisor className="sm:hidden">OR</Divisor>
                <FormContainer className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-5 sm:min-h-[500px]">
                    <OAuthGroupButtons className="hidden sm:block w-full" />
                    <Divisor className="hidden sm:flex" direction="vertical">
                        OR
                    </Divisor>
                    <SignUpForm />
                </FormContainer>
            </section>
        </div>
    );
}
