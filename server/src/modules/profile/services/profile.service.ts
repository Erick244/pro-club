import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserProfile } from "@prisma/client";
import { PrismaService } from "../../../common/services/prisma.service";
import { ImageService } from "../../image/services/image.service";
import { CreateProfileDto } from "../models/dtos/create-profile.dto";

@Injectable()
export class ProfileService {
    constructor(
        private prismaService: PrismaService,
        private imageService: ImageService,
    ) {}

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

    async updateImage(
        imageMulterFile: Express.Multer.File,
        userProfileId: number,
    ): Promise<string> {
        const profileImageUrl =
            await this.imageService.uploadImage(imageMulterFile);

        try {
            await this.prismaService.userProfile.update({
                where: {
                    id: userProfileId,
                },
                data: {
                    profileImageUrl,
                },
            });

            return profileImageUrl;
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
