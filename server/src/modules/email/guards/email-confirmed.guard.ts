import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";

@Injectable()
export class EmailConfirmedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        const authUser = req.user as User;

        if (!authUser) {
            throw new ForbiddenException("User not found. Try logging in.");
        }

        return !!authUser.emailConfirmed;
    }
}
