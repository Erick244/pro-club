"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon, PipetteIcon } from "lucide-react";
import { ChangeEvent, HTMLAttributes, useState } from "react";

interface ColorSelectProps {
    onSelectColor: (color: string) => void;
    predefinedColors: string[];
}

export function ColorSelect({
    onSelectColor,
    predefinedColors,
}: ColorSelectProps) {
    const [colorSelected, setColorSelected] = useState<string | undefined>(
        undefined
    );

    function changeColor(color: string) {
        onSelectColor(color);
        setColorSelected(color);
    }

    return (
        <div className="border-2 border-foreground rounded p-2 flex gap-2 flex-wrap max-w-[400px] justify-between">
            {predefinedColors.map((color, i) => (
                <ColorSelectOption
                    color={color}
                    selected={color === colorSelected}
                    onClick={() => changeColor(color)}
                    key={i}
                />
            ))}
            <ColorSelectCustomColor
                colorSelected={colorSelected}
                onChangeCustomColor={changeColor}
            />
        </div>
    );
}

interface ColorSelectOptionProps extends HTMLAttributes<HTMLElement> {
    color: string;
    selected?: boolean;
}

export function ColorSelectOption({
    color,
    selected,
    ...props
}: ColorSelectOptionProps) {
    return (
        <div
            {...props}
            style={{
                backgroundColor: color,
                boxShadow: selected ? `0px 0px 10px ${color}` : "none",
            }}
            className={cn(
                "transition-all overflow-hidden rounded-full h-10 w-10 cursor-pointer border-2 border-foreground flex justify-center items-center",
                props.className
            )}
        >
            <CheckIcon
                className={cn(
                    "bg-background rounded-full p-1 transition-all",
                    selected ? "translate-y-0" : "translate-y-[150%]"
                )}
            />
        </div>
    );
}

interface ColorSelectCustomColor {
    colorSelected?: string;
    onChangeCustomColor: (color: string) => void;
}

export function ColorSelectCustomColor({
    colorSelected,
    onChangeCustomColor,
}: ColorSelectCustomColor) {
    function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        const color = e.target.value;
        onChangeCustomColor(color);
    }

    return (
        <div
            style={{ backgroundColor: colorSelected }}
            className="transition-all bg-primary relative flex justify-center items-center rounded-lg h-10 w-10 cursor-pointer border-2 border-foreground overflow-hidden"
        >
            <PipetteIcon className="bg-background p-1 rounded" />
            <Input
                onChange={handleOnChange}
                defaultValue={colorSelected}
                type="color"
                className="absolute cursor-pointer w-full h-full top-0 left-0 opacity-0"
            />
        </div>
    );
}
