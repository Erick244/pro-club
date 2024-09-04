"use client";

import { profileColorAtom } from "@/atoms/user.atoms";
import { useAtomValue } from "jotai";

export function CustomUserGradient() {
    const profileColor = useAtomValue(profileColorAtom);

    const customGradient = `linear-gradient(to bottom left, hsl(var(--background)) 60%, ${
        profileColor ? profileColor : "hsl(var(--primary))"
    } 100%)`;

    return (
        <div
            style={{ background: customGradient }}
            className="transition-all duration-300 -z-10 fixed min-h-screen w-screen inset-0"
        />
    );
}
