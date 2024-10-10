import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { Request, Response } from "express";
import { ONE_MONTH_IN_SECONDS } from "../../../constants";
import { PrismaService } from "../../../db/prisma.service";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { OAuthService } from "../services/oauth.service";
import { OAuthController } from "./oauth.controller";

describe("OAuthController", () => {
    let oAuthController: OAuthController;
    let oAuthService: OAuthService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [OAuthController],
            providers: [OAuthService, PrismaService, JwtService, ConfigService],
        }).compile();

        oAuthController = module.get(OAuthController);
        oAuthService = module.get(OAuthService);
        configService = module.get(ConfigService);
    });

    it("should be defined", () => {
        expect(oAuthController).toBeDefined();
    });

    const mockRes = {
        redirect: jest.fn(),
        cookie: jest.fn(),
    } as unknown as Response;

    const mockToken = "auth-token";

    describe("utilities functions", () => {
        it("should set auth token in cookies", async () => {
            const authTokenName = "auth-token-name";

            jest.spyOn(configService, "get").mockImplementation(
                async () => authTokenName,
            );

            await oAuthController.setAuthTokenInCookies(mockToken, mockRes);

            expect(configService.get).toHaveBeenCalledWith("AUTH_TOKEN_NAME");
            expect(mockRes.cookie).toHaveBeenCalledWith(
                authTokenName,
                mockToken,
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: ONE_MONTH_IN_SECONDS,
                },
            );
        });

        it("should redirect to frontend", async () => {
            const redirectUrl = "URL";

            jest.spyOn(configService, "get").mockImplementation(
                async () => redirectUrl,
            );

            await oAuthController.redirectToFrontend(mockRes);

            expect(configService.get).toHaveBeenCalledWith("FRONTEND_URL");
            expect(mockRes.redirect).toHaveBeenCalledWith(redirectUrl);
        });
    });

    describe("/google & /google/callback", () => {
        it("should auth user in oauth google system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Google",
            };

            const mockReq = { user: mockUser } as unknown as Request;

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );
            jest.spyOn(
                oAuthController,
                "setAuthTokenInCookies",
            ).mockImplementation(async () => Promise.resolve());
            jest.spyOn(
                oAuthController,
                "redirectToFrontend",
            ).mockImplementation(async () => mockRes.redirect("URL"));

            await oAuthController.googleAuth(mockReq, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(oAuthController.setAuthTokenInCookies).toHaveBeenCalledWith(
                mockToken,
                mockRes,
            );
            expect(oAuthController.redirectToFrontend).toHaveBeenCalledWith(
                mockRes,
            );
        });
    });

    describe("/facebook & /facebook/callback", () => {
        it("should auth user in oauth facebook system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Facebook",
            };

            const mockReq = { user: mockUser } as unknown as Request;

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );
            jest.spyOn(
                oAuthController,
                "setAuthTokenInCookies",
            ).mockImplementation(async () => Promise.resolve());
            jest.spyOn(
                oAuthController,
                "redirectToFrontend",
            ).mockImplementation(async () => mockRes.redirect("URL"));

            await oAuthController.facebookAuth(mockReq, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(oAuthController.setAuthTokenInCookies).toHaveBeenCalledWith(
                mockToken,
                mockRes,
            );
            expect(oAuthController.redirectToFrontend).toHaveBeenCalledWith(
                mockRes,
            );
        });
    });

    describe("/discord & /discord/callback", () => {
        it("should auth user in oauth discord system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Discord",
            };

            const mockReq = { user: mockUser } as unknown as Request;

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );
            jest.spyOn(
                oAuthController,
                "setAuthTokenInCookies",
            ).mockImplementation(async () => Promise.resolve());
            jest.spyOn(
                oAuthController,
                "redirectToFrontend",
            ).mockImplementation(async () => mockRes.redirect("URL"));

            await oAuthController.discordAuth(mockReq, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(oAuthController.setAuthTokenInCookies).toHaveBeenCalledWith(
                mockToken,
                mockRes,
            );
            expect(oAuthController.redirectToFrontend).toHaveBeenCalledWith(
                mockRes,
            );
        });
    });

    describe("/github & /github/callback", () => {
        it("should auth user in oauth github system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Github",
            };

            const mockReq = { user: mockUser } as unknown as Request;

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );
            jest.spyOn(
                oAuthController,
                "setAuthTokenInCookies",
            ).mockImplementation(async () => Promise.resolve());
            jest.spyOn(
                oAuthController,
                "redirectToFrontend",
            ).mockImplementation(async () => mockRes.redirect("URL"));

            await oAuthController.githubAuth(mockReq, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(oAuthController.setAuthTokenInCookies).toHaveBeenCalledWith(
                mockToken,
                mockRes,
            );
            expect(oAuthController.redirectToFrontend).toHaveBeenCalledWith(
                mockRes,
            );
        });
    });
});
