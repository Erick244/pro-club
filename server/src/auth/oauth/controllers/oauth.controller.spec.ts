import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { Request, Response } from "express";
import { PrismaService } from "../../../db/prisma.service";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { OAuthService } from "../services/oauth.service";
import { OAuthController } from "./oauth.controller";

describe("OAuthController", () => {
    let controller: OAuthController;
    let service: OAuthService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [OAuthController],
            providers: [OAuthService, PrismaService, JwtService, ConfigService],
        }).compile();

        controller = module.get(OAuthController);
        service = module.get(OAuthService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    const mockUser: OAuthDto = {
        email: "test@test.com",
        name: "test",
        provider: "Google",
    };

    const mockReq = { user: mockUser } as unknown as Request;
    const mockRes = {
        redirect: jest.fn(),
        cookie: jest.fn(),
    } as unknown as Response;

    const mockToken = "auth-token";

    describe("/google & /google/callback", () => {
        it("should auth user in oauth google system", async () => {
            jest.spyOn(service, "auth").mockImplementation(
                async () => mockToken,
            );
            jest.spyOn(controller, "setAuthTokenInCookies").mockImplementation(
                async () => Promise.resolve(),
            );
            jest.spyOn(controller, "redirectToFrontend").mockImplementation(
                async () => mockRes.redirect("URL"),
            );

            expect(
                await controller.googleAuth(mockReq, mockRes),
            ).toBeUndefined();
            expect(service.auth).toHaveBeenCalledWith(mockUser);
            expect(controller.setAuthTokenInCookies).toHaveBeenCalledWith(
                mockToken,
                mockRes,
            );
            expect(controller.redirectToFrontend).toHaveBeenCalledWith(mockRes);
        });
    });
});
