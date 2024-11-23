import { NotFoundException } from "@nestjs/common";
import { CodeService } from "./code.service";

describe("CodeService", () => {
    let service: CodeService;

    beforeEach(() => {
        service = new CodeService();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("newCode", () => {
        it("should create a new code", () => {
            const email = "example@email.com";

            const code = service.newCode(6, email);

            expect(code).toBeDefined();
            expect(service.getCode(email)).toBeDefined();
        });
    });

    describe("getCode", () => {
        it("should get the code by email", () => {
            const email = "example@email.com";
            const newCode = service.newCode(6, email);

            const cachedCode = service.getCode(email);

            expect(cachedCode).toEqual(newCode);
        });

        it("should throw NotFoundException on get invalid code", () => {
            const email = "example@email.com";

            expect(() => service.getCode(email)).toThrow(
                new NotFoundException(
                    "The email confirmation code is expired. Try send new code.",
                ),
            );
        });

        it("should throw NotFoundException on get expired code", () => {
            const email = "example@email.com";

            service.newCode(6, email);
            jest.useFakeTimers();
            jest.advanceTimersByTime(1000 * 60 * 6); // Advanced 6 minutes

            expect(() => service.getCode(email)).toThrow(
                new NotFoundException(
                    "The email confirmation code is expired. Try send new code.",
                ),
            );
        });
    });
});
