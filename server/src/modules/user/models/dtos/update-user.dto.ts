import { IsEnum, IsOptional, Length } from "class-validator";
import { Countries } from "../enums/countries.enum";

export class UpdateUserDto {
    @IsOptional()
    @Length(2, 50)
    name?: string;

    @IsOptional()
    @Length(0, 256)
    biography?: string | null;

    @IsOptional()
    @IsEnum(Countries, {
        message: "add a valid country code. (br, us, cn...)",
    })
    country?: Countries | null;
}
