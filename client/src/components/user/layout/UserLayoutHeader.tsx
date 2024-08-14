import { ModeToggle } from "@/components/ui/mode-toggle";
import { InlineLogo } from "@/components/utils/app-logos/InlineLogo";
import { LangSelect } from "@/components/utils/lang/LangSelect";

export function UserLayoutHeader() {
    return (
        <header className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
                <ModeToggle />
                <LangSelect />
            </div>
            <div className="flex justify-center items-center">
                <InlineLogo />
            </div>
        </header>
    );
}
