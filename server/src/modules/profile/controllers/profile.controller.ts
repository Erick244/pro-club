import {
    Body,
    Controller,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "@prisma/client";
import { AuthUser } from "../../auth/decorators/auth-user.decorator";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { EmailConfirmedGuard } from "../../email/guards/email-confirmed.guard";
import { ImageFileSizeValidationPipe } from "../../image/pipes/image-file-size-validation.pipe";
import { ImageFileValidationPipe } from "../../image/pipes/image-file-validation.pipe";
import { CreateProfileDto } from "../models/dtos/create-profile.dto";
import { ProfileService } from "../services/profile.service";

@Controller("/profile")
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Post()
    async create(@Body() dto: CreateProfileDto, @AuthUser() { id }: User) {
        return await this.profileService.create(dto, id);
    }

    @UseGuards(AuthGuard, EmailConfirmedGuard)
    @Put("updateImage")
    @UseInterceptors(FileInterceptor("image"))
    async updateImage(
        @UploadedFile(
            new ImageFileValidationPipe(),
            new ImageFileSizeValidationPipe(),
        )
        imageFile: Express.Multer.File,
        @AuthUser() { userProfileId }: User,
    ) {
        return await this.profileService.updateImage(imageFile, userProfileId);
    }
}
