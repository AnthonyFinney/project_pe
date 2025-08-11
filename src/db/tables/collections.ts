// AUTO-GENERATED on 2025-08-11T15:34:38.036136Z
// Clean TypeScript helpers for 'collections' table/view
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
export type Collections = Tables<"collections">;
export type CollectionsInsert = TablesInsert<"collections">;
export type CollectionsUpdate = TablesUpdate<"collections">;

// Zod schema for runtime validation
export const collectionsSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    is_public: z.boolean(),
    user_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

// CRUD Helpers
export function collectionsRepo(client: SupabaseClient<Database>) {
    const table = client.from("collections");

    async function list() {
        const { data, error } = await table
            .select("*")
            .order("id", { ascending: true });
        if (error) throw error;
        return data as Collections[];
    }

    async function getById(id: string) {
        const { data, error } = await table.select("*").eq("id", id).single();
        if (error) throw error;
        return data as Collections;
    }

    async function create(values: CollectionsInsert) {
        const parse = collectionsSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table.insert(values).select("*").single();
        if (error) throw error;
        return data as Collections;
    }

    async function update(id: string, values: CollectionsUpdate) {
        const parse = collectionsSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table
            .update(values)
            .eq("id", id)
            .select("*")
            .single();
        if (error) throw error;
        return data as Collections;
    }

    async function remove(id: string) {
        const { error } = await table.delete().eq("id", id);
        if (error) throw error;
    }

    return { list, getById, create, update, remove };
}
