import { CookieNames } from "@/models/enums/cookies.enum";
import { getCookie } from "../cookies/cookie-store";

export async function authFetch(
    url: string,
    options?: RequestInit
): Promise<Response> {
    const authToken = await getCookie(CookieNames.AUTH_TOKEN);

    const resp = await fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${authToken}`,
        },
    });

    return resp;
}
