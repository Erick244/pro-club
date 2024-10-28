import { cookieNames } from "@/cookies/names";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function existCookieOrRedirectTo(path: string, cookieKey: string) {
    const cookie = cookies().get(cookieKey)?.value;

    if (!cookie) {
        redirect(path);
    }
}

function notExistCookieOrRedirectTo(path: string, cookieKey: string) {
    const cookie = cookies().get(cookieKey)?.value;

    if (cookie) {
        redirect(path);
    }
}

function isFalseCookieOrRedirectTo(path: string, cookieKey: string) {
    const cookie = cookies().get(cookieKey)?.value;

    if (JSON.parse(cookie || "true")) {
        redirect(path);
    }
}

export const Authorization = {
    "/": () => {
        existCookieOrRedirectTo("/auth/signup", cookieNames.AUTH_TOKEN);

        isFalseCookieOrRedirectTo(
            "/auth/email-confirmation",
            cookieNames.EMAIL_CONFIRMATION_PENDING
        );

        isFalseCookieOrRedirectTo(
            "/auth/signup/details",
            cookieNames.SIGN_UP_DETAILS_PENDING
        );
    },
    "/auth/signup": () => {
        isFalseCookieOrRedirectTo(
            "/auth/signup/details",
            cookieNames.SIGN_UP_DETAILS_PENDING
        );

        notExistCookieOrRedirectTo("/", cookieNames.AUTH_TOKEN);
    },
    "/auth/signup/details": () => {
        isFalseCookieOrRedirectTo(
            "/auth/email-confirmation",
            cookieNames.EMAIL_CONFIRMATION_PENDING
        );
    },
};
