import {
    createParamDecorator,
    ExecutionContext,
    NotAcceptableException,
} from "@nestjs/common";
import { OAuthDto } from "../models/dtos/oauth.dto";

export const oauthUserFactory = (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const oAuthUser = request.user as OAuthDto;

    if (!oAuthUser.provider)
        throw new NotAcceptableException("OAuth user is not provided");

    return oAuthUser;
};

export const OAuthUser = createParamDecorator(oauthUserFactory);
