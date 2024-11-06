import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { UpdateUserDto } from "../models/dtos/update-user.dto";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async update(dto: UpdateUserDto, id: number): Promise<User> {
        if (await this.emailIsUsed(dto.email)) {
            throw new NotAcceptableException("Email is already used.");
        }

        try {
            const updatedUser = await this.prismaService.user.update({
                where: {
                    id,
                },
                data: dto,
            });

            delete updatedUser.password;

            return updatedUser;
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }

    private async emailIsUsed(email: string | undefined): Promise<boolean> {
        if (!email) {
            return false;
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        return !!user;
    }
}
