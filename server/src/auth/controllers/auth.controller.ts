import { Body, Controller, Post } from "@nestjs/common";
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
}
