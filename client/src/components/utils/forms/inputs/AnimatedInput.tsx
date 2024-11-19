"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, SearchIcon } from "lucide-react";
import {
    FocusEvent,
    forwardRef,
    HTMLAttributes,
    HTMLInputTypeAttribute,
    MouseEvent,
    Ref,
    useId,
    useState,
} from "react";

interface AnimatedInputProps extends HTMLAttributes<HTMLInputElement> {
    label: string;
    value?: string;
    type?: HTMLInputTypeAttribute;
}

export const AnimatedInput = forwardRef(
    ({ label, ...props }: AnimatedInputProps, ref: Ref<any>) => {
        const inputId = useId();
        const [isFocused, setIsFocused] = useState<boolean>(!!props.value);
        const [currentType, setCurrentType] = useState<HTMLInputTypeAttribute>(
            props?.type || "text"
        );

        function onFocus(e: FocusEvent<HTMLInputElement>) {
            props.onFocus ? props.onFocus(e) : null;

            setIsFocused(true);
        }

        function onBlur(e: FocusEvent<HTMLInputElement>) {
            props.onBlur ? props.onBlur(e) : null;

            if (e.target.value.trim()) return;
            setIsFocused(false);
        }

        function togglePasswordVisibility(e: MouseEvent<HTMLButtonElement>) {
            e.preventDefault();

            if (currentType === "password") {
                setCurrentType("text");
            } else {
                setCurrentType("password");
            }
        }

        return (
            <div className={cn("relative w-full", props.className)}>
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
                    type={currentType}
                    ref={ref}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="focus-visible:border-primary bg-transparent border-b-2 border-t-0 border-l-0 border-r-0 border-foreground rounded-t rounded-b-none outline-none ring-0 ring-transparent focus-visible:ring-0 focus-visible:ring-transparent ring-offset-0 focus-visible:ring-offset-0 pl-1 pr-7"
                />

                {props.type === "password" && (
                    <Button
                        onClick={togglePasswordVisibility}
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 hover:bg-transparent"
                    >
                        {currentType === "password" ? (
                            <EyeIcon className="w-5 h-5" />
                        ) : (
                            <EyeOffIcon className="w-5 h-5" />
                        )}
                    </Button>
                )}
            </div>
        );
    }
);

AnimatedInput.displayName = "AnimatedInput";

export function SearchAnimatedInput({
    label = "Search",
    className,
    ...props
}: Partial<AnimatedInputProps>) {
    return (
        <div
            className={cn(
                "flex px-5 mb-3 justify-center items-center gap-2 relative",
                className
            )}
        >
            <SearchIcon className="w-6 h-6 absolute right-5 text-primary" />
            <AnimatedInput {...props} label={label} />
        </div>
    );
}
