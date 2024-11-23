import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../../common/services/prisma.service";
import { SignInResponseDto } from "../models/dtos/sign-in/sign-in-response.dto";
import { SignInRequestDto } from "../models/dtos/sign-in/sign-in.request.dto";
import { SignUpRequestDto } from "../models/dtos/sign-up/sign-up-request.dto";
import { SignUpResponseDto } from "../models/dtos/sign-up/sign-up-response.dto";

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) {}

    async signUp(dto: SignUpRequestDto): Promise<SignUpResponseDto> {
        try {
            const userExist = await this.prismaService.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            if (userExist) {
                throw new ForbiddenException(
                    "This email is already in use, try logging in.",
                );
            }

            const salt = await bcrypt.genSalt();
            const passwordHashed = await bcrypt.hash(dto.password, salt);

            const newUser = await this.prismaService.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: passwordHashed,
                },
            });

            delete newUser.password;

            return newUser;
        } catch (error: any) {
            throw new ForbiddenException(error.message);
        }
    }

    async signIn(dto: SignInRequestDto): Promise<SignInResponseDto> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found. Try signing up.");
        }

        if (user.oauth) {
            throw new ForbiddenException(
                `This email is signed up with ${user.oauthProvider}. Try signing again with ${user.oauthProvider}.`,
            );
        }

        try {
            const passwordIsMatch = await bcrypt.compare(
                dto.password,
                user.password,
            );
            if (!passwordIsMatch) {
                throw new ForbiddenException("Password is incorrect.");
            }

            const payload = { userId: user.id };
            const authToken = await this.jwtService.signAsync(payload);

            delete user.password;

            return {
                user,
                authToken,
            };
        } catch (error: any) {
            throw new ForbiddenException(error.message);
        }
    }
}
