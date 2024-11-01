import { Module } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service";
import { UserService } from "./services/user.service";

@Module({
    providers: [UserService, PrismaService],
})
export class UserModule {}
