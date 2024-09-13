import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { VerifyCallback } from "../models/types/verify-callback.type";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get("FACEBOOK_CLIENT_ID"),
            clientSecret: configService.get("FACEBOOK_CLIENT_SECRET"),
            callbackURL: configService.get("FACEBOOK_CALLBACK_URL"),
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
        console.log(profile);
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
