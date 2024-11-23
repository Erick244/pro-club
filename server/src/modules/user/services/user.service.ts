import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../../../common/services/prisma.service";
import { UpdateEmailDto } from "../models/dtos/update-email.dto";
import { UpdateUserDto } from "../models/dtos/update-user.dto";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async update(dto: UpdateUserDto, id: number): Promise<User> {
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

    async updateEmail({ email }: UpdateEmailDto, id: number): Promise<string> {
        if (await this.emailIsUsed(email)) {
            throw new NotAcceptableException("Email is already used.");
        }

        try {
            const { email: updatedEmail } =
                await this.prismaService.user.update({
                    where: {
                        id,
                    },
                    data: {
                        emailConfirmed: false,
                        oauth: false,
                        oauthProvider: null,
                        email,
                    },
                });

            return updatedEmail;
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }

    private async emailIsUsed(email: string | undefined): Promise<boolean> {
        try {
            if (!email) {
                return false;
            }

            const user = await this.prismaService.user.findUnique({
                where: {
                    email,
                },
            });

            return !!user;
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
