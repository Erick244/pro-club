import { Body, Controller, Post } from "@nestjs/common";
import { SendCodeDto } from "../models/dtos/send-code.dto";
import { EmailService } from "../services/email.service";

@Controller("/email")
export class EmailController {
    constructor(private emailService: EmailService) {}

    @Post("/sendCode")
    sendCode(@Body() dto: SendCodeDto): void {
        return this.emailService.sendEmailConfirmation(dto.email);
    }
}
