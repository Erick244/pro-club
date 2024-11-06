import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { Response } from "express";
import { PrismaService } from "../../../db/prisma.service";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { OAuthService } from "../services/oauth.service";
import { OAuthController } from "./oauth.controller";

describe("OAuthController", () => {
    let controller: OAuthController;
    let oAuthService: OAuthService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [OAuthController],
            providers: [OAuthService, PrismaService, JwtService, ConfigService],
        }).compile();

        controller = module.get(OAuthController);
        oAuthService = module.get(OAuthService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    const mockRes = {
        redirect: jest.fn(),
        cookie: jest.fn(),
    } as unknown as Response;

    const mockToken = "auth-token";

    describe("/google & /google/callback", () => {
        it("should auth user in oauth google system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Google",
            };

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );

            await controller.googleAuth(mockUser, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(mockRes.cookie).toHaveBeenCalled();
            expect(mockRes.redirect).toHaveBeenCalled();
        });
    });

    describe("/facebook & /facebook/callback", () => {
        it("should auth user in oauth facebook system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Facebook",
            };

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );

            await controller.facebookAuth(mockUser, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(mockRes.cookie).toHaveBeenCalled();
            expect(mockRes.redirect).toHaveBeenCalled();
        });
    });

    describe("/discord & /discord/callback", () => {
        it("should auth user in oauth discord system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Discord",
            };

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );

            await controller.discordAuth(mockUser, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(mockRes.cookie).toHaveBeenCalled();
            expect(mockRes.redirect).toHaveBeenCalled();
        });
    });

    describe("/github & /github/callback", () => {
        it("should auth user in oauth github system", async () => {
            const mockUser: OAuthDto = {
                email: "test@test.com",
                name: "test",
                provider: "Github",
            };

            jest.spyOn(oAuthService, "auth").mockImplementation(
                async () => mockToken,
            );

            await controller.githubAuth(mockUser, mockRes);

            expect(oAuthService.auth).toHaveBeenCalledWith(mockUser);
            expect(mockRes.cookie).toHaveBeenCalled();
            expect(mockRes.redirect).toHaveBeenCalled();
        });
    });
});
