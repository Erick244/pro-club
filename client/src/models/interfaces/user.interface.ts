import { OAuthProvider } from "../enums/oauth-provider.enum";
import { UserRoles } from "../enums/user-roles.enum";

export class User {
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
