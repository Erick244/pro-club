import { OmitType } from "@nestjs/mapped-types";
import { OAuthProvider } from "@prisma/client";
import { SignUpRequestDto } from "src/auth/models/dtos/sign-up/sign-up-request.dto";

export class OAuthDto extends OmitType(SignUpRequestDto, [
    "confirmPassword",
    "password",
]) {
    provider: OAuthProvider;
}
