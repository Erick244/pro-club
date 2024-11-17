import { InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SocialMediaNames, UserProfile } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
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

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get(ProfileService);
        prismaService = module.get(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a profile to user", async () => {
            const userId = 1;
            const dto: CreateProfileDto = {
                color: "#fff",
                profileImageUrl: "url",
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
                ...dto,
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
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        });

        it("should throw a InternalServerErrorException if some error occurs", async () => {
            const userId = 1;
            const dto: CreateProfileDto = {
                color: "#fff",
                profileImageUrl: "url",
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
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        });
    });
});
