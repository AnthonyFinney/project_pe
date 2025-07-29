import { supabase } from "./supabaseClient";
import { PromptType } from "@/types";

export const createPrompt = async (
    prompt: Omit<PromptType, "id" | "created_at" | "updated_at">
) => {
    const { data, error } = await supabase
        .from("prompts")
        .insert([prompt])
        .select()
        .single();

    if (error) throw error;

    return data as PromptType;
};
