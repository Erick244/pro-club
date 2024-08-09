import { ThemeProvider } from "./ThemeProvider";

interface GlobalProvidersProps {
    children: React.ReactNode;
}

export function GlobalProviders({ children }: GlobalProvidersProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
        </ThemeProvider>
    );
}
