import { Controller, Get, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard as OAuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { ONE_MONTH_IN_SECONDS } from "../../../constants";
import { ConfigEnvNames } from "../../../models/enums/env-names.enum";
import { OAuthUser } from "../decorators/oauth-user.decorator";
import { OAuthExceptionFilter } from "../filters/oauth-exception.filter";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { CookiesNames } from "../models/enums/cookies.enum";
import { OAuthService } from "../services/oauth.service";

@Controller("/oauth")
@UseFilters(OAuthExceptionFilter)
export class OAuthController {
    constructor(
        private oAuthService: OAuthService,
        private configService: ConfigService,
    ) {}

    @Get(["/google", "/google/callback"])
    @UseGuards(OAuthGuard("google"))
    async googleAuth(@OAuthUser() oauthUser: OAuthDto, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(oauthUser);

        this.setAuthTokenInCookies(authToken, res);

        return this.redirectToFrontend(res);
    }

    private setAuthTokenInCookies(token: string, res: Response) {
        res.cookie(CookiesNames.AUTH_TOKEN, token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: ONE_MONTH_IN_SECONDS,
        });
    }

    private async redirectToFrontend(res: Response) {
        const redirectUrl = await this.configService.get(
            ConfigEnvNames.FRONTEND_URL,
        );

        return res.redirect(redirectUrl);
    }

    @Get(["/facebook", "/facebook/callback"])
    @UseGuards(OAuthGuard("facebook"))
    async facebookAuth(@OAuthUser() oauthUser: OAuthDto, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(oauthUser);

        await this.setAuthTokenInCookies(authToken, res);

        return this.redirectToFrontend(res);
    }

    @Get(["/discord", "/discord/callback"])
    @UseGuards(OAuthGuard("discord"))
    async discordAuth(@OAuthUser() oauthUser: OAuthDto, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(oauthUser);

        await this.setAuthTokenInCookies(authToken, res);

        return this.redirectToFrontend(res);
    }

    @Get(["/github", "/github/callback"])
    @UseGuards(OAuthGuard("github"))
    async githubAuth(@OAuthUser() oauthUser: OAuthDto, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(oauthUser);

        await this.setAuthTokenInCookies(authToken, res);

        return this.redirectToFrontend(res);
    }
}
