"use server";

import { CookieNames } from "@/models/enums/cookies.enum";
import { cookies } from "next/headers";

export async function authFetch(url: string, options?: RequestInit): Promise<Response> {
    const authToken = cookies().get(CookieNames.AUTH_TOKEN)?.value;

    const resp = await fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${authToken}`,
        },
    });

    return resp;
}
