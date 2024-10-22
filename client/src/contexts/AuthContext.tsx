"use client";

import { AuthorizationFetch } from "@/api/AuthorizationFetch";
import { API_BASE_URL, AUTH_TOKEN_NAME } from "@/constants";
import { getCookie } from "@/functions/cookie-store";
import { User } from "@/models/interfaces/user.interface";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextProps {
    user: User | null;
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

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
