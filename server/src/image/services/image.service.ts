import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ImgurEnvNames } from "../../models/enums/env-names.enum";

@Injectable()
export class ImageService {
    private PROVIDER_URL = "https://api.imgur.com/3/image";

    constructor(private configService: ConfigService) {}

    async uploadImage(imageFile: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const clientId = await this.configService.get(
                ImgurEnvNames.CLIENT_ID,
            );

            const resp = await fetch(this.PROVIDER_URL, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Client-ID ${clientId}`,
                },
            });

            if (!resp.ok) {
                throw new Error(
                    "The image could not be hosted, please try again.",
                );
            }

            const data = await resp.json();

            return data.link;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
}
