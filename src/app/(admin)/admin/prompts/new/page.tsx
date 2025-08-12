// src/app/admin/prompts/new/page.tsx
import PromptForm, { type PromptFormData } from "@/components/admin/PromptForm";
import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
import { createPrompt as createPromptAction } from "../../actions/prompts";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type CategoryOption = Pick<CategoryRow, "id" | "name" | "slug">;

export default async function NewPromptPage() {
    const client = await supabaseServer();

    // 1) fetch categories from DB
    const { data: cats, error } = await client
        .from("categories")
        .select("id,name,slug")
        .order("name");

    if (error) throw error;
    const categories = (cats ?? []) as CategoryOption[];

    // 2) server action bridge: PromptFormData -> FormData -> your createPrompt(FormData)
    async function saveFromForm(input: PromptFormData) {
        "use server";

        const fd = new FormData();
        fd.set("title", input.title);
        fd.set("content", input.content);
        fd.set("description", input.description ?? "");
        fd.set("category_slug", input.categorySlug); // <- RPC expects slug
        fd.set("is_locked", String(input.isLocked));
        fd.set("status", input.status); // enum value
        fd.set("type", "text"); // or collect from form later
        fd.set("use_cases", input.useCases.join(", "));
        fd.set("variables", JSON.stringify(input.variables)); // stored as JSON
        // Optional (wire up in your form if/when you add them):
        fd.set("tags", input.tags.join(", "));
        fd.set("thumbnail_url", input.thumbnailUrl ?? "");
        fd.set("example_values", JSON.stringify(input.exampleValues ?? {}));

        await createPromptAction(fd); // this will redirect to /admin/prompts/:id/edit
    }

    return (
        <PromptForm
            categories={categories} // 3) pass real categories to the form
            mode="create"
            onSave={saveFromForm} // call your server action via this bridge
            isLoading={false} // you can remove this and use useTransition inside the form if you prefer
            backUrl="/admin/prompts"
        />
    );
}
