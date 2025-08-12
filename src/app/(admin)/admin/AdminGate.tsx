import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";

export default async function AdminGate({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        await requireAdmin();
    } catch {
        redirect("/");
    }
    return <>{children}</>;
}
