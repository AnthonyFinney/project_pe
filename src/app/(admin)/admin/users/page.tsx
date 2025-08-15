import AdminUsers from "@/components/admin/AdminUsers";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
    const supabase = await supabaseServer();

    // profiles
    const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, updated_at, avatar_url")
        .order("created_at", { ascending: false });

    if (pErr) {
        console.error(pErr);
        return <div className="p-6 text-red-600">Failed to load users.</div>;
    }

    // subscriptions (newest first so first per user is latest)
    const { data: subs, error: sErr } = await supabase
        .from("subscriptions")
        .select("user_id, status, plan_name, price_amount, created_at")
        .order("created_at", { ascending: false });

    if (sErr) console.error(sErr);

    const latestSubByUser = new Map<string, { plan: string; status: string }>();
    const totalSpentByUser = new Map<string, number>();

    (subs ?? []).forEach((s) => {
        if (!latestSubByUser.has(s.user_id)) {
            latestSubByUser.set(s.user_id, {
                plan: s.plan_name ?? "Free",
                status:
                    s.status === "active"
                        ? "active"
                        : s.status === "canceled"
                        ? "inactive"
                        : "inactive",
            });
        }
        totalSpentByUser.set(
            s.user_id,
            (totalSpentByUser.get(s.user_id) ?? 0) + (s.price_amount ?? 0)
        );
    });

    const rows = (profiles ?? []).map((p) => {
        const sub = latestSubByUser.get(p.id);
        return {
            id: p.id,
            name: p.full_name ?? "(no name)",
            email: p.email ?? "",
            plan: p.role === "admin" ? "" : sub?.plan ?? "Free",
            status: sub?.status ?? "inactive",
            totalSpent:
                Math.round(((totalSpentByUser.get(p.id) ?? 0) / 100) * 100) /
                100, // if cents
            lastActive: new Date(p.updated_at).toLocaleDateString(),
            role: p.role ?? "user",
            avatar_url: p.avatar_url ?? null,
        };
    });

    return <AdminUsers initialUsers={rows} />;
}
