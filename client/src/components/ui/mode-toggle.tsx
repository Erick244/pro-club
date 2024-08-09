"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    function themToggle() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        <Button
            className="overflow-hidden relative"
            variant="outline"
            size="icon"
            onClick={themToggle}
        >
            <Sun className="transition-all duration-300 h-[1.2rem] w-[1.2rem] dark:translate-y-7 translate-y-0" />
            <Moon className="absolute transition-all duration-300 h-[1.2rem] w-[1.2rem] -translate-y-7 dark:translate-y-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
