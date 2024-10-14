import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/db/prisma.service";
import { OAuthModule } from "./oauth/oauth.module";
import { AuthService } from "./services/auth.service";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "30d" },
        }),
        OAuthModule,
    ],
    providers: [PrismaService, AuthService],
    controllers: [],
})
export class AuthModule {}
