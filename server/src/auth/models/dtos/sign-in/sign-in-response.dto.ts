import { User } from "@prisma/client";

export class SignInResponseDto {
    user: User;

    authToken: string;
}
