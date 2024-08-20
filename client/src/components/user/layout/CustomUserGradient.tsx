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
            className="-z-10 absolute h-screen w-screen top-0 left-0"
        />
    );
}
