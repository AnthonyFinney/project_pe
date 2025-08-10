import { createServerClient } from "./server";

export const getUser = async () => {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
};

export const getSession = async () => {
    const supabase = createServerClient();
    const { data } = await supabase.auth.getSession();
    return data.session ?? null;
};

export const isAdmin = async () => {
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data, error } = await supabase.rpc("is_admin", { uid: user.id });
    if (error) return false;
    return !!data;
};
