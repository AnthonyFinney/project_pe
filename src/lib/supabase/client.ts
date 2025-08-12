// lib/supabase/browser.ts (or keep your current path/filename)
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

// Singleton to avoid creating multiple clients in the browser
let _client: SupabaseClient<Database> | null = null;

export function supabaseBrowser(): SupabaseClient<Database> {
    if (!_client) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        _client = createBrowserClient<Database>(url, anon);
    }
    return _client;
}

export async function getMyRole(): Promise<"admin" | "user" | null> {
    const client = supabaseBrowser();

    const {
        data: { user },
        error: userErr,
    } = await client.auth.getUser();

    if (userErr) {
        // Optional: log/handle
        return null;
    }
    if (!user) return null;

    const { data: profile, error: profErr } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profErr) {
        // Optional: log/handle
        return null;
    }

    const role = profile?.role;
    return role === "admin" || role === "user" ? role : null;
}
