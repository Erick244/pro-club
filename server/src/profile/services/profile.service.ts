import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserProfile } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { CreateProfileDto } from "../models/dtos/create-profile.dto";

@Injectable()
export class ProfileService {
    constructor(private prismaService: PrismaService) {}

    async create(dto: CreateProfileDto, userId: number): Promise<UserProfile> {
        try {
            return await this.prismaService.userProfile.create({
                data: {
                    color: dto.color,
                    socialMedias: {
                        create: dto.socialMedias,
                    },
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
