import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SearchAnimatedInput } from "../inputs/AnimatedInput";

interface ImageCardSelectProps {
    children: React.ReactNode;
}

export function ImageCardSelect({ children }: ImageCardSelectProps) {
    return <div className="space-y-5 w-full">{children}</div>;
}

interface ImageCardSelectOptionsProps {
    children: React.ReactNode;
}

export function ImageCardSelectOptions({
    children,
}: ImageCardSelectOptionsProps) {
    return (
        <div className="overflow-y-scroll max-h-[400px] p-5 flex justify-evenly flex-wrap gap-5">
            {children}
        </div>
    );
}

interface ImageCardSelectSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export function ImageCardSelectSearch({
    onSearch,
}: ImageCardSelectSearchProps) {
    const [query, setQuery] = useState<string>("");

    function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        setQuery(e.target.value);
        handleSearch();
    }

    const handleSearch = useDebouncedCallback(() => onSearch(query), 300);

    return (
        <div className="flex justify-center">
            <SearchAnimatedInput
                className="mt-5 w-10/12"
                onChange={handleOnChange}
            />
        </div>
    );
}

interface ImageCardSelectOptionProps {
    name: string;
    capeImageUrl: string;
    selected?: boolean;
    onImageCardSelect: () => void;
}

export function ImageCardSelectOption({
    capeImageUrl,
    name,
    selected = false,
    onImageCardSelect,
}: ImageCardSelectOptionProps) {
    const [isSelected, setIsSelected] = useState<boolean>(selected);

    function handlerClick() {
        setIsSelected(!isSelected);

        onImageCardSelect();
    }

    return (
        <div
            className={cn(
                "transition-all h-[200px] w-[150px] relative cursor-pointer select-none group overflow-hidden border-2 rounded-lg active:scale-95",
                selected
                    ? "border-primary shadow-lg shadow-primary"
                    : "border-foreground"
            )}
            onClick={handlerClick}
        >
            <Image
                priority
                className="w-full h-full transition-all group-hover:scale-110"
                src={capeImageUrl}
                width={150}
                height={200}
                alt="Card image"
            />

            <p className="z-10 transition-all font-semibold text-xs text-center w-full absolute -bottom-10 left-1/2 -translate-x-1/2 bg-primary py-2 dark:text-secondary text-foreground group-hover:bottom-0">
                {name}
            </p>

            <CheckIcon
                className={cn(
                    "z-10 transition-all w-20 h-20 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2",
                    selected ? "opacity-100" : "opacity-0"
                )}
            />

            <div
                className={cn(
                    "bg-muted/30 w-full h-full absolute inset-0",
                    selected ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
