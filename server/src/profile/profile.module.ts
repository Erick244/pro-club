import { Module } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";

@Module({
    providers: [ProfileService, PrismaService],
    controllers: [ProfileController],
})
export class ProfileModule {}
