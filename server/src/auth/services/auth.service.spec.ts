import { ForbiddenException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../db/prisma.service";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
import { SignUpResponseDto } from "../models/dtos/sign-up/sign-up-response.dto";
import { AuthService } from "./auth.service";
describe("AuthService", () => {
    let service: AuthService;
    let prismaService: PrismaService;
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get(AuthService);
        prismaService = module.get(PrismaService);
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
            const hashedPassword = "hashedPassword";
            const newUser: User = {
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
                password: hashedPassword,
            };
            const responseDto: SignUpResponseDto = {
                ...newUser,
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
});
