import { OmitType } from "@nestjs/mapped-types";
import { OAuthProvider } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";
import { SignUpRequestDto } from "../../../../models/dtos/sign-up/sign-up-request.dto";

export class OAuthDto extends OmitType(SignUpRequestDto, [
    "confirmPassword",
    "password",
]) {
    @IsNotEmpty()
    @IsEnum(OAuthProvider)
    provider: OAuthProvider;
}
