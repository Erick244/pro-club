import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsHexColor,
    IsNotEmpty,
    IsOptional,
    IsUrl,
    ValidateNested,
} from "class-validator";
import { SocialMediaModel } from "../object-values/social-media.model";

export class CreateProfileDto {
    @IsNotEmpty()
    @IsHexColor()
    color: string;

    @IsOptional()
    @IsUrl()
    profileImageUrl?: string | null;

    @IsNotEmpty()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => SocialMediaModel)
    socialMedias: SocialMediaModel[];
}
