import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-discord";
import { OAuthDiscordEnvNames } from "../../../../../../common/models/enums/env-names.enum";
import { OAuthDto } from "../../models/dtos/oauth.dto";
import { VerifyCallback } from "../../models/types/verify-callback.type";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, "discord") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get(OAuthDiscordEnvNames.DISCORD_CLIENT_ID),
            clientSecret: configService.get(
                OAuthDiscordEnvNames.DISCORD_CLIENT_SECRET,
            ),
            callbackURL: configService.get(
                OAuthDiscordEnvNames.DISCORD_CALLBACK_URL,
            ),
            scope: ["identify", "email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        const { global_name, email } = profile;

        const dto: OAuthDto = {
            name: global_name,
            email: email,
            provider: "Discord",
        };

        done(null, dto);
    }
}
