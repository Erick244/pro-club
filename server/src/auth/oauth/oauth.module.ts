import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "src/db/prisma.service";
import { OAuthController } from "./controllers/oauth.controller";
import { OAuthService } from "./services/oauth.service";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
    imports: [PassportModule.register({ defaultStrategy: "google" })],
    controllers: [OAuthController],
    providers: [OAuthService, GoogleStrategy, PrismaService],
})
export class OAuthModule {}
