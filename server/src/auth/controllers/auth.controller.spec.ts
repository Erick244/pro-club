import { Test } from "@nestjs/testing";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
import { SignUpResponseDto } from "../models/dtos/sign-up/sign-up-response.dto";
import { AuthService } from "../services/auth.service";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;
    const mockAuthService = {
        signUp: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
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
});
