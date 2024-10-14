import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from './services/auth/auth.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    providers: [AuthService],
})
export class AppModule {}
