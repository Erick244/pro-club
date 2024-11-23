import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class FieldIsMatchConstraint implements ValidatorConstraintInterface {
    validate(
        value: any,
        validationArguments?: ValidationArguments,
    ): Promise<boolean> | boolean {
        const fieldToMatchValue =
            validationArguments.object[validationArguments.constraints[0]];

        return fieldToMatchValue === validationArguments.value;
    }
}

export function Match(
    fieldToMatch: string,
    validationOptions?: ValidationOptions,
) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [fieldToMatch],
            validator: FieldIsMatchConstraint,
        });
    };
}
