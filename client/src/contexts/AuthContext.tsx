"use client";

import { SignInFormFormData } from "@/components/auth/forms/sign-in/SignInForm";
import { SignUpFormData } from "@/components/auth/forms/sign-up/SignUpForm";
import { ONE_MONTH_IN_MS } from "@/constants";
import { customFetch } from "@/functions/api/custom-fetch";
import {
    delCookie,
    getCookie,
    setCookie,
} from "@/functions/cookies/cookie-store";
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
    sendEmailConfirmation: (email: string) => Promise<void>;
    signOut: (redirectPath?: string) => Promise<void>;
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

        const resp = await customFetch("/auth/userByToken", {
            auth: true,
        });

        const userByToken = (await resp.json()) as User;

        setUser(userByToken);
    }, []);

    useEffect(() => {
        recoverUser();
    }, [recoverUser]);

    async function signUp(data: SignUpFormData) {
        await customFetch("/auth/signup", {
            method: "POST",
            body: data,
        });

        await signIn({ email: data.email, password: data.password });
    }

    async function signIn(data: SignInFormFormData) {
        const resp = await customFetch("/auth/signin", {
            method: "POST",
            body: data,
        });

        const { user, authToken }: { user: User; authToken: string } =
            await resp.json();

        setUser(user);

        await setCookie(CookieNames.AUTH_TOKEN, authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: ONE_MONTH_IN_MS,
        });

        if (!user.emailConfirmed) {
            await sendEmailConfirmation(user.email);
        } else {
            router.push("/");
        }
    }

    async function sendEmailConfirmation(email: string) {
        await customFetch("/email/sendCode", {
            method: "POST",
            body: { email },
        });

        router.push("/auth/email-confirmation");
    }

    async function confirmEmailCode(code: string) {
        await customFetch("/email/confirmCode", {
            method: "POST",
            body: { email: user?.email, code },
        });

        router.push("/");
    }

    async function signOut(redirectPath: string = "/auth/signup") {
        await delCookie(CookieNames.AUTH_TOKEN);

        router.push(redirectPath);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                signUp,
                signIn,
                confirmEmailCode,
                sendEmailConfirmation,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
