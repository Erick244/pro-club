import { ModeToggle } from "@/components/ui/mode-toggle";
import { Authorization } from "@/functions/authorizations";

export default function Home() {
    Authorization["/"]();

    return (
        <div>
            <ModeToggle />
        </div>
    );
}
