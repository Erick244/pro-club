import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "../../db/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const token = this.getTokenFromHeader(req);

        try {
            const payload = await this.jwtService.verifyAsync(token);
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload.userId,
                },
            });

            if (!user) {
                throw new UnauthorizedException(
                    "User not found. Try logging in again.",
                );
            }

            req["user"] = user;

            return true;
        } catch (error) {
            throw new UnauthorizedException(
                "Invalid or expired authentication token. Try logging in again.",
            );
        }
    }

    private getTokenFromHeader(req: Request): string {
        const bearerToken = req.headers.authorization;

        if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid authentication token");
        }

        const token = bearerToken.split(" ")[1];

        return token;
    }
}
