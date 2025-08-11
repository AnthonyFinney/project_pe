// AUTO-GENERATED on 2025-08-11T15:34:38.040225Z
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function create_prompt_admin(
    client: SupabaseClient<Database>,
    args: {
        p_title: string;
        p_content: string;
        p_description: string | undefined;
        p_category_slug: string | undefined;
        p_thumbnail_url: string | undefined;
    }
) {
    const { data, error } = await client.rpc("create_prompt_admin", {
        p_title: args.p_title,
        p_content: args.p_content,
        p_description: args.p_description,
        p_category_slug: args.p_category_slug,
        p_thumbnail_url: args.p_thumbnail_url,
    } as any);
    if (error) throw error;
    return data as string;
}

export async function is_admin(
    client: SupabaseClient<Database>,
    args: { uid: string }
) {
    const { data, error } = await client.rpc("is_admin", {
        uid: args.uid,
    } as any);
    if (error) throw error;
    return data as boolean;
}

export async function publish_prompt(
    client: SupabaseClient<Database>,
    args: { p_id: string; make_published: boolean | undefined }
) {
    const { data, error } = await client.rpc("publish_prompt", {
        p_id: args.p_id,
        make_published: args.make_published,
    } as any);
    if (error) throw error;
    return data as void;
}
