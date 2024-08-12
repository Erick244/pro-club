import { UserLayout } from "@/components/user/layout";
import { LayoutProps } from "../layout";

export default function AuthLayout({ children }: LayoutProps) {
    return <UserLayout>{children}</UserLayout>;
}
