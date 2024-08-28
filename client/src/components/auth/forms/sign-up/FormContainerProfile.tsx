"use client";

import { profileColorAtom } from "@/atoms/user.atoms";
import {
    FormContainer,
    FormContainerProps,
} from "@/components/utils/forms/containers/FormContainer";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

export function FormContainerProfile({
    children,
    ...props
}: FormContainerProps) {
    const profileColor = useAtomValue(profileColorAtom);

    const addAlpha = (hex: string, alpha: number) => {
        return (
            hex +
            Math.round(alpha * 255)
                .toString(16)
                .padStart(2, "0")
        );
    };

    return (
        <FormContainer
            {...props}
            style={{
                boxShadow: profileColor
                    ? `0px 0px 10px ${profileColor}`
                    : "none",
                backgroundColor: profileColor
                    ? addAlpha(profileColor, 0.15)
                    : "none",
            }}
            className={cn("bg-primary/15", props.className)}
        >
            {children}
        </FormContainer>
    );
}
