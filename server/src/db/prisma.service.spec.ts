import { Test } from "@nestjs/testing";
import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
    let service: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [PrismaService],
        }).compile();

        service = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should connect to prisma", async () => {
        jest.spyOn(service, "$connect").mockImplementation(() =>
            Promise.resolve(),
        );

        await expect(service.onModuleInit()).resolves.not.toThrow();
    });
});
