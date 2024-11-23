import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import { PrismaService } from "../../../common/services/prisma.service";
import { UpdateEmailDto } from "../models/dtos/update-email.dto";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { UserService } from "../services/user.service";
import { UserController } from "./user.controller";

describe("UserController", () => {
    let controller: UserController;
    let userService: UserService;

    const mockUserService = {
        update: jest.fn(),
        updateEmail: jest.fn(),
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

    describe("updateEmail", () => {
        it("should update a user email", async () => {
            const mockUser = {
                id: 1,
                name: "Other Name",
                email: "other@example.com",
            } as unknown as User;
            const dto: UpdateEmailDto = {
                email: "example@email.com",
            };

            jest.spyOn(mockUserService, "updateEmail").mockReturnValue(
                dto.email,
            );

            expect(await controller.updateEmail(dto, mockUser)).toBe(dto.email);
            expect(userService.updateEmail).toHaveBeenCalledWith(
                dto,
                mockUser.id,
            );
        });
    });
});
