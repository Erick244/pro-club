import { LayoutProps } from "@/app/layout";
import { CustomUserGradient } from "./CustomUserGradient";
import { UserLayoutHeader } from "./UserLayoutHeader";

export function UserLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen p-5">
            <CustomUserGradient />
            <UserLayoutHeader />
            <main className="h-full">{children}</main>
        </div>
    );
}
