import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, forwardRef, useState } from "react";

export const ImagePickerInput = forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => {
        const [localImageUrl, setLocalImageUrl] = useState<string>("");

        function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
            props.onChange ? props.onChange(e) : e.preventDefault();

            const imageFile = e.target.files?.[0];
            if (!imageFile) return;

            setLocalImageUrl(URL.createObjectURL(imageFile));
        }

        return (
            <div className="transition-all relative rounded-full w-24 h-24 overflow-hidden flex flex-col justify-center items-center border-2 border-foreground hover:bg-foreground/30 group">
                <Input
                    {...props}
                    ref={ref}
                    accept="image/*"
                    multiple={false}
                    type="file"
                    onChange={handleOnChange}
                    className={cn(
                        "absolute w-full h-full opacity-0 cursor-pointer",
                        props.className
                    )}
                />
                <div className="w-full h-full flex justify-center items-center -z-10">
                    {localImageUrl ? (
                        <Image
                            src={localImageUrl}
                            width={150}
                            height={150}
                            alt="Profile Image"
                            className="cursor-pointer aspect-square "
                        />
                    ) : (
                        <span className="bg-background w-full h-full flex justify-center items-center">
                            UN
                        </span>
                    )}
                </div>
                <EditIcon className="transition-all absolute w-4 h-4 group-hover:visible invisible text-background" />
            </div>
        );
    }
);

ImagePickerInput.displayName = "ImagePickerInput";
