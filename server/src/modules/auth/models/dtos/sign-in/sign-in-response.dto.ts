import { User } from "@prisma/client";

export class SignInResponseDto {
    user: Omit<User, "password">;

    authToken: string;
}
