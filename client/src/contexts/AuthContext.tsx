"use client";

import { AuthorizationFetch } from "@/api/AuthorizationFetch";
import { SignInFormFormData } from "@/components/auth/forms/sign-in/SignInForm";
import { SignUpFormData } from "@/components/auth/forms/sign-up/SignUpForm";
import { API_BASE_URL } from "@/constants";
import { getCookie, setCookie } from "@/functions/client-cookie-store";
import { CookieNames, PendingCookiesLabels } from "@/models/enums/cookies.enum";
import { User } from "@/models/interfaces/user.interface";
import { useRouter } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextProps {
    user: User | null;
    signUp: (data: SignUpFormData) => Promise<void>;
    signIn: (data: SignInFormFormData) => Promise<void>;
    confirmEmailCode: (code: string) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextProps);

export type PendingCookie = {
    label: PendingCookiesLabels;
    isPending: boolean;
    redirectPath: string;
};

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    const recoverUser = useCallback(async () => {
        const authToken = await getCookie(CookieNames.AUTH_TOKEN);

        if (!authToken) {
            setUser(null);
            return;
        }

        const userByToken = await AuthorizationFetch(
            `${API_BASE_URL}/auth/userByToken`
        );

        setUser(userByToken);
    }, []);

    useEffect(() => {
        recoverUser();
    }, [recoverUser]);

    async function signUp(data: SignUpFormData) {
        const resp = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            await throwDefaultError(resp);
        }

        const newUser = await resp.json();
        await setCookie(CookieNames.SIGN_UP_USER, JSON.stringify(newUser));

        await sendEmailConfirmation(newUser.email);
    }

    async function throwDefaultError(resp: Response) {
        const error = await resp.json();
        throw new Error(error.message);
    }

    async function sendEmailConfirmation(email: string) {
        await setPendingCookie({
            label: PendingCookiesLabels.EMAIL_CONFIRMATION,
            isPending: true,
            redirectPath: "/auth/email-confirmation",
        });

        const resp = await fetch(`${API_BASE_URL}/email/sendCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!resp.ok) {
            await throwDefaultError(resp);
        }

        router.push("/auth/email-confirmation");
    }

    async function setPendingCookie(pendingCookie: PendingCookie) {
        const pendingCookiesString = await getCookie(CookieNames.PENDING);

        if (!pendingCookiesString) {
            await setCookie(
                CookieNames.PENDING,
                JSON.stringify([pendingCookie])
            );
            return;
        }

        const pendingCookies = JSON.parse(pendingCookiesString);

        const pendingCookiesFiltered = pendingCookies.filter(
            (pc: PendingCookie) => pc.label !== pendingCookie.label
        );

        await setCookie(
            CookieNames.PENDING,
            JSON.stringify([...pendingCookiesFiltered, pendingCookie])
        );
    }

    async function confirmEmailCode(code: string) {
        const signUpUser = await getCookie(CookieNames.SIGN_UP_USER);
        const email = JSON.parse(signUpUser ?? "").email;

        const resp = await fetch(`${API_BASE_URL}/email/confirmCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code }),
        });

        if (!resp.ok) {
            await throwDefaultError(resp);
        }

        const updatedUser: User = await resp.json();

        if (updatedUser.oauth && !updatedUser.country) {
            await setPendingCookie({
                label: PendingCookiesLabels.SIGN_UP_DETAILS,
                isPending: true,
                redirectPath: "/auth/signup/details",
            });
        }

        await setPendingCookie({
            label: PendingCookiesLabels.EMAIL_CONFIRMATION,
            isPending: false,
            redirectPath: "/auth/email-confirmation",
        });

        router.push(`/auth/signin?email=${encodeURIComponent(email ?? "")}`);
    }

    async function signIn(data: SignInFormFormData) {
        const resp = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            await throwDefaultError(resp);
        }

        const { user, authToken } = await resp.json();

        setUser(user);

        await setCookie(CookieNames.AUTH_TOKEN, authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        });

        if (!user.country) {
            await setPendingCookie({
                label: PendingCookiesLabels.SIGN_UP_DETAILS,
                isPending: true,
                redirectPath: "/auth/signup/details",
            });

            router.push("/auth/signup/details");

            return;
        }

        router.push("/");
    }

    return (
        <AuthContext.Provider
            value={{ user, signUp, signIn, confirmEmailCode }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
