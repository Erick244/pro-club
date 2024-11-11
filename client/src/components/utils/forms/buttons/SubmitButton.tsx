import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "../../loading/Loader";

interface SubmitButtonProps extends ButtonProps {
    isLoading?: boolean;
}

export function SubmitButton({
    children,
    isLoading,
    ...props
}: SubmitButtonProps) {
    return (
        <Button
            {...props}
            disabled={props.disabled || isLoading}
            className={cn("w-4/5 h-12", props.className)}
            type="submit"
        >
            {isLoading ? <Loader /> : children}
        </Button>
    );
}
