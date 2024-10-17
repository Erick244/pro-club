import {
    Body,
    Controller,
    NotAcceptableException,
    NotFoundException,
    Post,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { ConfirmCodeDto } from "../models/dtos/confirm-code.dto";
import { SendCodeDto } from "../models/dtos/send-code.dto";
import { EmailService } from "../services/email.service";
import { CodeService } from "./../services/code.service";

@Controller("/email")
export class EmailController {
    constructor(
        private emailService: EmailService,
        private codeService: CodeService,
        private prismaService: PrismaService,
    ) {}

    @Post("/sendCode")
    sendCode(@Body() dto: SendCodeDto): void {
        return this.emailService.sendEmailConfirmation(dto.email);
    }

    @Post("/confirmCode")
    async confirmCode(@Body() dto: ConfirmCodeDto): Promise<User> {
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
