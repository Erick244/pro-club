import {
    ExecutionContext,
    ForbiddenException,
    NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "../../db/prisma.service";
import { EmailConfirmedGuard } from "./email-confirmed.guard";

describe("EmailConfirmedGuard", () => {
    let guard: EmailConfirmedGuard;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EmailConfirmedGuard,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        guard = module.get(EmailConfirmedGuard);
        prismaService = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    const req = {
        body: {},
    } as unknown as Request;

    const mockContext = {
        switchToHttp: () => ({
            getRequest: () => req,
        }),
    } as unknown as ExecutionContext;

    describe("canActivate", () => {
        it("should return true if user.emailConfirmed is true", async () => {
            req.body.email = "test@example.com";

            const user = {
                emailConfirmed: true,
            } as unknown as User;

            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                user,
            );

            expect(await guard.canActivate(mockContext)).toBe(true);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: "test@example.com",
                },
            });
        });

        it("should throw ForbiddenException if user.emailConfirmed is false", async () => {
            req.body.email = "test@example.com";

            const user = {
                emailConfirmed: false,
            } as unknown as User;

            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                user,
            );

            await expect(guard.canActivate(mockContext)).rejects.toThrow(
                ForbiddenException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: "test@example.com",
                },
            });
        });

        it("should throw NotFoundException if user not exist", async () => {
            req.body.email = "test@example.com";

            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                null,
            );

            await expect(guard.canActivate(mockContext)).rejects.toThrow(
                NotFoundException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: "test@example.com",
                },
            });
        });

        it("should throw ForbiddenException if body.email not exist", async () => {
            req.body.email = undefined;

            await expect(guard.canActivate(mockContext)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });
});
