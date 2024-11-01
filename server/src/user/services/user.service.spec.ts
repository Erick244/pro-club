import { InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { UserService } from "./user.service";

describe("UserService", () => {
    let service: UserService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            update: jest.fn(),
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
        it("should update a user", async () => {
            const dto: UpdateUserDto = {
                email: "test@example.com",
                name: "John Doe",
            };

            const userUpdated = {
                id: 1,
                ...dto,
            } as unknown as User;

            jest.spyOn(mockPrismaService.user, "update").mockReturnValue(
                userUpdated,
            );

            expect(await service.update(dto, 1)).toStrictEqual(userUpdated);
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
                data: dto,
            });
        });

        it("should throw a InternalServerErrorException if an error occurs", async () => {
            const dto: UpdateUserDto = {
                email: "test@example.com",
                name: "John Doe",
            };

            jest.spyOn(mockPrismaService.user, "update").mockRejectedValue(
                new Error("Database error"),
            );

            await expect(service.update(dto, 1)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
                data: dto,
            });
        });
    });
});
