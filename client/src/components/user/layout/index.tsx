import { LayoutProps } from "@/app/layout";
import { UserLayoutHeader } from "./UserLayoutHeader";

export function UserLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-bl from-background from-60% to-primary to-100% p-5">
            <UserLayoutHeader />
            <main className="h-full">{children}</main>
        </div>
    );
}
