// AUTO-GENERATED on 2025-08-11T15:34:38.034479Z
// Clean TypeScript helpers for 'categories' table/view
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
export type Categories = Tables<"categories">;
export type CategoriesInsert = TablesInsert<"categories">;
export type CategoriesUpdate = TablesUpdate<"categories">;

// Zod schema for runtime validation
export const categoriesSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    icon: z.string().nullable(),
    prompt_count: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
});

// CRUD Helpers
export function categoriesRepo(client: SupabaseClient<Database>) {
    const table = client.from("categories");

    async function list() {
        const { data, error } = await table
            .select("*")
            .order("id", { ascending: true });
        if (error) throw error;
        return data as Categories[];
    }

    async function getById(id: string) {
        const { data, error } = await table.select("*").eq("id", id).single();
        if (error) throw error;
        return data as Categories;
    }

    async function create(values: CategoriesInsert) {
        const parse = categoriesSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table.insert(values).select("*").single();
        if (error) throw error;
        return data as Categories;
    }

    async function update(id: string, values: CategoriesUpdate) {
        const parse = categoriesSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table
            .update(values)
            .eq("id", id)
            .select("*")
            .single();
        if (error) throw error;
        return data as Categories;
    }

    async function remove(id: string) {
        const { error } = await table.delete().eq("id", id);
        if (error) throw error;
    }

    return { list, getById, create, update, remove };
}
