"use server";
import { cookies } from "next/headers";

export async function getCookie(name: string): Promise<string | undefined> {
    return cookies().get(name)?.value;
}
