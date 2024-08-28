import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({ children, ...props }: ButtonProps) {
    return (
        <Button
            {...props}
            className={cn("w-4/5 h-12", props.className)}
            type="submit"
        >
            {children ? children : "Submit"}
        </Button>
    );
}
