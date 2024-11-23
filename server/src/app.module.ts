import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { EmailModule } from "./modules/email/email.module";
import { ImageModule } from "./modules/image/image.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { UserModule } from "./modules/user/user.module";

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
