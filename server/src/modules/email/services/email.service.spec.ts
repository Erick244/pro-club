import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import {
    InternalServerErrorException,
    NotAcceptableException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../common/services/prisma.service";
import { CodeService } from "./code.service";
import { EmailService } from "./email.service";

describe("EmailService", () => {
    let service: EmailService;
    let mailerService: MailerService;
    let codeService: CodeService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
        },
    };

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
            providers: [
                CodeService,
                EmailService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get(EmailService);
        mailerService = module.get(MailerService);
        codeService = module.get(CodeService);
        prismaService = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("sendEmailConfirmation", () => {
        it("should send the email confirmation with code", async () => {
            const email = "example@email.com";
            const CODE_LENGTH = 6;
            const mockCode = "123456";

            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue({
                emailConfirmed: false,
            });
            jest.spyOn(codeService, "newCode").mockReturnValue(mockCode);
            jest.spyOn(mailerService, "sendMail").mockImplementation(() =>
                Promise.resolve(),
            );

            await service.sendEmailConfirmation(email);

            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email,
                },
            });
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

        it("should throw InternalServerErrorException on some error occurs", async () => {
            const email = "invalid-email";
            const mockCode = "123456";

            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue({
                emailConfirmed: false,
            });
            jest.spyOn(codeService, "newCode").mockReturnValue(mockCode);
            jest.spyOn(mailerService, "sendMail").mockImplementation(() => {
                throw new Error("error message");
            });

            await expect(service.sendEmailConfirmation(email)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email,
                },
            });
        });

        it("should throw NotAcceptableException if the email already confirmed", async () => {
            const email = "example@email.com";

            jest.spyOn(mockPrismaService.user, "findUnique").mockResolvedValue({
                emailConfirmed: true,
            });

            await expect(service.sendEmailConfirmation(email)).rejects.toThrow(
                NotAcceptableException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email,
                },
            });
        });
    });
});
