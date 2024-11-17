import { Module } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service";
import { ProfileService } from "./services/profile.service";

@Module({
    providers: [ProfileService, PrismaService],
})
export class ProfileModule {}
