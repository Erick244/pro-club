import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CodeService } from "./code.service";
import { EmailService } from "./email.service";

describe("EmailService", () => {
    let service: EmailService;
    let mailerService: MailerService;
    let codeService: CodeService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                MailerModule.forRoot({
                    transport: {
                        host: "test.host.com",
                        auth: {
                            user: "test-user",
                            pass: "test-pass",
                        },
                    },
                }),
            ],
            providers: [CodeService, EmailService],
        }).compile();

        service = module.get(EmailService);
        mailerService = module.get(MailerService);
        codeService = module.get(CodeService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("sendEmailConfirmation", () => {
        it("should send the email confirmation with code", () => {
            const email = "example@email.com";
            const CODE_LENGTH = 6;
            const mockCode = "123456";

            jest.spyOn(codeService, "newCode").mockReturnValue(mockCode);
            jest.spyOn(mailerService, "sendMail").mockImplementation(() =>
                Promise.resolve(),
            );

            service.sendEmailConfirmation(email);

            expect(codeService.newCode).toHaveBeenCalledWith(
                CODE_LENGTH,
                email,
            );
            expect(mailerService.sendMail).toHaveBeenCalledWith({
                from: "proclub@email.com",
                to: email,
                subject: "Your Pro Club e-mail code confirmation",
                text: mockCode,
            });
        });

        it("should throw InternalServerErrorException on some error occurs", () => {
            const email = "invalid-email";
            const mockCode = "123456";

            jest.spyOn(codeService, "newCode").mockReturnValue(mockCode);
            jest.spyOn(mailerService, "sendMail").mockImplementation(() => {
                throw new Error("error message");
            });

            expect(() => service.sendEmailConfirmation(email)).toThrow(
                InternalServerErrorException,
            );
        });
    });
});
