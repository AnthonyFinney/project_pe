import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "../../types/database.types";

export const createServerClient = () => {
    return createServerComponentClient<Database>({
        cookies,
    });
};

export const supabaseServer = createServerClient();

export const requireUser = async () => {
    const {
        data: { user },
        error,
    } = await supabaseServer.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");
    return user;
};

export const requireAdmin = async () => {
    const {
        data: { user },
        error,
    } = await supabaseServer.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");

    const { data: isAdmin, error: rpcErr } = await supabaseServer.rpc(
        "is_admin",
        {
            uid: user.id,
        }
    );

    if (rpcErr) throw rpcErr;
    if (!isAdmin) throw new Error("Forbidden");
    return user;
};
