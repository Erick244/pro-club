import {
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { ConfirmCodeDto } from "../models/dtos/confirm-code.dto";
import { CodeService } from "./code.service";

@Injectable()
export class EmailConfirmationService {
    constructor(
        private prismaService: PrismaService,
        private codeService: CodeService,
    ) {}

    async confirmEmailCode(dto: ConfirmCodeDto): Promise<User> {
        const realCode = this.codeService.getCode(dto.email);

        if (realCode !== dto.code) {
            throw new NotAcceptableException("Invalid code. Try again.");
        }

        try {
            const updatedUser = await this.prismaService.user.update({
                where: {
                    email: dto.email,
                },
                data: {
                    emailConfirmed: true,
                },
            });

            delete updatedUser.password;

            return updatedUser;
        } catch (error: any) {
            throw new NotFoundException(
                "This email is not harassed to a user.",
            );
        }
    }
}
