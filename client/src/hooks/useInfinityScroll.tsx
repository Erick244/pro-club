"use client";

import { UIEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useInfiniteScroll(initialTake: number, takeIncrement: number) {
    const [take, setTake] = useState(initialTake);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    function reset() {
        setTake(initialTake);
        setSearchTerm("");
    }

    const debouncedUpdateSearchTerm = useDebouncedCallback((term: string) => {
        setSearchTerm(term);
        setIsLoading(false);
    }, 300);

    function handleOnSearch(term: string) {
        setIsLoading(true);
        debouncedUpdateSearchTerm(term);
    }

    function handleOnScroll(e: UIEvent<HTMLElement>) {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        const gapToFindMore = clientHeight * 0.3;

        if (scrollHeight - scrollTop < clientHeight + gapToFindMore) {
            setTake(take + takeIncrement);
        }
    }

    return {
        reset,
        handleOnScroll,
        handleOnSearch,
        isLoading,
        take,
        searchTerm,
    };
}
