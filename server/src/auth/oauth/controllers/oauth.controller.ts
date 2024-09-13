import {
    Controller,
    Get,
    Req,
    Res,
    UseFilters,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard as OAuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { ONE_MONTH_IN_SECONDS } from "src/constants";
import { OAuthExceptionFilter } from "../filters/oauth-exception.filter";
import { OAuthDto } from "../models/dtos/oauth.dto";
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
    async googleAuth(@Req() req: Request, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(req.user as OAuthDto);

        await this.setAuthTokenInCookies(authToken, res);

        return this.redirectToFrontend(res);
    }

    private async setAuthTokenInCookies(token: string, res: Response) {
        const authTokenName = await this.configService.get("AUTH_TOKEN_NAME");

        res.cookie(authTokenName, token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: ONE_MONTH_IN_SECONDS,
        });
    }

    private async redirectToFrontend(res: Response) {
        const redirectUrl = await this.configService.get("FRONTEND_URL");
        return res.redirect(redirectUrl);
    }

    @Get(["/facebook", "/facebook/callback"])
    @UseGuards(OAuthGuard("facebook"))
    async facebookAuth(@Req() req: Request, @Res() res: Response) {
        const authToken = await this.oAuthService.auth(req.user as OAuthDto);

        await this.setAuthTokenInCookies(authToken, res);

        return this.redirectToFrontend(res);
    }
}
