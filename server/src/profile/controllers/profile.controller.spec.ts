import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { SocialMediaNames, User, UserProfile } from "@prisma/client";
import { PrismaService } from "../../db/prisma.service";
import { CreateProfileDto } from "../models/dtos/create-profile.dto";
import { ProfileService } from "../services/profile.service";
import { ProfileController } from "./profile.controller";

describe("ProfileController", () => {
    let controller: ProfileController;

    let profileService: ProfileService;
    const mockProfileService = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
                {
                    provide: ProfileService,
                    useValue: mockProfileService,
                },
                JwtService,
                PrismaService,
            ],
        }).compile();

        controller = module.get(ProfileController);
        profileService = module.get(ProfileService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a user profile", async () => {
            const mockUser = {
                id: 1,
            } as unknown as User;
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

            jest.spyOn(mockProfileService, "create").mockReturnValue(
                newProfile,
            );

            expect(await controller.create(dto, mockUser)).toMatchObject(
                newProfile,
            );
            expect(profileService.create).toHaveBeenCalledWith(
                dto,
                mockUser.id,
            );
        });
    });
});
