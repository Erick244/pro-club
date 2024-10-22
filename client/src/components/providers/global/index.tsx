import { Toaster } from "@/components/ui/toaster";
import AuthContextProvider from "@/contexts/AuthContext";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "./ThemeProvider";

interface GlobalProvidersProps {
    children: React.ReactNode;
}

export function GlobalProviders({ children }: GlobalProvidersProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Toaster />
            <JotaiProvider>
                <AuthContextProvider>{children}</AuthContextProvider>
            </JotaiProvider>
        </ThemeProvider>
    );
}
