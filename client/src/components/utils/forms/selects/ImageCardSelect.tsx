import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ImageCardSelectProps {
    children: React.ReactNode;
}

export function ImageCardSelect({ children }: ImageCardSelectProps) {
    return <div className="space-y-5">{children}</div>;
}

interface ImageCardSelectOptionsProps {
    children: React.ReactNode;
}

export function ImageCardSelectOptions({
    children,
}: ImageCardSelectOptionsProps) {
    return (
        <div className="overflow-y-scroll max-h-[400px] p-5 flex justify-between flex-wrap gap-5">
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
    placeholder,
}: ImageCardSelectSearchProps) {
    const [query, setQuery] = useState<string>("");

    function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        setQuery(e.target.value);
        handleSearch();
    }

    const handleSearch = useDebouncedCallback(() => onSearch(query), 300);

    return (
        <div className="mt-5 flex items-center gap-2">
            <Input
                onChange={handleOnChange}
                className="bg-transparent border-2 border-primary"
                placeholder={placeholder ? placeholder : "Search..."}
            />
            <Button
                size="icon"
                onClick={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
            >
                <SearchIcon className="text-foreground" />
            </Button>
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
            className="space-y-1 cursor-pointer select-none group"
            onClick={handlerClick}
        >
            <Image
                priority
                className={cn(
                    "rounded-lg w-[100px] h-[150px] border-2 transition-all group-hover:scale-105 group-active:scale-100",
                    selected
                        ? "border-primary shadow-lg shadow-primary"
                        : "border-foreground"
                )}
                src={capeImageUrl}
                width={100}
                height={150}
                alt="Card image"
            />
            <p className="text-xs text-center w-full max-w-[100px]">{name}</p>
        </div>
    );
}
