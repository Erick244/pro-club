import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Blob } from "buffer";
import { ImgurEnvNames } from "../../models/enums/env-names.enum";

@Injectable()
export class ImageService {
    private PROVIDER_URL = "https://api.imgur.com/3/image";

    constructor(private configService: ConfigService) {}

    async uploadImage(imageMulterFile: Express.Multer.File): Promise<string> {
        try {
            const imageFile = this.multerFileToNativeFile(imageMulterFile);

            const formData = new FormData();
            formData.append("image", imageFile);

            const clientId = await this.configService.get(
                ImgurEnvNames.CLIENT_ID,
            );

            const resp = await fetch(this.PROVIDER_URL, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Client-ID ${clientId}`,
                },
            });

            if (!resp.ok) {
                throw new Error(
                    "The image could not be hosted, please try again.",
                );
            }

            const image = await resp.json();

            return image.data.link;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }

    private multerFileToNativeFile(multerFile: Express.Multer.File): File {
        const blob = new Blob([multerFile.buffer], {
            type: multerFile.mimetype,
        });

        const file = new File([blob], multerFile.originalname, {
            type: multerFile.mimetype,
            lastModified: Date.now(),
        });

        return file;
    }
}
