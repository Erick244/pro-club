import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { Response } from "express";
import { AuthUser } from "../decorators/auth-user.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { SignInResponseDto } from "../models/dtos/sign-in/sign-in-response.dto";
import { SignInRequestDto } from "../models/dtos/sign-in/sign-in.request.dto";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
import { SignUpResponseDto } from "../models/dtos/sign-up/sign-up-response.dto";
import { AuthService } from "./../services/auth.service";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/signup")
    async signUp(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
        return await this.authService.signUp(dto);
    }

    @Post("/signin")
    async signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDto> {
        return await this.authService.signIn(dto);
    }

    @UseGuards(AuthGuard)
    @Get("/userByToken")
    userByToken(@AuthUser() user: User): User {
        return user;
    }

    @UseGuards(AuthGuard)
    @Post("/signout")
    async signOut(
        @Query("redirectPath") redirectPath: string,
        @Res() res: Response,
    ): Promise<void> {
        return await this.authService.signOut(redirectPath, res);
    }
}
