import { Body, Controller, Post } from "@nestjs/common";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
import { AuthService } from "./../services/auth.service";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/signup")
    async signUp(@Body() dto: SignUpRequestDto): Promise<void> {
        await this.authService.signUp(dto);
    }
}
