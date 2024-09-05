import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { Request } from "express";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { OAuthService } from "../services/oauth.service";

@Controller("/oauth")
export class OAuthController {
    constructor(private oAuthService: OAuthService) {}

    @Get("/google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {}

    @Get("/google/callback")
    @UseGuards(AuthGuard("google"))
    googleAuthRedirect(@Req() req: Request) {
        const { email, name } = req.user as User;

        const dto: OAuthDto = {
            email,
            name,
            provider: "Google",
        };

        return this.oAuthService.auth(dto);
    }
}
