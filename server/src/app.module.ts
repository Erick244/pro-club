import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { AbcController } from './abc/abc.controller';
import { AbcService } from './abc/abc.service';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
    controllers: [AbcController],
    providers: [AbcService],
})
export class AppModule {}
