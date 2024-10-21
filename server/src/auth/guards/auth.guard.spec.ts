import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "../../db/prisma.service";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
    let guard: AuthGuard;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
        },
    };
    const mockJwtService = {
        verifyAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        guard = module.get(AuthGuard);
        prismaService = module.get(PrismaService);
        jwtService = module.get(JwtService);
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    const mockReq = {
        headers: {
            authorization: "",
        },
    } as unknown as Request;

    const mockContext = {
        switchToHttp: () => ({
            getRequest: () => mockReq,
        }),
    } as unknown as ExecutionContext;

    describe("canActivate", () => {
        it("should return true if token is valid and user exists", async () => {
            mockReq.headers.authorization = "Bearer token";

            const user = {
                id: 123,
                email: "test@example.com",
            } as unknown as User;

            const payload = {
                userId: user.id,
                email: user.email,
            };

            jest.spyOn(mockJwtService, "verifyAsync").mockReturnValue(payload);
            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                user,
            );

            expect(await guard.canActivate(mockContext)).toBe(true);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith("token");
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    id: payload.userId,
                    email: payload.email,
                },
            });
            expect(mockReq.user).toEqual(user);
        });

        it("should throw UnauthorizedException if not found token", async () => {
            mockReq.headers.authorization = undefined;

            await expect(guard.canActivate(mockContext)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it("should throw UnauthorizedException if not bearer token", async () => {
            mockReq.headers.authorization = "token";

            await expect(guard.canActivate(mockContext)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it("should throw UnauthorizedException if the token is expired", async () => {
            mockReq.headers.authorization = "Bearer expired-token";

            jest.spyOn(mockJwtService, "verifyAsync").mockImplementation(() => {
                throw new Error("Invalid token");
            });

            await expect(guard.canActivate(mockContext)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(jwtService.verifyAsync).toHaveBeenCalledWith("not-is-token");
        });

        it("should throw UnauthorizedException if user not exist", async () => {
            mockReq.headers.authorization = "Bearer token";

            const payload = {
                userId: 123,
                email: "test@example.com",
            };

            jest.spyOn(mockJwtService, "verifyAsync").mockReturnValue(payload);
            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                null,
            );

            await expect(guard.canActivate(mockContext)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(jwtService.verifyAsync).toHaveBeenCalledWith("token");
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    id: payload.userId,
                    email: payload.email,
                },
            });
        });
    });
});
