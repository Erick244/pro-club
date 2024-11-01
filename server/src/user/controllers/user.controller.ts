import { Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthUser } from "../../auth/decorators/auth-user.decorator";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { UserService } from "../services/user.service";

@Controller("/users")
export class UserController {
    constructor(private usrService: UserService) {}

    @UseGuards(AuthGuard)
    @Patch("/update")
    async update(@Body() dto: UpdateUserDto, @AuthUser() { id }: User) {
        return this.usrService.update(dto, id);
    }
}
