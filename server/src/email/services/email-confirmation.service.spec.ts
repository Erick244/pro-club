import { NotAcceptableException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { ConfirmCodeDto } from "../models/dtos/confirm-code.dto";
import { CodeService } from "./code.service";
import { EmailConfirmationService } from "./email-confirmation.service";

describe("EmailConfirmationService", () => {
    let service: EmailConfirmationService;
    let prismaService: PrismaService;
    let codeService: CodeService;

    const mockPrismaService = {
        user: {
            update: jest.fn(),
        },
    };

    const mockCodeService = {
        getCode: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EmailConfirmationService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: CodeService,
                    useValue: mockCodeService,
                },
            ],
        }).compile();

        service = module.get(EmailConfirmationService);
        prismaService = module.get(PrismaService);
        codeService = module.get(CodeService);
    });

    it("should it be defined", () => {
        expect(service).toBeDefined();
    });

    describe("confirmEmailCode", () => {
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

            expect(await service.confirmEmailCode(dto)).toBe(updatedUser);
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

            await expect(service.confirmEmailCode(dto)).rejects.toThrow(
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

            await expect(service.confirmEmailCode(dto)).rejects.toThrow(
                NotFoundException,
            );
            expect(codeService.getCode).toHaveBeenCalledWith(dto.email);
        });
    });
});
