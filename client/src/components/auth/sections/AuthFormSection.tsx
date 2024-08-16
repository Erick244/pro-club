import { Divisor } from "@/components/typography/Divisor";
import { H2 } from "@/components/typography/H2";
import { FormContainer } from "@/components/utils/forms/FormContainer";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { OAuthGroupButtons } from "../oauth/buttons/OAuthGroupButtons";

interface AuthFormSectionProps extends HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function AuthFormSection({ children, ...props }: AuthFormSectionProps) {
    return (
        <section {...props} className={cn("space-y-3", props.className)}>
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
                {children}
            </FormContainer>
        </section>
    );
}
