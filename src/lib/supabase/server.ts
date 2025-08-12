import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

// Per-request Supabase client using the new cookie API
export async function supabaseServer() {
    const store = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env
            .NEXT_PUBLIC_SUPABASE_ANON_KEY! /* anon is correct for SSR sessions */,
        {
            cookies: {
                getAll() {
                    return store
                        .getAll()
                        .map(({ name, value }) => ({ name, value }));
                },
                setAll(cookies) {
                    cookies.forEach(({ name, value, options }) => {
                        store.set(name, value, options);
                    });
                },
            },
        }
    );
}

export async function requireUser() {
    const client = await supabaseServer();
    const {
        data: { user },
        error,
    } = await client.auth.getUser();

    if (error || !user) {
        throw new Error("Unauthorized");
    }
    return { user, client };
}

export async function requireAdmin() {
    const { user, client } = await requireUser();

    const { data: ok, error } = await client.rpc("is_admin", { uid: user.id });

    if (error) throw error;
    if (ok !== true) throw new Error("Forbidden");

    return { user, client };
}
