import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { CodeService } from "./code.service";

@Injectable()
export class EmailService {
    constructor(
        private mailerService: MailerService,
        private codeService: CodeService,
    ) {}

    sendEmailConfirmation(email: string) {
        const code = this.codeService.newCode(6, email);

        this.mailerService.sendMail({
            from: "Pro Club",
            to: email,
            subject: "Your Pro Club e-mail code confirmation",
            text: code,
        });
    }
}
