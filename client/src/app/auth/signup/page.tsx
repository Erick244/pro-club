import { H1 } from "@/components/typography/H1";
import { Muted } from "@/components/typography/Muted";

export default function Page() {
    return (
        <div className="mt-5 flex flex-col justify-center items-center">
            <H1>REGISTER</H1>
            <Muted className="text-center">
                FILL IN THE FIELDS BELOW TO REGISTER A NEW ACCOUNT.
            </Muted>
        </div>
    );
}
