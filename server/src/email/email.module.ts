import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service";
import { EmailEnvNames } from "../models/enums/env-names.enum";
import { EmailController } from "./controllers/email.controller";
import { CodeService } from "./services/code.service";
import { EmailConfirmationService } from "./services/email-confirmation.service";
import { EmailService } from "./services/email.service";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env[EmailEnvNames.EMAIL_HOST],
                auth: {
                    user: process.env[EmailEnvNames.EMAIL_USERNAME],
                    pass: process.env[EmailEnvNames.EMAIL_PASSWORD],
                },
            },
        }),
    ],
    providers: [
        EmailService,
        CodeService,
        PrismaService,
        EmailConfirmationService,
    ],
    controllers: [EmailController],
})
export class EmailModule {}
