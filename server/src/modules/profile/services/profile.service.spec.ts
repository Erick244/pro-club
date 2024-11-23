import {
    BadRequestException,
    InternalServerErrorException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SocialMediaNames, UserProfile } from "@prisma/client";
import { PrismaService } from "../../../common/services/prisma.service";
import { ImageService } from "../../image/services/image.service";
import { CreateProfileDto } from "../models/dtos/create-profile.dto";
import { ProfileService } from "./profile.service";

describe("ProfileService", () => {
    let service: ProfileService;

    let prismaService: PrismaService;
    const mockPrismaService = {
        userProfile: {
            create: jest.fn(),
        },
    };

    let imageService: ImageService;
    const mockImageService = {
        uploadImage: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: ImageService,
                    useValue: mockImageService,
                },
            ],
        }).compile();

        service = module.get(ProfileService);
        prismaService = module.get(PrismaService);
        imageService = module.get(ImageService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a profile to user with image", async () => {
            const userId = 1;
            const dto: CreateProfileDto = {
                color: "#fff",
                profileImage: new File([], "test"),
                socialMedias: [
                    {
                        name: SocialMediaNames.Discord,
                        tag: "test#123",
                        profileLink: "url",
                    },
                ],
            };
            const newProfile = {
                id: 123,
            } as unknown as UserProfile;

            jest.spyOn(imageService, "uploadImage").mockResolvedValue("URL");
            jest.spyOn(mockPrismaService.userProfile, "create").mockReturnValue(
                newProfile,
            );

            expect(await service.create(dto, userId)).toMatchObject(newProfile);
            expect(prismaService.userProfile.create).toHaveBeenCalledWith({
                data: {
                    color: dto.color,
                    socialMedias: {
                        create: dto.socialMedias,
                    },
                    profileImageUrl: "URL",
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
            expect(imageService.uploadImage).toHaveBeenCalledWith(
                dto.profileImage,
            );
        });

        it("should create a profile to user without image", async () => {
            const userId = 1;
            const dto: CreateProfileDto = {
                color: "#fff",
                profileImage: null,
                socialMedias: [
                    {
                        name: SocialMediaNames.Discord,
                        tag: "test#123",
                        profileLink: "url",
                    },
                ],
            };
            const newProfile = {
                id: 123,
            } as unknown as UserProfile;

            jest.spyOn(mockPrismaService.userProfile, "create").mockReturnValue(
                newProfile,
            );

            expect(await service.create(dto, userId)).toMatchObject(newProfile);
            expect(prismaService.userProfile.create).toHaveBeenCalledWith({
                data: {
                    color: dto.color,
                    socialMedias: {
                        create: dto.socialMedias,
                    },
                    profileImageUrl: null,
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        });

        it("should throw a InternalServerErrorException if some prisma error occurs", async () => {
            const userId = 1;
            const dto: CreateProfileDto = {
                color: "#fff",
                profileImage: null,
                socialMedias: [
                    {
                        name: SocialMediaNames.Discord,
                        tag: "test#123",
                        profileLink: "url",
                    },
                ],
            };

            jest.spyOn(
                mockPrismaService.userProfile,
                "create",
            ).mockImplementation(() => {
                throw new Error("PRISMA_ERROR");
            });

            await expect(service.create(dto, userId)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(prismaService.userProfile.create).toHaveBeenCalledWith({
                data: {
                    color: dto.color,
                    socialMedias: {
                        create: dto.socialMedias,
                    },
                    profileImageUrl: null,
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        });

        it("should throw a BadRequestException if some image service error occurs", async () => {
            const userId = 1;
            const dto: CreateProfileDto = {
                color: "#fff",
                profileImage: new File([], "image"),
                socialMedias: [
                    {
                        name: SocialMediaNames.Discord,
                        tag: "test#123",
                        profileLink: "url",
                    },
                ],
            };

            jest.spyOn(imageService, "uploadImage").mockImplementation(() => {
                throw new BadRequestException("IMAGE_ERROR");
            });

            await expect(service.create(dto, userId)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
});
