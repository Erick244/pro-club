import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/db/prisma.service";
import { OAuthModule } from "./oauth/oauth.module";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "30d" },
        }),
        OAuthModule,
    ],
    providers: [PrismaService],
    controllers: [],
})
export class AuthModule {}
