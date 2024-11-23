import { Module } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { ImageService } from "../image/services/image.service";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";

@Module({
    providers: [ProfileService, PrismaService, ImageService],
    controllers: [ProfileController],
})
export class ProfileModule {}
