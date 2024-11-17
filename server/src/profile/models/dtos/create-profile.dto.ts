import {
    ArrayNotEmpty,
    IsHexadecimal,
    IsNotEmpty,
    IsOptional,
    IsUrl,
} from "class-validator";
import { SocialMediaModel } from "../object-values/social-media.model";

export class CreateProfileDto {
    @IsNotEmpty()
    @IsHexadecimal()
    color: string;

    @IsOptional()
    @IsUrl()
    profileImageUrl?: string | null;

    @IsNotEmpty()
    @ArrayNotEmpty()
    socialMedias: SocialMediaModel[];
}
