// AUTO-GENERATED on 2025-08-11T15:34:38.038966Z
// Clean TypeScript helpers for 'prompts' table/view
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
export type Prompts = Tables<"prompts">;
export type PromptsInsert = TablesInsert<"prompts">;
export type PromptsUpdate = TablesUpdate<"prompts">;

// Zod schema for runtime validation
export const promptsSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    description: z.string().nullable(),
    thumbnail_url: z.string().nullable(),
    category_id: z.string().nullable(),
    created_by: z.string().nullable(),
    status: z.enum(Constants.public.Enums.prompt_status_enum),
    type: z.enum(Constants.public.Enums.prompt_type_enum),
    tags: z.array(z.string()),
    use_cases: z.array(z.string()),
    variables: z.any(),
    example_values: z.any(),
    is_locked: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

// CRUD Helpers
export function promptsRepo(client: SupabaseClient<Database>) {
    const table = client.from("prompts");

    async function list() {
        const { data, error } = await table
            .select("*")
            .order("id", { ascending: true });
        if (error) throw error;
        return data as Prompts[];
    }

    async function getById(id: string) {
        const { data, error } = await table.select("*").eq("id", id).single();
        if (error) throw error;
        return data as Prompts;
    }

    async function create(values: PromptsInsert) {
        const parse = promptsSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table.insert(values).select("*").single();
        if (error) throw error;
        return data as Prompts;
    }

    async function update(id: string, values: PromptsUpdate) {
        const parse = promptsSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table
            .update(values)
            .eq("id", id)
            .select("*")
            .single();
        if (error) throw error;
        return data as Prompts;
    }

    async function remove(id: string) {
        const { error } = await table.delete().eq("id", id);
        if (error) throw error;
    }

    return { list, getById, create, update, remove };
}
