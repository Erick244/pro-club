import { ArgumentsHost, UnauthorizedException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Response } from "express";
import { ConfigEnvNames } from "../../../../../common/models/enums/env-names.enum";
import { OAuthExceptionFilter } from "./oauth-exception.filter";

describe("OAuthExceptionFilter", () => {
    let filter: OAuthExceptionFilter;
    let configService: ConfigService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [OAuthExceptionFilter, ConfigService],
        }).compile();

        filter = module.get(OAuthExceptionFilter);
        configService = module.get(ConfigService);
    });

    it("should be defined", () => {
        expect(filter).toBeDefined();
    });

    it("should redirect to frontend url on throw UnauthorizedException", async () => {
        const host = {
            switchToHttp: jest.fn(),
        } as unknown as ArgumentsHost;

        const ctx = {
            getResponse: jest.fn(),
        } as unknown as HttpArgumentsHost;

        const response = {
            redirect: jest.fn(),
        } as unknown as Response;

        const frontendUrl = "URL";

        jest.spyOn(host, "switchToHttp").mockReturnValue(ctx);
        jest.spyOn(ctx, "getResponse").mockReturnValue(response);
        jest.spyOn(configService, "get").mockReturnValue(frontendUrl);
        jest.spyOn(response, "redirect").mockImplementation(() =>
            Promise.resolve(),
        );

        filter.catch(new UnauthorizedException(), host);

        expect(host.switchToHttp).toHaveBeenCalled();
        expect(ctx.getResponse).toHaveBeenCalled();
        expect(configService.get).toHaveBeenCalledWith(
            ConfigEnvNames.FRONTEND_URL,
        );
        expect(response.redirect).toHaveBeenCalledWith(frontendUrl);
    });
});
