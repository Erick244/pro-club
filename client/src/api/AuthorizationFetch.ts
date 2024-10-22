"use server";

import { AUTH_TOKEN_NAME } from "@/constants";
import { cookies } from "next/headers";

export async function AuthorizationFetch(url: string, options?: RequestInit) {
    const authToken = cookies().get(AUTH_TOKEN_NAME)?.value;

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
