import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { OAuthDto } from "../models/dtos/oauth.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
            scope: ["profile", "email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        const { name, emails } = profile;

        const dto: OAuthDto = {
            name: name.givenName,
            email: emails[0].value,
            provider: "Google",
        };

        done(null, dto);
    }
}
