"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Database } from "@/types/database.types";

const slugify = (s: string) =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export async function createCategoryAction(formData: FormData) {
    const { client } = await requireAdmin();

    const name = String(formData.get("name") || "").trim();
    const description =
        String(formData.get("description") || "").trim() || null;
    const icon = String(formData.get("icon") || "").trim() || null;

    if (!name) throw new Error("Name is required");

    const { error } = await client.from("categories").insert({
        id: crypto.randomUUID(),
        name,
        slug: slugify(name),
        description,
        icon,
        prompt_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}

export async function removeCategoryAction(id: string) {
    const { client } = await requireAdmin();
    const { error } = await client.from("categories").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/categories");
}

export const getCategoriesAction = async () => {
    const { client } = await requireAdmin();
    const { data, error } = await client
        .from("categories")
        .select("id,name,slug")
        .order("name");
    if (error) throw error;
    return data as Database["public"]["Tables"]["categories"]["Row"][];
};

export async function updateCategoryAction(formData: FormData) {
    const { client } = await requireAdmin();

    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const icon = String(formData.get("icon") ?? "").trim();
    const description =
        formData.get("description") === null
            ? null
            : String(formData.get("description")).trim();

    if (!id) throw new Error("Missing category id");
    if (!name || !icon) throw new Error("Name and icon are required");

    const { error } = await client
        .from("categories")
        .update({ name, icon, description })
        .eq("id", id);

    if (error) throw error;

    redirect("/admin/categories");
}
