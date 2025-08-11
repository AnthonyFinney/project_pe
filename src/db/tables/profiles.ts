// AUTO-GENERATED on 2025-08-11T15:34:38.037050Z
// Clean TypeScript helpers for 'profiles' table/view
// Edit safely: these are small and readable by design.
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
    Database,
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/types/database.types";
import { Constants } from "@/types/database.types";

// Types
export type Profiles = Tables<"profiles">;
export type ProfilesInsert = TablesInsert<"profiles">;
export type ProfilesUpdate = TablesUpdate<"profiles">;

// Zod schema for runtime validation
export const profilesSchema = z.object({
    id: z.string(),
    email: z.string().nullable(),
    display_name: z.string().nullable(),
    full_name: z.string().nullable(),
    avatar_url: z.string().nullable(),
    role: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

// CRUD Helpers
export function profilesRepo(client: SupabaseClient<Database>) {
    const table = client.from("profiles");

    async function list() {
        const { data, error } = await table
            .select("*")
            .order("id", { ascending: true });
        if (error) throw error;
        return data as Profiles[];
    }

    async function getById(id: string) {
        const { data, error } = await table.select("*").eq("id", id).single();
        if (error) throw error;
        return data as Profiles;
    }

    async function create(values: ProfilesInsert) {
        const parse = profilesSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table.insert(values).select("*").single();
        if (error) throw error;
        return data as Profiles;
    }

    async function update(id: string, values: ProfilesUpdate) {
        const parse = profilesSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table
            .update(values)
            .eq("id", id)
            .select("*")
            .single();
        if (error) throw error;
        return data as Profiles;
    }

    async function remove(id: string) {
        const { error } = await table.delete().eq("id", id);
        if (error) throw error;
    }

    return { list, getById, create, update, remove };
}
