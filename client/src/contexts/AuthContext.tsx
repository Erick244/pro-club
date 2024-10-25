"use client";

import { AuthorizationFetch } from "@/api/AuthorizationFetch";
import { SignInFormFormData } from "@/components/auth/forms/sign-in/SignInForm";
import { SignUpFormData } from "@/components/auth/forms/sign-up/SignUpForm";
import { API_BASE_URL, AUTH_TOKEN_NAME } from "@/constants";
import { getCookie, setCookie } from "@/functions/client-cookie-store";
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
}

const AuthContext = createContext({} as AuthContextProps);

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const recoverUser = useCallback(async () => {
        const authToken = await getCookie(AUTH_TOKEN_NAME);

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

        const { email } = await resp.json();

        await sendEmailConfirmation(email);
    }

    async function throwDefaultError(resp: Response) {
        const error = await resp.json();
        throw new Error(error.message);
    }

    const router = useRouter();

    async function sendEmailConfirmation(email: string) {
        await setCookie("emailConfirmationPending", "true");

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

        router.push("/");
    }

    return (
        <AuthContext.Provider value={{ user, signUp, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
