import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../db/prisma.service";

@Injectable()
export class EmailConfirmedGuard implements CanActivate {
    private errorMessage = "Please confirm your email first.";

    constructor(private prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const userEmail = req.body.email;

        if (!userEmail) {
            throw new ForbiddenException(this.errorMessage);
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                email: userEmail,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found. Try signing up.");
        }

        if (!user.emailConfirmed) {
            throw new ForbiddenException(this.errorMessage);
        }

        return true;
    }
}
