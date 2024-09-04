"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    FocusEvent,
    forwardRef,
    HTMLAttributes,
    Ref,
    useId,
    useState,
} from "react";

interface AnimatedInputProps extends HTMLAttributes<HTMLInputElement> {
    label: string;
}

export const AnimatedInput = forwardRef(
    ({ label, ...props }: AnimatedInputProps, ref: Ref<any>) => {
        const inputId = useId();
        const [isFocused, setIsFocused] = useState<boolean>(false);

        function onFocus(e: FocusEvent<HTMLInputElement>) {
            props.onFocus ? props.onFocus(e) : null;

            setIsFocused(true);
        }

        function onBlur(e: FocusEvent<HTMLInputElement>) {
            props.onBlur ? props.onBlur(e) : null;

            if (e.target.value.trim()) return;
            setIsFocused(false);
        }

        return (
            <div className="relative w-full">
                <Label
                    className={cn(
                        "uppercase pl-1 font-light absolute transition-all rounded-sm select-none text-xs",
                        isFocused ? "-top-2 " : "top-3"
                    )}
                    htmlFor={props.id || inputId}
                >
                    {label}
                </Label>
                <Input
                    id={props.id || inputId}
                    {...props}
                    ref={ref}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className={cn(
                        "focus-visible:border-primary bg-transparent border-b-2 border-t-0 border-l-0 border-r-0 border-foreground rounded-t rounded-b-none outline-none ring-0 ring-transparent focus-visible:ring-0 focus-visible:ring-transparent ring-offset-0 focus-visible:ring-offset-0 pl-1",
                        props.className
                    )}
                />
            </div>
        );
    }
);

AnimatedInput.displayName = "AnimatedInput";
