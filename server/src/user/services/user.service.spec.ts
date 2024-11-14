import {
    InternalServerErrorException,
    NotAcceptableException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { UpdateEmailDto } from "../models/dtos/update-email.dto";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { Countries } from "../models/enums/countries.enum";
import { UserService } from "./user.service";

describe("UserService", () => {
    let service: UserService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            update: jest.fn(),
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get(UserService);
        prismaService = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("update", () => {
        it("should update the user name", async () => {
            const dto: UpdateUserDto = {
                name: "TestName",
            };
            const updatedUser = {
                ...dto,
            } as unknown as User;
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "update").mockReturnValue(
                updatedUser,
            );

            expect(await service.update(dto, userId)).toMatchObject(
                updatedUser,
            );
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: userId,
                },
                data: dto,
            });
        });

        it("should update the user biography", async () => {
            const dto: UpdateUserDto = {
                biography: "TestBiography",
            };
            const updatedUser = {
                ...dto,
            } as unknown as User;
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "update").mockReturnValue(
                updatedUser,
            );

            expect(await service.update(dto, userId)).toMatchObject(
                updatedUser,
            );
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: userId,
                },
                data: dto,
            });
        });

        it("should update the user country", async () => {
            const dto: UpdateUserDto = {
                country: Countries.Brazil,
            };
            const updatedUser = {
                ...dto,
            } as unknown as User;
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "update").mockReturnValue(
                updatedUser,
            );

            expect(await service.update(dto, userId)).toMatchObject(
                updatedUser,
            );
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: userId,
                },
                data: dto,
            });
        });

        it("should update multiple properties in user", async () => {
            const dto: UpdateUserDto = {
                country: Countries.Brazil,
                name: "TestName",
                biography: "TestBiography",
            };
            const updatedUser = {
                ...dto,
            } as unknown as User;
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "update").mockReturnValue(
                updatedUser,
            );

            expect(await service.update(dto, userId)).toMatchObject(
                updatedUser,
            );
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: userId,
                },
                data: dto,
            });
        });

        it("should throw InternalServerErrorException if some error occurs", async () => {
            const dto: UpdateUserDto = {
                name: "TestName",
                biography: "TestBiography",
                country: Countries.Brazil,
            };
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "update").mockImplementation(
                () => {
                    throw Error("PRISMA ERROR");
                },
            );

            await expect(service.update(dto, userId)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: userId,
                },
                data: dto,
            });
        });
    });

    describe("updateEmail", () => {
        it("should update user email", async () => {
            const dto: UpdateEmailDto = {
                email: "example@email.com",
            };
            const userId = 1;
            const updatedUser = {
                ...dto,
                emailConfirmed: false,
                oauth: false,
                oauthProvider: null,
            } as unknown as User;

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue(
                null,
            );
            jest.spyOn(mockPrismaService.user, "update").mockReturnValue(
                updatedUser,
            );

            expect(await service.updateEmail(dto, userId)).toBe(
                updatedUser.email,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: userId,
                },
                data: {
                    emailConfirmed: false,
                    oauth: false,
                    oauthProvider: null,
                    email: dto.email,
                },
            });
        });

        it("should throw InternalServerErrorException if some Prisma Error occurs in findUnique", async () => {
            const dto: UpdateEmailDto = {
                email: "example@email.com",
            };
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "findUnique").mockImplementation(
                () => {
                    throw new Error("PRISMA ERROR");
                },
            );

            await expect(service.updateEmail(dto, userId)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
        });

        it("should throw InternalServerErrorException if some Prisma Error occurs in update", async () => {
            const dto: UpdateEmailDto = {
                email: "example@email.com",
            };
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue(
                null,
            );
            jest.spyOn(mockPrismaService.user, "update").mockImplementation(
                () => {
                    throw new Error("PRISMA ERROR");
                },
            );

            await expect(service.updateEmail(dto, userId)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: userId,
                },
                data: {
                    emailConfirmed: false,
                    oauth: false,
                    oauthProvider: null,
                    email: dto.email,
                },
            });
        });

        it("should throw NotAcceptableException if the email already is used", async () => {
            const dto: UpdateEmailDto = {
                email: "example@email.com",
            };
            const userId = 1;

            jest.spyOn(mockPrismaService.user, "findUnique").mockReturnValue(
                {} as User,
            );

            await expect(service.updateEmail(dto, userId)).rejects.toThrow(
                NotAcceptableException,
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: dto.email,
                },
            });
        });
    });
});
