import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { ConfigEnvNames } from "../../../../common/models/enums/env-names.enum";

@Catch(UnauthorizedException)
export class OAuthExceptionFilter implements ExceptionFilter {
    constructor(private configService: ConfigService) {}

    catch(exception: UnauthorizedException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        const frontendUrl = this.configService.get(ConfigEnvNames.FRONTEND_URL);
        res.redirect(frontendUrl);
    }
}
