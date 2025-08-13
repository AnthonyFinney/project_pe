// app/(admin)/admin/prompts/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import PromptForm, { type PromptFormData } from "@/components/admin/PromptForm";
import type { Database } from "@/types/database.types";
import { requireAdmin } from "@/lib/supabase/server";
import { getPromptAction, savePromptAction } from "../../../actions/prompts";
import { getCategoriesAction } from "../../../actions/categories";

type Db = Database;
type CategoryRow = Db["public"]["Tables"]["categories"]["Row"];
type PromptStatus = Db["public"]["Enums"]["prompt_status_enum"];

export default async function EditPromptPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin(); // gate the route

    // ✅ Await params before use
    const { id: promptId } = await params;

    // Fetch prompt + categories on the server
    const [prompt, categories] = await Promise.all([
        getPromptAction(promptId),
        getCategoriesAction(),
    ]);

    if (!prompt) return notFound();

    const cats = (categories ?? []) as Pick<
        CategoryRow,
        "id" | "name" | "slug"
    >[];
    const categorySlug =
        cats.find((c) => c.id === prompt.category_id)?.slug ?? "";

    // Map DB row -> PromptFormData the form expects
    const initialData: PromptFormData = {
        title: prompt.title ?? "",
        description: prompt.description ?? "",
        content: prompt.content ?? "",
        categorySlug,
        isLocked: !!prompt.is_locked,
        status: (prompt.status ?? "draft") as PromptStatus,
        variables: (prompt.variables as any[]) ?? [],
        useCases: (prompt.use_cases as string[]) ?? [],
        tags: (prompt.tags as string[]) ?? [],
        thumbnailUrl: prompt.thumbnail_url ?? "",
        exampleValues: (prompt.example_values as Record<string, any>) ?? {},
    };

    // Bridge: PromptFormData -> FormData -> your savePromptAction(id, fd)
    async function saveFromForm(input: PromptFormData) {
        "use server";

        const fd = new FormData();
        fd.set("title", input.title);
        fd.set("content", input.content);
        fd.set("description", input.description ?? "");

        // Slug -> id for your existing savePromptAction
        const cat = cats.find((c) => c.slug === input.categorySlug);
        if (cat?.id) fd.set("category_id", cat.id);

        // Arrays / JSON
        fd.set("use_cases", input.useCases.join(", "));
        fd.set("tags", input.tags.join(", "));
        fd.set("variables", JSON.stringify(input.variables ?? []));
        fd.set("example_values", JSON.stringify(input.exampleValues ?? {}));

        // Flags / optionals
        fd.set("status", input.status);
        fd.set("is_locked", String(input.isLocked));
        fd.set("thumbnail_url", input.thumbnailUrl ?? "");

        await savePromptAction(promptId, fd); // ✅ use awaited promptId
    }

    return (
        <PromptForm
            categories={cats}
            initialData={initialData}
            onSave={saveFromForm}
            isLoading={false}
            mode="edit"
            backUrl="/admin/prompts"
        />
    );
}
