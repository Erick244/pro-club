import { Body, Controller, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { ConfirmCodeDto } from "../models/dtos/confirm-code.dto";
import { SendCodeDto } from "../models/dtos/send-code.dto";
import { EmailConfirmationService } from "../services/email-confirmation.service";
import { EmailService } from "../services/email.service";

@Controller("/email")
export class EmailController {
    constructor(
        private emailService: EmailService,
        private emailConfirmationService: EmailConfirmationService,
    ) {}

    @Post("/sendCode")
    sendCode(@Body() dto: SendCodeDto): void {
        return this.emailService.sendEmailConfirmation(dto.email);
    }

    @Post("/confirmCode")
    async confirmCode(@Body() dto: ConfirmCodeDto): Promise<User> {
        return await this.emailConfirmationService.confirmEmailCode(dto);
    }
}
