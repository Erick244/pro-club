import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "src/auth/models/dtos/sign-in/sign-in-response.dto";
import { PrismaService } from "src/db/prisma.service";
import { OAuthDto } from "../models/dtos/oauth.dto";

@Injectable()
export class OAuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    async auth(dto: OAuthDto): Promise<SignInDto | void> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: dto.email,
                },
            });

            if (user) {
                const payload = { userId: user.id, email: user.email };
                const authToken = await this.jwtService.signAsync(payload);

                return {
                    user,
                    authToken,
                };
            } else {
                await this.prismaService.user.create({
                    data: {
                        name: dto.name,
                        email: dto.email,
                        oauth: true,
                        oauthProvider: dto.provider,
                    },
                });
            }
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }
}
