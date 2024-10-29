import { PendingCookie } from "@/contexts/AuthContext";
import { CookieNames } from "@/models/enums/cookies.enum";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function existCookieOrRedirectTo(path: string, cookieKey: string) {
    if (!getCookieValue(cookieKey)) {
        redirect(path);
    }
}

function getCookieValue(key: string) {
    const cookie = cookies().get(key)?.value;

    return cookie;
}

function notExistCookieOrRedirectTo(path: string, cookieKey: string) {
    if (getCookieValue(cookieKey)) {
        redirect(path);
    }
}

function getPendingCookies(): PendingCookie[] | undefined {
    const pendingCookies = getCookieValue(CookieNames.PENDING);

    if (!pendingCookies) {
        return;
    }

    return JSON.parse(pendingCookies);
}

function redirectToPendingCookie(currentPath: string) {
    const pendingCookies = getPendingCookies();

    if (!pendingCookies && currentPath !== "/auth/signup") {
        // TODO: fetch signOut
        redirect("/auth/signup");
    }

    pendingCookies?.forEach((pendingCookie) => {
        if (
            pendingCookie.isPending &&
            currentPath !== pendingCookie.redirectPath
        ) {
            redirect(pendingCookie.redirectPath);
        }
    });
}

export const Authorization = {
    "/": () => {
        redirectToPendingCookie("/");

        existCookieOrRedirectTo("/auth/signup", CookieNames.AUTH_TOKEN);
    },
    "/auth/signup": () => {
        redirectToPendingCookie("/auth/signup");

        notExistCookieOrRedirectTo("/", CookieNames.AUTH_TOKEN);
    },
    "/auth/signup/details": () => {
        redirectToPendingCookie("/auth/signup/details");

        existCookieOrRedirectTo("/auth/signup", CookieNames.AUTH_TOKEN);
    },
    "/auth/signin": () => {
        redirectToPendingCookie("/auth/signin");

        notExistCookieOrRedirectTo("/auth/signup", CookieNames.AUTH_TOKEN);
    },
    "/auth/email-confirmation": () => {
        redirectToPendingCookie("/auth/email-confirmation");

        notExistCookieOrRedirectTo("/", CookieNames.AUTH_TOKEN);
    },
};
