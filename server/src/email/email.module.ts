import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service";
import { EmailController } from "./controllers/email.controller";
import { CodeService } from "./services/code.service";
import { EmailConfirmationService } from "./services/email-confirmation.service";
import { EmailService } from "./services/email.service";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
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
