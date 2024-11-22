import { ForbiddenException } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { PrismaService } from "../../../../../common/services/prisma.service";
import { OAuthDto } from "../models/dtos/oauth.dto";
import { OAuthService } from "./oauth.service";

describe("OAuthService", () => {
    let service: OAuthService;
    let jwtService: JwtService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };
    const mockDto: OAuthDto = {
        name: "test",
        email: "test@example.com",
        provider: "Google",
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    global: true,
                    secret: "test-secret",
                    signOptions: { expiresIn: "30d" },
                }),
            ],
            providers: [
                OAuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get(OAuthService);
        jwtService = module.get(JwtService);
        prismaService = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    const mockUser = {
        id: 1,
        email: "test@example.com",
        oauth: true,
    } as unknown as User;

    describe("auth", () => {
        it("should return JWT token", async () => {
            const payload = {
                userId: mockUser.id,
            };

            jest.spyOn(jwtService, "signAsync").mockResolvedValue("auth-token");

            expect(await service.signIn(mockUser)).toBe("auth-token");
            expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
        });

        it("should create and sign in oauth user", async () => {
            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                null,
            );
            jest.spyOn(mockPrismaService.user, "create").mockResolvedValue(
                mockUser,
            );

            expect(typeof (await service.auth(mockDto))).toBe("string");
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: mockDto.email,
                },
            });
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    name: mockDto.name,
                    email: mockDto.email,
                    oauth: true,
                    oauthProvider: mockDto.provider,
                    emailConfirmed: true,
                },
            });
        });

        it("should sign in a exist oauth user", async () => {
            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                mockUser,
            );

            expect(typeof (await service.auth(mockDto))).toBe("string");
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: mockDto.email,
                },
            });
        });

        it("should sign in a exist oauth user and set oauth atributes", async () => {
            mockUser.oauth = false;

            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue(
                mockUser,
            );
            jest.spyOn(mockPrismaService.user, "update").mockResolvedValue({
                ...mockUser,
                oauth: true,
            });

            expect(typeof (await service.auth(mockDto))).toBe("string");
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: mockDto.email,
                },
            });
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: mockUser.id,
                },
                data: {
                    oauth: true,
                    oauthProvider: mockDto.provider,
                    emailConfirmed: true,
                },
            });
        });

        it("should throws ForbiddenException if an error occurs", async () => {
            jest.spyOn(prismaService.user, "findUnique").mockRejectedValue(
                new Error("test error"),
            );

            await expect(service.auth(mockDto)).rejects.toThrow(
                ForbiddenException,
            );
        });
    });
});
