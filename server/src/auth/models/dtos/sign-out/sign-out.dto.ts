import { IsNotEmpty, IsUrl } from "class-validator";

export class SignOutDto {
    @IsNotEmpty()
    @IsUrl({ host_whitelist: ["localhost"] })
    redirectPath: string;
}
