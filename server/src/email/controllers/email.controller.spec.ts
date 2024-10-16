import { Test } from "@nestjs/testing";
import { SendCodeDto } from "../models/dtos/send-code.dto";
import { EmailService } from "./../services/email.service";
import { EmailController } from "./email.controller";

describe("EmailController", () => {
    let controller: EmailController;
    let emailService: EmailService;

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
            ],
            controllers: [EmailController],
        }).compile();

        controller = module.get(EmailController);
        emailService = module.get(EmailService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("sendCode", () => {
        it("should send email to user with confirmation code", () => {
            const dto: SendCodeDto = { email: "example@email.com" };

            jest.spyOn(mockEmailService, "sendEmailConfirmation");
            controller.sendCode(dto);

            expect(emailService.sendEmailConfirmation).toHaveBeenCalledWith(
                dto.email,
            );
        });
    });
});
