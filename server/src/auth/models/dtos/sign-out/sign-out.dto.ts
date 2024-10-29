import { IsNotEmpty, IsUrl } from "class-validator";

export class SignOutDto {
    @IsNotEmpty()
    @IsUrl()
    redirectPath: string;
}
