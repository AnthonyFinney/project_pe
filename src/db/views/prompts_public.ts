// AUTO-GENERATED on 2025-08-11T15:34:38.039923Z
// Clean TypeScript helpers for 'prompts_public' table/view
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

// View type: use the row shape from Tables<"prompts_public">
export type prompts_publicRow = Tables<"prompts_public">;

export const prompts_publicSchema = z.object({
    id: z.string().nullable(),
    title: z.string().nullable(),
    content: z.string().nullable(),
    thumbnail_url: z.string().nullable(),
    category_id: z.string().nullable(),
    category_name: z.string().nullable(),
    category_slug: z.string().nullable(),
    tags: z.array(z.string()).nullable(),
    use_cases: z.array(z.string()).nullable(),
    variables: z.any().nullable(),
    example_values: z.any().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
});

export function prompts_publicRepo(client: SupabaseClient<Database>) {
    const view = client.from("prompts_public");
    async function list() {
        const { data, error } = await view.select("*");
        if (error) throw error;
        return (data || []) as prompts_publicRow[];
    }
    return { list };
}
