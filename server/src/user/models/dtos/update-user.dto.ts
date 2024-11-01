import { Type } from "@nestjs/common";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { User } from "@prisma/client";

export class UpdateUserDto extends OmitType(PartialType({} as Type<User>), [
    "password",
    "id",
]) {}
