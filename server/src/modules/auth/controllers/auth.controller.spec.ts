import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { PrismaService } from "../../../common/services/prisma.service";
import { SignInResponseDto } from "../models/dtos/sign-in/sign-in-response.dto";
import { SignInRequestDto } from "../models/dtos/sign-in/sign-in.request.dto";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
import { SignUpResponseDto } from "../models/dtos/sign-up/sign-up-response.dto";
import { AuthService } from "../services/auth.service";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;
    const mockAuthService = {
        signUp: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                PrismaService,
                JwtService,
            ],
        }).compile();

        controller = module.get(AuthController);
        authService = module.get(AuthService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("sign up", () => {
        it("should sign up user", async () => {
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

            jest.spyOn(mockAuthService, "signUp").mockReturnValueOnce(
                responseDto,
            );

            expect(await controller.signUp(requestDto)).toStrictEqual(
                responseDto,
            );
            expect(authService.signUp).toHaveBeenCalledWith(requestDto);
        });
    });

    describe("sign in", () => {
        it("should sign in user", async () => {
            const requestDto: SignInRequestDto = {
                email: "john.doe@example.com",
                password: "password",
            };
            const responseDto: SignInResponseDto = {
                user: {
                    id: 123,
                } as unknown as User,
                authToken: "token",
            };

            jest.spyOn(mockAuthService, "signIn").mockReturnValue(responseDto);

            expect(await controller.signIn(requestDto)).toStrictEqual(
                responseDto,
            );
            expect(authService.signIn).toHaveBeenCalledWith(requestDto);
        });
    });

    describe("user by token", () => {
        it("should return user by token", () => {
            const mockUser = {
                id: 123,
                name: "John Doe",
                email: "john.doe@example.com",
            } as unknown as User;

            expect(controller.userByToken(mockUser)).toStrictEqual(mockUser);
        });
    });
});
