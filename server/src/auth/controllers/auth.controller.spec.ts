import { Test } from "@nestjs/testing";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
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
            const dto: SignUpRequestDto = {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password",
                confirmPassword: "password",
            };

            jest.spyOn(mockAuthService, "signUp").mockReturnValue(
                Promise.resolve(),
            );

            expect(await controller.signUp(dto)).toBe(undefined);
            expect(authService.signUp).toHaveBeenCalledWith(dto);
        });
    });
});
