import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { ImageService } from "./image.service";

describe("ImageService", () => {
    let service: ImageService;
    let configService: ConfigService;

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get(ImageService);
        configService = module.get(ConfigService);

        global.fetch = jest.fn();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("uploadImage", () => {
        const mockFormData = new FormData();
        const mockFile = new File([""], "test.jpg");
        const mockClientId = "test-client-id";
        const responseLink = "https://imgur.com/test.jpg";
        const PROVIDER_URL = "https://api.imgur.com/3/image";

        it("should successfully upload an image and return link", async () => {
            const mockResponse = {
                ok: true,
                json: () => Promise.resolve({ link: responseLink }),
            };

            mockFormData.append("image", mockFile);
            jest.spyOn(mockConfigService, "get").mockResolvedValue(
                mockClientId,
            );
            jest.spyOn(global, "fetch").mockResolvedValue(
                mockResponse as Response,
            );

            expect(await service.uploadImage(mockFile)).toBe(responseLink);
            expect(global.fetch).toHaveBeenCalledWith(PROVIDER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Client-ID ${mockClientId}`,
                },
                body: mockFormData,
            });
            expect(configService.get).toHaveBeenCalledWith("CLIENT_ID");
        });

        it("should throw BadRequestException when upload fails", async () => {
            const mockResponse = { ok: false };

            mockFormData.append("image", mockFile);
            jest.spyOn(mockConfigService, "get").mockResolvedValue(
                mockClientId,
            );
            jest.spyOn(global, "fetch").mockResolvedValue(
                mockResponse as Response,
            );

            await expect(service.uploadImage(mockFile)).rejects.toThrow(
                BadRequestException,
            );
        });

        it("should throw BadRequestException when fetch throws error", async () => {
            jest.spyOn(mockConfigService, "get").mockResolvedValue(
                mockClientId,
            );
            jest.spyOn(global, "fetch").mockRejectedValue(
                new Error("Network error"),
            );

            await expect(service.uploadImage(mockFile)).rejects.toThrow(
                BadRequestException,
            );
        });

        it("should throw BadRequestException when config service fails", async () => {
            jest.spyOn(mockConfigService, "get").mockRejectedValue(
                new Error("Config error"),
            );

            await expect(service.uploadImage(mockFile)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
});
