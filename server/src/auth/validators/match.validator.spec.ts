import { ValidationArguments } from "class-validator";
import { FieldIsMatchConstraint, Match } from "./match.validator";

describe("MatchValidator", () => {
    describe("FieldIsMatchConstraint", () => {
        it("should be defined", () => {
            expect(new FieldIsMatchConstraint()).toBeDefined();
        });

        it("should return true if the fields values matches", () => {
            const fieldToMatchValue = "test";
            const fieldValue = "test";
            const validationArguments = {
                object: {
                    [fieldToMatchValue]: fieldToMatchValue,
                },
                value: fieldValue,
                constraints: [fieldToMatchValue],
            } as ValidationArguments;

            expect(
                new FieldIsMatchConstraint().validate(
                    fieldValue,
                    validationArguments,
                ),
            ).toBe(true);
        });

        it("should return false if the fields values don't matches", () => {
            const fieldToMatchValue = "test";
            const fieldValue = "other-test";
            const validationArguments = {
                object: {
                    [fieldToMatchValue]: fieldToMatchValue,
                },
                value: fieldValue,
                constraints: [fieldToMatchValue],
            } as ValidationArguments;

            expect(
                new FieldIsMatchConstraint().validate(
                    fieldValue,
                    validationArguments,
                ),
            ).toBe(false);
        });
    });

    describe("Match", () => {
        it("should be defined", () => {
            expect(Match).toBeDefined();
        });

        it("should register the decorator", () => {
            expect(Match("test")).toBeInstanceOf(Function);
        });
    });
});
