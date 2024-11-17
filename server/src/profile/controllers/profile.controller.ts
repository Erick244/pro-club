import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthUser } from "../../auth/decorators/auth-user.decorator";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { EmailConfirmedGuard } from "../../email/guards/email-confirmed.guard";
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
}
