import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Flag from "react-country-flag";

export function LangSelect() {
    return (
        <Select defaultValue="EN-US">
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="EN-US" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="PT-BR">
                    <div className="flex justify-between items-center gap-2">
                        <Flag countryCode="BR" svg title="PT-BR" />
                        <span>PT-BR</span>
                    </div>
                </SelectItem>
                <SelectItem value="EN-US">
                    <div className="flex justify-between items-center gap-2">
                        <Flag countryCode="US" svg title="EN-US" />
                        <span>EN-US</span>
                    </div>
                </SelectItem>
                <SelectItem value="ES-LA">
                    <div className="flex justify-between items-center gap-2">
                        <Flag countryCode="AR" svg title="ES-LA" />
                        <span>ES-LA</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
