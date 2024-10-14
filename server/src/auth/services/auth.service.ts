import { ForbiddenException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../db/prisma.service";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    async signUp(dto: SignUpRequestDto): Promise<void> {
        try {
            const userExist = await this.prismaService.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            if (userExist) {
                throw new ForbiddenException(
                    "This email is already in use, try logging in.",
                );
            }

            const salt = await bcrypt.genSalt();
            const passwordHashed = await bcrypt.hash(dto.password, salt);

            await this.prismaService.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: passwordHashed,
                },
            });
        } catch (error: any) {
            throw new ForbiddenException(error.message);
        }
    }
}
