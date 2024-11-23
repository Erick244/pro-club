import { MailerService } from "@nestjs-modules/mailer";
import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
} from "@nestjs/common";
import { PrismaService } from "../../../common/services/prisma.service";
import { CodeService } from "./code.service";

@Injectable()
export class EmailService {
    constructor(
        private mailerService: MailerService,
        private codeService: CodeService,
        private prismaService: PrismaService,
    ) {}

    async sendEmailConfirmation(email: string) {
        if (await this.emailAlreadyConfirmed(email)) {
            throw new NotAcceptableException(
                "This e-mail already confirmed. Try logging in.",
            );
        }
        try {
            const CODE_LENGTH = 6;
            const code = this.codeService.newCode(CODE_LENGTH, email);

            // Temp
            this.mailerService.sendMail({
                from: "proclub@email.com",
                to: email,
                subject: "Your Pro Club e-mail code confirmation",
                text: code,
            });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }

    private async emailAlreadyConfirmed(email: string): Promise<boolean> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        return !!user.emailConfirmed;
    }
}
