"use server";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function getCookie(name: string): Promise<string | undefined> {
    return cookies().get(name)?.value;
}

export async function setCookie(
    name: string,
    value: string,
    cookie?: Partial<ResponseCookie> | undefined
) {
    cookies().set(name, value, cookie);
}
