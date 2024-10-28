"use client";

import { AuthorizationFetch } from "@/api/AuthorizationFetch";
import { SignInFormFormData } from "@/components/auth/forms/sign-in/SignInForm";
import { SignUpFormData } from "@/components/auth/forms/sign-up/SignUpForm";
import { API_BASE_URL } from "@/constants";
import { cookieNames } from "@/cookies/names";
import {
    delCookie,
    getCookie,
    setCookie,
} from "@/functions/client-cookie-store";
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

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const recoverUser = useCallback(async () => {
        const authToken = await getCookie(cookieNames.AUTH_TOKEN);

        if (!authToken) {
            setUser(null);
            return;
        }

        const userByToken = await AuthorizationFetch(
            `${API_BASE_URL}/auth/userByToken`
        );

        setUser(userByToken);
    }, []);

    const setPendingCookies = useCallback(async () => {
        const emailConfirmationIsPending = !user?.emailConfirmed;
        await setCookie(
            cookieNames.EMAIL_CONFIRMATION_PENDING,
            JSON.stringify(emailConfirmationIsPending)
        );

        const signUpDetailsIsPending = !user?.country;
        await setCookie(
            cookieNames.SIGN_UP_DETAILS_PENDING,
            JSON.stringify(signUpDetailsIsPending)
        );
    }, [user?.country, user?.emailConfirmed]);

    useEffect(() => {
        recoverUser();

        setPendingCookies();
    }, [recoverUser, setPendingCookies]);

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
        await setCookie(cookieNames.SIGN_UP_USER, JSON.stringify(newUser));

        await sendEmailConfirmation(newUser.email);
    }

    async function throwDefaultError(resp: Response) {
        const error = await resp.json();
        throw new Error(error.message);
    }

    const router = useRouter();

    async function sendEmailConfirmation(email: string) {
        await setCookie(cookieNames.EMAIL_CONFIRMATION_PENDING, "true");

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

    async function confirmEmailCode(code: string) {
        const signUpUser = await getCookie(cookieNames.SIGN_UP_USER);
        const email = JSON.parse(signUpUser ?? "").email;

        console.log(email);

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

        if (!updatedUser.country) {
            await setCookie(cookieNames.SIGN_UP_DETAILS_PENDING, "true");
        }

        await delCookie(cookieNames.EMAIL_CONFIRMATION_PENDING);

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
        await setCookie(cookieNames.AUTH_TOKEN, authToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        });

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
