import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaService } from "src/db/prisma.service";
import { OAuthController } from "./oauth/controllers/oauth.controller";
import { OAuthService } from "./oauth/services/oauth.service";
import { GoogleStrategy } from "./oauth/strategies/google.strategy";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: "google" }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "30d" },
        }),
    ],
    providers: [GoogleStrategy, OAuthService, PrismaService],
    controllers: [OAuthController],
})
export class AuthModule {}
