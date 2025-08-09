import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

export const createServerClient = () => {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({
        cookies: () => cookieStore,
    });
};

export const supabase = createServerClient();

export const requireUser = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");
    return user;
};

export const requireAdmin = async () => {
    const user = await requireUser();

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error) throw error;
    if (profile?.role !== "admin") throw new Error("Forbidden");

    return user;
};
