import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { PrismaService } from "../../db/prisma.service";
import { SignInRequestDto } from "../models/dtos/sign-in/sign-in.request.dto";
import { SignOutDto } from "../models/dtos/sign-out/sign-out.dto";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
import { SignUpResponseDto } from "../models/dtos/sign-up/sign-up-response.dto";
import { CookiesNames } from "../oauth/models/enums/cookies.enum";
import { AuthService } from "./auth.service";
describe("AuthService", () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
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

        service = module.get(AuthService);
        prismaService = module.get(PrismaService);
        jwtService = module.get(JwtService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("sign up", () => {
        it("should sign up a new user", async () => {
            const requestDto: SignUpRequestDto = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password",
                confirmPassword: "password",
            };
            const responseDto: SignUpResponseDto = {
                id: 123,
                name: requestDto.name,
                email: requestDto.email,
                oauth: false,
                oauthProvider: null,
                country: null,
                emailConfirmed: false,
                biography: null,
                roles: ["user"],
                userProfileId: null,
            };

            const hashedPassword = "hashedPassword";
            const newUser: User = {
                ...responseDto,
                password: hashedPassword,
            };

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue(
                null,
            );
            jest.spyOn(bcrypt, "genSalt").mockImplementation(() =>
                Promise.resolve("salt"),
            );
            jest.spyOn(bcrypt, "hash").mockImplementation(() =>
                Promise.resolve(hashedPassword),
            );
            jest.spyOn(mockPrismaService.user, "create").mockReturnValueOnce(
                newUser,
            );

            expect(await service.signUp(requestDto)).toStrictEqual(responseDto);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: requestDto.email,
                },
            });
            expect(bcrypt.genSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith(
                requestDto.password,
                "salt",
            );
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    name: requestDto.name,
                    email: requestDto.email,
                    password: hashedPassword,
                },
            });
        });

        it("should throw ForbiddenException if the user already exist", async () => {
            const dto: SignUpRequestDto = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password",
                confirmPassword: "password",
            };

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue(
                {} as unknown as User,
            );

            await expect(service.signUp(dto)).rejects.toThrow(
                new ForbiddenException(
                    "This email is already in use, try logging in.",
                ),
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
        });
    });

    describe("sign in", () => {
        it("should sign in a user", async () => {
            const dto: SignInRequestDto = {
                email: "john.doe@example.com",
                password: "password",
            };
            const mockToken = "token";
            const mockHashedPassword = "hashedPassword";

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue({
                id: 123,
                email: dto.email,
                password: mockHashedPassword,
            });
            jest.spyOn(bcrypt, "compare").mockImplementation(() =>
                Promise.resolve(true),
            );
            jest.spyOn(mockJwtService, "signAsync").mockImplementation(() =>
                Promise.resolve(mockToken),
            );

            expect(await service.signIn(dto)).toStrictEqual({
                user: {
                    id: 123,
                    email: dto.email,
                },
                authToken: mockToken,
            });
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(
                dto.password,
                mockHashedPassword,
            );
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                userId: 123,
            });
        });

        it("should throw NotFoundException if the user not exist", async () => {
            const dto: SignInRequestDto = {
                email: "john.doe@example.com",
                password: "password",
            };

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue(
                null,
            );

            await expect(service.signIn(dto)).rejects.toThrow(
                NotFoundException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
        });

        it("should throw ForbiddenException if the user is signed with oauth2 system", async () => {
            const dto: SignInRequestDto = {
                email: "john.doe@example.com",
                password: "incorrect-password",
            };

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue({
                id: 123,
                password: null,
                oauth: true,
            });

            await expect(service.signIn(dto)).rejects.toThrow(
                ForbiddenException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
        });

        it("should throw ForbiddenException if the password is incorrect", async () => {
            const dto: SignInRequestDto = {
                email: "john.doe@example.com",
                password: "incorrect-password",
            };
            const mockHashedPassword = "hashedPassword";

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue({
                id: 123,
                password: mockHashedPassword,
            });
            jest.spyOn(bcrypt, "compare").mockImplementation(() =>
                Promise.resolve(false),
            );

            await expect(service.signIn(dto)).rejects.toThrow(
                ForbiddenException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(
                dto.password,
                mockHashedPassword,
            );
        });
    });

    describe("sign out", () => {
        it("should sign out a user", async () => {
            const dto: SignOutDto = {
                redirectPath: "url",
            };

            const mockRes = {
                clearCookie: jest.fn(),
                redirect: jest.fn(),
            } as unknown as Response;

            service.signOut(dto, mockRes);

            expect(mockRes.clearCookie).toHaveBeenCalledWith(
                CookiesNames.AUTH_TOKEN,
            );
            expect(mockRes.redirect).toHaveBeenCalledWith(dto.redirectPath);
        });

        it("should throw ForbiddenException if an error occurs", async () => {
            const dto: SignOutDto = {
                redirectPath: "url",
            };

            const mockRes = {
                clearCookie: jest.fn().mockImplementation(() => {
                    throw Error("error");
                }),
                redirect: jest.fn(),
            } as unknown as Response;

            expect(() => service.signOut(dto, mockRes)).toThrow(
                ForbiddenException,
            );
        });
    });
});
