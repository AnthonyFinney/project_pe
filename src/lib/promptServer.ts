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

export const getPrompt = async (id: string): Promise<PromptType> => {
    const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as PromptType;
};

export const getPrompts = async (): Promise<PromptType[]> => {
    const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as PromptType[];
};

export const updatePrompt = async (id: string, values: Partial<PromptType>) => {
    const { data, error } = await supabase
        .from("prompts")
        .update(values)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as PromptType;
};

export const deletePrompt = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);

    if (error) throw error;
    return true;
};
