import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "src/db/prisma.service";
import { OAuthController } from "./controllers/oauth.controller";
import { OAuthExceptionFilter } from "./filters/oauth-exception.filter";
import { OAuthService } from "./services/oauth.service";
import { DiscordStrategy } from "./strategies/discord.strategy";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
    imports: [PassportModule.register({ defaultStrategy: "google" })],
    controllers: [OAuthController],
    providers: [
        OAuthService,
        GoogleStrategy,
        FacebookStrategy,
        DiscordStrategy,
        PrismaService,
        OAuthExceptionFilter,
    ],
})
export class OAuthModule {}
