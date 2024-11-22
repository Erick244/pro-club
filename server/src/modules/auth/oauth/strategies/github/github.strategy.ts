import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github";
import { VerifyCallback } from "passport-google-oauth20";
import { OAuthGithubEnvNames } from "../../../../../common/models/enums/env-names.enum";
import { OAuthDto } from "../../../modules/oauth/models/dtos/oauth.dto";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get(OAuthGithubEnvNames.GITHUB_CLIENT_ID),
            clientSecret: configService.get(
                OAuthGithubEnvNames.GITHUB_CLIENT_SECRET,
            ),
            callbackURL: configService.get(
                OAuthGithubEnvNames.GITHUB_CALLBACK_URL,
            ),
            scope: ["user", "user:email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        const req = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!req.ok) {
            done(
                new InternalServerErrorException("Error on get Github Emails"),
                null,
            );
            return;
        }

        const email = (await req.json())[0].email;
        const { username } = profile;

        const dto: OAuthDto = {
            email,
            name: username,
            provider: "Github",
        };

        done(null, dto);
    }
}
