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
type PromptRow = Database["public"]["Tables"]["prompts"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export type GetAllPromptsOptions = {
    search?: string; // matches title/description (ILIKE)
    status?: PromptStatus | "all"; // filter by status
    categorySlug?: string; // filter by category (slug)
    isLocked?: boolean | "all"; // filter locked/unlocked
    page?: number; // 1-based page index
    pageSize?: number; // items per page
    sortBy?: "updated_at" | "created_at" | "title";
    sortDir?: "asc" | "desc";
};

export type PromptListItem = {
    id: string;
    title: string | null;
    status: PromptStatus | null;
    isLocked: boolean;
    updatedAt: string | null;
    category: { id: string; name: string | null; slug: string | null } | null;
};

export type GetAllPromptsResult = {
    items: PromptListItem[];
    count: number; // total count (ignoring pagination)
    page: number;
    pageSize: number;
};

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

export const createPromptAction = async (fromData: FormData) => {
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

export const savePromptAction = async (id: string, formData: FormData) => {
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
    redirect("/admin/prompts");
};

export const deletePromptAction = async (formData: FormData) => {
    const { client } = await requireAdmin();
    const id = String(formData.get("id") || "");
    await promptsRepo(client).remove(id);
    revalidatePath("/admin/prompts");
};

export const publishPromptAction = async (id: string, make = true) => {
    const { client } = await requireAdmin();
    await publish_prompt(client, { p_id: id, make_published: make });
    revalidatePath(`/admin/prompts/${id}/edit`);
};

export const getPromptAction = async (id: string) => {
    const { client } = await requireAdmin();
    const { data, error } = await client
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data as Database["public"]["Tables"]["prompts"]["Row"];
};

export const getAllPromptsAction = async (
    opts: GetAllPromptsOptions = {}
): Promise<GetAllPromptsResult> => {
    const {
        search,
        status = "all",
        categorySlug,
        isLocked = "all",
        page = 1,
        pageSize = 20,
        sortBy = "updated_at",
        sortDir = "desc",
    } = opts;

    const { client } = await requireAdmin();

    // Resolve category slug -> id (so we can filter by category_id reliably)
    let categoryId: string | null = null;
    if (categorySlug) {
        const { data: cat, error: catErr } = await client
            .from("categories")
            .select("id")
            .eq("slug", categorySlug)
            .single();
        if (catErr) {
            // slug not found → return empty result set
            return { items: [], count: 0, page, pageSize };
        }
        categoryId = cat?.id ?? null;
    }

    // Build the base query with a related select of category (id,name,slug)
    // Note: the alias `categories:category_id` selects the referenced row
    let query = client
        .from("prompts")
        .select(
            "id,title,status,is_locked,updated_at,category_id, categories:category_id (id,name,slug)",
            { count: "exact" }
        );

    // Filters
    if (status !== "all") query = query.eq("status", status);
    if (isLocked !== "all") query = query.eq("is_locked", isLocked);
    if (categoryId) query = query.eq("category_id", categoryId);
    if (search && search.trim()) {
        const term = search.trim();
        // ILIKE on title OR description
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortDir === "asc" });

    // Pagination (PostgREST uses 0-based ranges)
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const items: PromptListItem[] = (data ?? []).map((row: any) => {
        const cat = row.categories as Pick<
            CategoryRow,
            "id" | "name" | "slug"
        > | null;
        return {
            id: row.id as string,
            title: (row.title ?? null) as string | null,
            status: (row.status ?? null) as PromptStatus | null,
            isLocked: !!row.is_locked,
            updatedAt: (row.updated_at ?? null) as string | null,
            category: cat
                ? { id: cat.id, name: cat.name ?? null, slug: cat.slug ?? null }
                : null,
        };
    });

    return {
        items,
        count: count ?? items.length,
        page,
        pageSize,
    };
};

export const toggleLockAction = async (formData: FormData) => {
    const { client } = await requireAdmin();
    const id = String(formData.get("id") || "");
    const current = String(formData.get("current") || "") === "true";
    await promptsRepo(client).update(id, {
        is_locked: !current,
        updated_at: new Date().toISOString(),
    });
    revalidatePath("/admin/prompts");
};
