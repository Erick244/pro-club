import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
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
            const mockUser = {
                id: 1,
                name: "Other Name",
                email: "other@example.com",
            } as unknown as User;
            const dto: UpdateUserDto = {
                email: "test@example.com",
                name: "John Doe",
            };
            const updatedUser = {
                id: mockUser.id,
                ...dto,
            } as unknown as User;

            jest.spyOn(mockUserService, "update").mockReturnValue(updatedUser);

            expect(await controller.update(dto, mockUser)).toBe(updatedUser);
            expect(userService.update).toHaveBeenCalledWith(dto, mockUser.id);
        });
    });
});
