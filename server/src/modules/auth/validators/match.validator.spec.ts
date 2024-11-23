import { ValidationArguments } from "class-validator";
import { FieldIsMatchConstraint } from "./match.validator";

describe("MatchValidator", () => {
    describe("FieldIsMatchConstraint", () => {
        let fieldIsMatchConstraint: FieldIsMatchConstraint;

        beforeEach(() => {
            fieldIsMatchConstraint = new FieldIsMatchConstraint();
        });

        it("should be defined", () => {
            expect(fieldIsMatchConstraint).toBeDefined();
        });

        const fieldToMatchValue = "value";

        const validationArguments = {
            object: {
                [fieldToMatchValue]: fieldToMatchValue,
            },
            value: undefined,
            constraints: [fieldToMatchValue],
        } as ValidationArguments;

        it("should return true if the fields values matches", () => {
            const fieldValue = fieldToMatchValue;
            validationArguments.value = fieldValue;

            expect(
                new FieldIsMatchConstraint().validate(
                    fieldValue,
                    validationArguments,
                ),
            ).toBe(true);
        });

        it("should return false if the fields values don't matches", () => {
            const fieldValue = "other-test";
            validationArguments.value = fieldValue;

            expect(
                new FieldIsMatchConstraint().validate(
                    fieldValue,
                    validationArguments,
                ),
            ).toBe(false);
        });
    });
});
