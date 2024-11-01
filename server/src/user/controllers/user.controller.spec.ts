import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { Request } from "express";
import { PrismaService } from "../../db/prisma.service";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { UserService } from "../services/user.service";
import { UserController } from "./user.controller";

describe("UserController", () => {
    let controller: UserController;
    let userService: UserService;

    const mockUserService = {
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                JwtService,
                PrismaService,
            ],
        }).compile();

        controller = module.get(UserController);
        userService = module.get(UserService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("update", () => {
        it("should update a user", async () => {
            const dto: UpdateUserDto = {
                email: "test@example.com",
                name: "John Doe",
            };

            const updatedUser = {
                id: 1,
                ...dto,
            } as unknown as User;

            const req = {
                user: {
                    id: 1,
                },
            } as unknown as Request;

            jest.spyOn(mockUserService, "update").mockReturnValue(updatedUser);

            expect(await controller.update(dto, req)).toBe(updatedUser);
            expect(userService.update).toHaveBeenCalledWith(dto, 1);
        });
    });
});
