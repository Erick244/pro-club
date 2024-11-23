import { Module } from "@nestjs/common";
import { PrismaService } from "../../common/services/prisma.service";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";

@Module({
    providers: [UserService, PrismaService],
    controllers: [UserController],
})
export class UserModule {}
