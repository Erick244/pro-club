import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/db/prisma.service";
import { OAuthDto } from "../models/dtos/oauth.dto";

@Injectable()
export class OAuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    async auth(dto: OAuthDto): Promise<string> {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: dto.email,
                },
            });

            if (user) {
                return await this.signIn(user);
            }

            const newUser = await this.prismaService.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    oauth: true,
                    oauthProvider: dto.provider,
                },
            });

            return await this.signIn(newUser);
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

    private async signIn(user: User): Promise<string> {
        const payload = { userId: user.id, email: user.email };
        const authToken = await this.jwtService.signAsync(payload);

        return authToken;
    }
}