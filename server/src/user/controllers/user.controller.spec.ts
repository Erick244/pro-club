import { Test } from "@nestjs/testing";
import { UserController } from "./user.controller";

describe("UserController", () => {
    let controller: UserController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UserController],
        }).compile();

        controller = module.get(UserController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
