import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "../../../../common/services/prisma.service";
import { OAuthDto } from "../../modules/oauth/models/dtos/oauth.dto";

@Injectable()
export class OAuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    async auth(dto: OAuthDto): Promise<string> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            if (user) {
                if (!user.oauth) {
                    await this.prismaService.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            oauth: true,
                            oauthProvider: dto.provider,
                            emailConfirmed: true,
                        },
                    });
                }

                return await this.signIn(user);
            }

            const newUser = await this.prismaService.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    oauth: true,
                    oauthProvider: dto.provider,
                    emailConfirmed: true,
                },
            });

            return await this.signIn(newUser);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    async signIn(user: User): Promise<string> {
        const payload = { userId: user.id };
        const authToken = await this.jwtService.signAsync(payload);

        return authToken;
    }
}
