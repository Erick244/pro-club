import { ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { AuthUser, authUserFactory } from "./auth-user.decorator";

describe("UserDecorator", () => {
    it("should be defined", () => {
        expect(AuthUser).toBeDefined();
    });

    it("should return the user from the request", () => {
        const mockRequest = {
            user: {
                id: 1,
                email: "test@test.com",
            },
        } as unknown as Request;

        const mockCtx = {
            switchToHttp: () => ({
                getRequest: () => mockRequest,
            }),
        } as unknown as ExecutionContext;

        expect(authUserFactory(null, mockCtx)).toEqual(mockRequest.user);
    });
});
