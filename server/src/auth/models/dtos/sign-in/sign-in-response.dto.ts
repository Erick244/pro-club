import { User } from "@prisma/client";

export class SignInDto {
    user: User;

    authToken: string;
}
