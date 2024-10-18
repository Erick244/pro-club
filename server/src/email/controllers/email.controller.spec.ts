import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { ConfirmCodeDto } from "../models/dtos/confirm-code.dto";
import { SendCodeDto } from "../models/dtos/send-code.dto";
import { EmailConfirmationService } from "../services/email-confirmation.service";
import { EmailService } from "./../services/email.service";
import { EmailController } from "./email.controller";

describe("EmailController", () => {
    let controller: EmailController;
    let emailService: EmailService;
    let emailConfirmationService: EmailConfirmationService;

    const mockEmailConfirmationService = {
        confirmEmailCode: jest.fn(),
    };

    const mockEmailService = {
        sendEmailConfirmation: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: EmailService,
                    useValue: mockEmailService,
                },
                {
                    provide: EmailConfirmationService,
                    useValue: mockEmailConfirmationService,
                },
            ],
            controllers: [EmailController],
        }).compile();

        controller = module.get(EmailController);
        emailService = module.get(EmailService);
        emailConfirmationService = module.get(EmailConfirmationService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("sendCode", () => {
        it("should send email to user with confirmation code", async () => {
            const dto: SendCodeDto = { email: "example@email.com" };

            jest.spyOn(mockEmailService, "sendEmailConfirmation");
            await controller.sendCode(dto);

            expect(emailService.sendEmailConfirmation).toHaveBeenCalledWith(
                dto.email,
            );
        });
    });

    describe("confirmCode", () => {
        it("should confirm code sended by user", async () => {
            const dto: ConfirmCodeDto = {
                code: "123456",
                email: "example@email.com",
            };

            const updatedUser = {
                emailConfirmed: true,
            } as unknown as User;

            jest.spyOn(
                mockEmailConfirmationService,
                "confirmEmailCode",
            ).mockReturnValue(Promise.resolve(updatedUser));

            expect(await controller.confirmCode(dto)).toBe(updatedUser);
            expect(
                emailConfirmationService.confirmEmailCode,
            ).toHaveBeenCalledWith(dto);
        });
    });
});
