import { BASE_API_URL } from "@/constants";
import { CookieNames } from "@/models/enums/cookies.enum";
import { getCookie } from "../cookies/cookie-store";
interface Options extends RequestInit {
    body?: any;
    auth?: boolean;
    error?: {
        message: string;
    };
}

const customHeaders: { [key in string]: string } = {
    "Content-Type": "application/json",
};

export async function customFetch(path: string, options?: Options) {
    if (options?.auth) {
        const authToken = await getCookie(CookieNames.AUTH_TOKEN);

        customHeaders["Authorization"] = `Bearer ${authToken}`;
    }

    const customBody = options?.body ? JSON.stringify(options.body) : undefined;

    const response = await fetch(`${BASE_API_URL}${path}`, {
        ...options,
        headers: {
            ...customHeaders,
        },
        body: customBody,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(options?.error?.message || error.message);
    }

    return response;
}
