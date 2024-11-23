import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { Match } from "../../../validators/match.validator";

export class SignUpRequestDto {
    @IsNotEmpty()
    @Length(2, 50)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 16)
    password: string;

    @IsNotEmpty()
    @Length(8, 16)
    @Match("password", { message: "Passwords do not match" })
    confirmPassword: string;
}
