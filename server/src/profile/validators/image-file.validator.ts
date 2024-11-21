import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
export class IsImageFileConstraint implements ValidatorConstraintInterface {
    validate(file: File): boolean {
        return file.type.startsWith("image/");
    }

    defaultMessage(): string {
        return "Please select an image file.";
    }
}

export function IsImageFile(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsImageFileConstraint,
        });
    };
}
