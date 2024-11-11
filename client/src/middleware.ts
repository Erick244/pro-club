import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "./constants";
import { CookieNames } from "./models/enums/cookies.enum";
import { User } from "./models/interfaces/user.interface";

type PendingIssue = {
    isPending: boolean;
    redirectPath: string;
};

export async function middleware(req: NextRequest) {
    const authToken = req.cookies.get(CookieNames.AUTH_TOKEN)?.value;

    const pathname = req.nextUrl.pathname;

    const isSignInOrSignUpPath =
        pathname === "/auth/signup" || pathname === "/auth/signin";

    if (isSignInOrSignUpPath) {
        return authToken ? redirectTo("/", req.url) : NextResponse.next();
    }

    if (!authToken) {
        return redirectTo("/auth/signup", req.url);
    }

    try {
        const user = await getUserByToken(authToken);

        const pendingIssues: PendingIssue[] = [
            {
                isPending: !user.emailConfirmed,
                redirectPath: "/auth/email-confirmation",
            },
            {
                isPending: !user.country,
                redirectPath: "/auth/signup/details",
            },
        ];

        let latestPendingIssue;

        for (let pendingIssue of pendingIssues) {
            const latestPendingIssueIsNotPending =
                !latestPendingIssue || !latestPendingIssue?.isPending;

            if (
                pendingIssue.isPending &&
                latestPendingIssueIsNotPending &&
                pendingIssue.redirectPath !== pathname
            ) {
                return redirectTo(pendingIssue.redirectPath, req.url);
            }

            latestPendingIssue = pendingIssue;
        }

        const notAllowPaths = [
            {
                isNotAllow: !!user.country,
                path: "/auth/signup/details",
            },
        ];

        for (const notAllowPath of notAllowPaths) {
            const isSamePath = pathname === notAllowPath.path;

            if (notAllowPath.isNotAllow && isSamePath) {
                return redirectTo("/", req.url);
            }
        }
    } catch (error) {
        return redirectTo("/auth/signup", req.url);
    }
}

const redirectTo = (path: string, url: string) => {
    return NextResponse.redirect(new URL(path, url));
};

const getUserByToken = async (authToken: string): Promise<User> => {
    const resp = await fetch(`${API_BASE_URL}/auth/userByToken`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (!resp.ok) {
        throw new Error("Unauthorized");
    }

    return await resp.json();
};

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"], // Skip all next files and important
};
