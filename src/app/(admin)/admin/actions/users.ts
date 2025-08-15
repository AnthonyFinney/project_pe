"use server";

import { supabaseServer } from "@/lib/supabase/server";

// optional: gate actions (only admins)
async function assertAdmin() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: isAdmin, error } = await supabase.rpc("is_admin", {
        uid: user.id,
    });
    if (error) throw error;
    if (!isAdmin) throw new Error("Not authorized");
}

export async function setUserRole(userId: string, role: "admin" | "user") {
    await assertAdmin();
    const supabase = await supabaseServer();
    const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);
    if (error) throw error;
}

export async function suspendUser(userId: string) {
    await assertAdmin();
    const supabase = await supabaseServer();

    // mark most recent subscription as canceled (example policy)
    const { data: last, error: selErr } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (selErr) throw selErr;

    const { error: upErr } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("id", last.id);

    if (upErr) throw upErr;
}
