import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { OAuthFacebookEnvNames } from "../../../../../common/models/enums/env-names.enum";
import { OAuthDto } from "../../../modules/oauth/models/dtos/oauth.dto";
import { VerifyCallback } from "../../../modules/oauth/models/types/verify-callback.type";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get(
                OAuthFacebookEnvNames.FACEBOOK_CLIENT_ID,
            ),
            clientSecret: configService.get(
                OAuthFacebookEnvNames.FACEBOOK_CLIENT_SECRET,
            ),
            callbackURL: configService.get(
                OAuthFacebookEnvNames.FACEBOOK_CALLBACK_URL,
            ),
            profileFields: ["displayName", "email"],
            scope: ["email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        const { displayName, emails } = profile;
        const email = emails[0].value;

        const dto: OAuthDto = {
            email,
            name: displayName,
            provider: "Facebook",
        };

        done(null, dto);
    }
}
