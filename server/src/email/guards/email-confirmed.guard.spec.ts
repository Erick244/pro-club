import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { User } from "@prisma/client";
import { EmailConfirmedGuard } from "./email-confirmed.guard";

describe("EmailConfirmedGuard", () => {
    let guard: EmailConfirmedGuard;

    beforeEach(async () => {
        guard = new EmailConfirmedGuard();
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    describe("canActivated", () => {
        const mockReq = {
            user: null,
        };
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => mockReq,
            }),
        } as unknown as ExecutionContext;

        it("should return true", () => {
            mockReq.user = { emailConfirmed: true } as unknown as User;

            expect(guard.canActivate(mockContext)).toBe(true);
        });

        it("should return false", () => {
            mockReq.user = { emailConfirmed: false } as unknown as User;

            expect(guard.canActivate(mockContext)).toBe(false);
        });

        it("should throw ForbiddenException if the req.user is undefined", () => {
            mockReq.user = undefined;

            expect(() => guard.canActivate(mockContext)).toThrow(
                ForbiddenException,
            );
        });
    });
});
