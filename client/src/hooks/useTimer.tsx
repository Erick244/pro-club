"use client";

import { useEffect, useState } from "react";

export function useTimer(startTime: number) {
    const [timer, setTimer] = useState<number>(startTime);

    useEffect(() => {
        const ONE_SECOND_IN_MS = 1000;

        const interval = setInterval(() => {
            setTimer(timer - 1);
        }, ONE_SECOND_IN_MS);

        if (timer === 0) {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [timer]);

    function formattedTimer() {
        const ONE_MINUTE_IN_SECONDS = 60;
        const minutes = Math.floor(timer / ONE_MINUTE_IN_SECONDS);
        const seconds = Math.floor(timer - minutes * 60);

        const pad = (n: number) => (n < 10 ? `0${n}` : n);

        return `${pad(minutes)}:${pad(seconds)}`;
    }

    function resetTimer() {
        setTimer(startTime);
    }

    return {
        timer,
        formattedTimer: formattedTimer(),
        resetTimer,
    };
}
