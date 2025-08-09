import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./database.types";

export const createClient = () => createClientComponentClient<Database>();

export const supabaseBrowser = createClient();

export const getMyRole = async (): Promise<"admin" | "user" | null> => {
    const {
        data: { user },
    } = await supabaseBrowser.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabaseBrowser
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    return (profile?.role as "admin" | "user") ?? null;
};
