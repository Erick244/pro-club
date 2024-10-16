import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CodeService } from "./code.service";

@Injectable()
export class EmailService {
    constructor(
        private mailerService: MailerService,
        private codeService: CodeService,
    ) {}

    sendEmailConfirmation(email: string) {
        try {
            const CODE_LENGTH = 6;
            const code = this.codeService.newCode(CODE_LENGTH, email);

            this.mailerService.sendMail({
                from: "Pro Club",
                to: email,
                subject: "Your Pro Club e-mail code confirmation",
                text: code,
            });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
