import { SocialMediaNames } from "../enums/social-media-names.enum";

export interface SocialMedia {
    name: SocialMediaNames;
    tag?: string | null;
    profileLink?: string | null;
}
