"use client";

import { useEffect, useState } from "react";

export function useTimer(startTime: number, localStorageKey: string) {
    const [timer, setTimer] = useState<number>(startTime);

    useEffect(() => {
        const localStorageTimer = localStorage.getItem(localStorageKey);

        if (localStorageTimer) {
            setTimer(+localStorageTimer);
        }
    }, [localStorageKey]);

    useEffect(() => {
        const ONE_SECOND_IN_MS = 1000;

        const interval = setInterval(() => {
            setTimer(timer - 1);

            localStorage.setItem(localStorageKey, JSON.stringify(timer));
        }, ONE_SECOND_IN_MS);

        if (timer === 0) {
            clearInterval(interval);
            localStorage.setItem(localStorageKey, "0");
        }

        return () => {
            clearInterval(interval);
        };
    }, [localStorageKey, timer]);

    function formattedTimer() {
        const ONE_MINUTE_IN_SECONDS = 60;
        const minutes = Math.floor(timer / ONE_MINUTE_IN_SECONDS);
        const seconds = Math.floor(timer - minutes * 60);

        const pad = (n: number) => (n < 10 ? `0${n}` : n);

        return `${pad(minutes)}:${pad(seconds)}`;
    }

    function resetTimer() {
        localStorage.removeItem(localStorageKey);
        setTimer(startTime);
    }

    return {
        timer,
        formattedTimer: formattedTimer(),
        resetTimer,
    };
}
