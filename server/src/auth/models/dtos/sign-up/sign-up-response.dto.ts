import { OAuthProvider, UserRoles } from "@prisma/client";

export class SignUpResponseDto {
    id: number;
    name: string;
    email: string;
    oauth: boolean;
    oauthProvider: OAuthProvider | null;
    country: string | null;
    emailConfirmed: boolean;
    biography: string | null;
    roles: UserRoles[];
    userProfileId: number | null;
}
