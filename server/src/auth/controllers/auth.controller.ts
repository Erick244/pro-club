import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AuthGuard } from "../guards/auth.guard";
import { SignInResponseDto } from "../models/dtos/sign-in/sign-in-response.dto";
import { SignInRequestDto } from "../models/dtos/sign-in/sign-in.request.dto";
import { SignOutDto } from "../models/dtos/sign-out/sign-out.dto";
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
    userByToken(@Req() req: Request): User {
        return req.user as User;
    }

    @UseGuards(AuthGuard)
    @Post("/signout")
    signOut(@Body() dto: SignOutDto, @Res() res: Response): void {
        this.authService.signOut(dto, res);
    }
}
