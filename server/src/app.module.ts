import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { ImageModule } from "./image/image.module";
import { ProfileModule } from "./profile/profile.module";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        EmailModule,
        UserModule,
        ProfileModule,
        ImageModule,
    ],
})
export class AppModule {}
