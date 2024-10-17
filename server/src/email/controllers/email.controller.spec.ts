import { NotAcceptableException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { ConfirmCodeDto } from "../models/dtos/confirm-code.dto";
import { SendCodeDto } from "../models/dtos/send-code.dto";
import { CodeService } from "../services/code.service";
import { EmailService } from "./../services/email.service";
import { EmailController } from "./email.controller";

describe("EmailController", () => {
    let controller: EmailController;
    let emailService: EmailService;
    let codeService: CodeService;
    let prismaService: PrismaService;

    const mockEmailService = {
        sendEmailConfirmation: jest.fn(),
    };
    const mockCodeService = {
        getCode: jest.fn(),
    };
    const mockPrismaService = {
        user: {
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: EmailService,
                    useValue: mockEmailService,
                },
                {
                    provide: CodeService,
                    useValue: mockCodeService,
                },
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
            controllers: [EmailController],
        }).compile();

        controller = module.get(EmailController);
        emailService = module.get(EmailService);
        codeService = module.get(CodeService);
        prismaService = module.get(PrismaService);
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

    describe("confirmCode", () => {
        it("should confirm code sended by user", async () => {
            const dto: ConfirmCodeDto = {
                code: "123456",
                email: "example@email.com",
            };

            const updatedUser = {
                emailConfirmed: true,
            } as unknown as User;

            jest.spyOn(mockCodeService, "getCode").mockReturnValue(dto.code);
            jest.spyOn(mockPrismaService.user, "update").mockReturnValue(
                updatedUser,
            );

            expect(await controller.confirmCode(dto)).toBe(updatedUser);
            expect(codeService.getCode).toHaveBeenCalledWith(dto.email);
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
                data: {
                    emailConfirmed: true,
                },
            });
        });

        it("should throw NotAcceptableException if the code is invalid or not is the real code", async () => {
            const dto: ConfirmCodeDto = {
                code: "123456",
                email: "example@email.com",
            };

            const realCode = "789012";

            jest.spyOn(mockCodeService, "getCode").mockReturnValue(realCode);

            await expect(controller.confirmCode(dto)).rejects.toThrow(
                NotAcceptableException,
            );
            expect(codeService.getCode).toHaveBeenCalledWith(dto.email);
        });

        it("should throw NotFoundException if the email is not associated with a user", async () => {
            const dto: ConfirmCodeDto = {
                code: "123456",
                email: "example@email.com",
            };

            jest.spyOn(mockCodeService, "getCode").mockReturnValue(dto.code);
            jest.spyOn(mockPrismaService.user, "update").mockImplementation(
                () => {
                    throw new Error("error-message");
                },
            );

            await expect(controller.confirmCode(dto)).rejects.toThrow(
                NotFoundException,
            );
            expect(codeService.getCode).toHaveBeenCalledWith(dto.email);
        });
    });
});
