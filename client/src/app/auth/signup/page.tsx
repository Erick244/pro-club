import { SignUpForm } from "@/components/auth/forms/SignUpForm";
import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";
import { FormContainer } from "@/components/utils/forms/FormContainer";

export default function Page() {
    return (
        <div className="mt-5 space-y-16">
            <div className="flex flex-col justify-center items-center">
                <H1>REGISTER</H1>
                <Muted className="text-center">
                    FILL IN THE FIELDS BELOW TO REGISTER A NEW ACCOUNT.
                </Muted>
            </div>

            <FormContainer>
                <SignUpForm />
            </FormContainer>
        </div>
    );
}
