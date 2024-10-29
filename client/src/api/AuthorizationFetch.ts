"use server";

import { CookieNames } from "@/models/enums/cookies.enum";
import { cookies } from "next/headers";

export async function AuthorizationFetch(url: string, options?: RequestInit) {
    const authToken = cookies().get(CookieNames.AUTH_TOKEN)?.value;

    const resp = await fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${authToken}`,
        },
    });

    if (resp.ok && resp.json) {
        return await resp.json();
    }
}
