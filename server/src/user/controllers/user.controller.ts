import { Body, Controller, Patch, Put, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthUser } from "../../auth/decorators/auth-user.decorator";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { UpdateEmailDto } from "../models/dtos/update-email.dto";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { UserService } from "../services/user.service";

@Controller("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(AuthGuard)
    @Patch("/update")
    async update(@Body() dto: UpdateUserDto, @AuthUser() { id }: User) {
        return await this.userService.update(dto, id);
    }

    @UseGuards(AuthGuard)
    @Put("/update/email")
    async updateEmail(@Body() dto: UpdateEmailDto, @AuthUser() { id }: User) {
        return await this.userService.updateEmail(dto, id);
    }
}
