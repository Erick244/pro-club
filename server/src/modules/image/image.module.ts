import { Module } from "@nestjs/common";
import { ImageService } from "./services/image.service";

@Module({ providers: [ImageService] })
export class ImageModule {}
