import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/db/prisma.service";
import { JwtEnvNames } from "../models/enums/env-names.enum";
import { AuthController } from "./controllers/auth.controller";
import { OAuthModule } from "./oauth/oauth.module";
import { AuthService } from "./services/auth.service";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env[JwtEnvNames.JWT_SECRET],
            signOptions: { expiresIn: "30d" },
        }),
        OAuthModule,
    ],
    providers: [PrismaService, AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
