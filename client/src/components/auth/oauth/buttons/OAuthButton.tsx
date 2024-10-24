import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OAuthButtonProps extends ButtonProps {
    children: React.ReactNode;
}

export function OAuthButton({ children, ...props }: OAuthButtonProps) {
    return (
        <Button
            {...props}
            className={cn("w-full border border-foreground", props.className)}
            asChild
        >
            {children}
        </Button>
    );
}
