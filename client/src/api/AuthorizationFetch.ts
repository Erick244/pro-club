"use server";

import { cookieNames } from "@/cookies/names";
import { cookies } from "next/headers";

export async function AuthorizationFetch(url: string, options?: RequestInit) {
    const authToken = cookies().get(cookieNames.AUTH_TOKEN)?.value;

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
