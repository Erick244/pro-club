import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { UserService } from "../services/user.service";

@Controller("/users")
export class UserController {
    constructor(private usrService: UserService) {}

    @UseGuards(AuthGuard)
    @Patch("/update")
    async update(@Body() dto: UpdateUserDto, @Req() { user }: Request) {
        return this.usrService.update(dto, (user as User).id);
    }
}
