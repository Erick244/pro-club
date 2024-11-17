import { SocialMedia, SocialMediaNames } from "@prisma/client";
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsUrl,
    ValidateIf,
} from "class-validator";

export class SocialMediaModel implements Omit<SocialMedia, "id"> {
    @IsNotEmpty()
    @IsEnum(SocialMediaNames)
    name: SocialMediaNames;

    @IsOptional()
    tag: string | null;

    @IsOptional()
    @IsUrl()
    profileLink: string | null;

    @ValidateIf((obj) => !obj.tag && !obj.profileLink)
    @IsNotEmpty({
        message:
            "At least one of the fields 'Tag' or 'Profile Link' must be filled.",
    })
    tag_or_profile_validator?: unknown;
}
