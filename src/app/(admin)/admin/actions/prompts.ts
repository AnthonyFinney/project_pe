"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import {
    create_prompt_admin,
    publish_prompt,
    promptsRepo,
    promptsSchema,
} from "@/db";
import { Constants, Database } from "@/types/database.types";

type PromptType = Database["public"]["Enums"]["prompt_type_enum"];
type PromptStatus = Database["public"]["Enums"]["prompt_status_enum"];

const TYPE_VALUES = Constants.public.Enums
    .prompt_type_enum as readonly PromptType[];
const STATUS_VALUES = Constants.public.Enums
    .prompt_status_enum as readonly PromptStatus[];

const now = () => new Date().toISOString();
const toStr = (v: FormDataEntryValue | null) =>
    typeof v === "string" ? v : "";
const toOptStr = (v: FormDataEntryValue | null | undefined) => {
    const s = typeof v === "string" ? v.trim() : "";
    return s ? s : undefined;
};
const toCsv = (v: FormDataEntryValue | null) => {
    const s = typeof v === "string" ? v : "";
    return s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
};
const toBool = (v: FormDataEntryValue | null) => {
    const s = typeof v === "string" ? v.toLowerCase() : "";
    return s === "on" || s === "true" || s === "1";
};
const toJson = (v: FormDataEntryValue | null) => {
    const s = typeof v === "string" ? v.trim() : "";
    if (!s) return {};
    try {
        return JSON.parse(s);
    } catch {
        return {};
    }
};
const pickEnum = <T extends string>(
    v: FormDataEntryValue | null,
    allowed: readonly T[],
    fallback: T
): T => {
    const s = typeof v === "string" ? v.trim() : "";
    return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
};

export const createPrompt = async (fromData: FormData) => {
    const { client } = await requireAdmin();

    const title = toStr(fromData.get("title"));
    const content = toStr(fromData.get("content"));
    if (!title || !content) throw new Error("Title and content are required!");

    const id = await create_prompt_admin(client, {
        p_title: title,
        p_content: content,
        p_description: toOptStr(fromData.get("description")),
        p_category_slug: toOptStr(fromData.get("category_slug")),
        p_thumbnail_url: toOptStr(fromData.get("thumbnail_url")),
    });

    const patch = {
        tags: toCsv(fromData.get("tags")),
        use_cases: toCsv(fromData.get("use_cases")),
        variables: toJson(fromData.get("variables")),
        example_values: toJson(fromData.get("example_values")),
        type: pickEnum(fromData.get("type"), TYPE_VALUES, "text"),
        status: pickEnum(fromData.get("status"), STATUS_VALUES, "draft"),
        is_locked: toBool(fromData.get("is_locked")),
        updated_at: now(),
    };

    const parsed = promptsSchema.partial().safeParse(patch);
    if (!parsed.success) throw new Error(parsed.error.message);

    await promptsRepo(client).update(id, patch);

    revalidatePath("/admin/prompts");
    redirect("/admin/prompts");
};

export async function savePrompt(id: string, formData: FormData) {
    const { client } = await requireAdmin();

    const update = {
        title: toStr(formData.get("title")),
        content: toStr(formData.get("content")),
        description: toOptStr(formData.get("description")) ?? null,
        thumbnail_url: toOptStr(formData.get("thumbnail_url")) ?? null,
        category_id: toOptStr(formData.get("category_id")) ?? null,
        tags: toCsv(formData.get("tags")),
        use_cases: toCsv(formData.get("use_cases")),
        variables: toJson(formData.get("variables")),
        example_values: toJson(formData.get("example_values")),
        type: pickEnum(formData.get("type"), TYPE_VALUES, "text"),
        status: pickEnum(formData.get("status"), STATUS_VALUES, "draft"),
        is_locked: toBool(formData.get("is_locked")),
        updated_at: now(),
    };

    const parsed = promptsSchema.partial().safeParse(update);
    if (!parsed.success) throw new Error(parsed.error.message);

    await promptsRepo(client).update(id, update);

    revalidatePath(`/admin/prompts/${id}/edit`);
}

export async function removePrompt(id: string) {
    const { client } = await requireAdmin();
    await promptsRepo(client).remove(id);
    revalidatePath("/admin/prompts");
    redirect("/admin/prompts");
}

export async function publishPromptAction(id: string, make = true) {
    const { client } = await requireAdmin();
    await publish_prompt(client, { p_id: id, make_published: make });
    revalidatePath(`/admin/prompts/${id}/edit`);
}
