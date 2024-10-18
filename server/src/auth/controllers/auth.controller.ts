import { Body, Controller, Post } from "@nestjs/common";
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
}
