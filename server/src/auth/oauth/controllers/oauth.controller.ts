import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard as OAuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { ONE_MONTH_IN_SECONDS } from "src/constants";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { OAuthService } from "../services/oauth.service";

@Controller("/oauth")
export class OAuthController {
    constructor(
        private oAuthService: OAuthService,
        private configService: ConfigService,
    ) {}

    @Get("/google")
    @UseGuards(OAuthGuard("google"))
    async googleAuth() {}

    @Get("/google/callback")
    @UseGuards(OAuthGuard("google"))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(req.user as OAuthDto);

        const authTokenName = await this.configService.get("AUTH_TOKEN_NAME");
        res.cookie(authTokenName, authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: ONE_MONTH_IN_SECONDS,
        });

        const redirectUrl = await this.configService.get("FRONTEND_URL");
        return res.redirect(redirectUrl);
    }

    @Get("/facebook")
    @UseGuards(OAuthGuard("facebook"))
    async facebookAuth() {}

    @Get("/facebook/callback")
    @UseGuards(OAuthGuard("facebook"))
    async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(req.user as OAuthDto);

        const authTokenName = await this.configService.get("AUTH_TOKEN_NAME");
        res.cookie(authTokenName, authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: ONE_MONTH_IN_SECONDS,
        });

        const redirectUrl = await this.configService.get("FRONTEND_URL");
        return res.redirect(redirectUrl);
    }
}
