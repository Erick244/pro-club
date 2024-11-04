import { ExecutionContext, NotAcceptableException } from "@nestjs/common";
import { Request } from "express";
import { OAuthUser, oauthUserFactory } from "./oauth-user.decorator";

describe("OAuthUserDecorator", () => {
    it("should be defined", () => {
        expect(OAuthUser).toBeDefined();
    });

    it("should return the oauth user from the request", () => {
        const mockRequest = {
            user: {
                name: "test",
                email: "test@test.com",
                provider: "Google",
            },
        } as unknown as Request;

        const mockCtx = {
            switchToHttp: () => ({
                getRequest: () => mockRequest,
            }),
        } as unknown as ExecutionContext;

        expect(oauthUserFactory(null, mockCtx)).toEqual(mockRequest.user);
    });

    it("should throw a NotAcceptableException if oauth user object not contains the provider", () => {
        const mockRequest = {
            user: {
                name: "test",
                email: "test@test.com",
            },
        } as unknown as Request;

        const mockCtx = {
            switchToHttp: () => ({
                getRequest: () => mockRequest,
            }),
        } as unknown as ExecutionContext;

        expect(() => oauthUserFactory(null, mockCtx)).toThrow(
            NotAcceptableException,
        );
    });
});
