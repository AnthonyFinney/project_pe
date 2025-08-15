import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import { updateCategoryAction } from "../../../actions/categories";

type PageProps = {
    params: { id: string };
};

export default async function EditCategoryPage({ params }: PageProps) {
    const { client } = await requireAdmin();

    const { data: category, error } = await client
        .from("categories")
        .select("id, name, icon, description")
        .eq("id", params.id)
        .single();

    if (error) {
        console.error(error);
        notFound();
    }
    if (!category) notFound();

    return (
        <div className="max-w-xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Edit Category</h1>
                    <p className="text-gray-600">
                        Update details for this category
                    </p>
                </div>
                <Link
                    href="/admin/categories"
                    className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
                >
                    Back
                </Link>
            </div>

            {/* Update form */}
            <form action={updateCategoryAction} className="space-y-4">
                <input type="hidden" name="id" value={category.id} />

                <label className="grid gap-1">
                    <span className="font-medium">Name *</span>
                    <input
                        name="name"
                        required
                        minLength={2}
                        maxLength={80}
                        defaultValue={category.name ?? ""}
                        placeholder="e.g. Writing"
                        className="border rounded px-3 py-2"
                    />
                    <span className="text-xs text-gray-500">
                        Human-readable name shown to users.
                    </span>
                </label>

                <label className="grid gap-1">
                    <span className="font-medium">Icon *</span>
                    <input
                        name="icon"
                        required
                        minLength={2}
                        maxLength={80}
                        defaultValue={category.icon ?? ""}
                        placeholder="icon name"
                        className="border rounded px-3 py-2"
                    />
                    <span className="text-xs text-gray-500">
                        Web icon names
                    </span>
                </label>

                <label className="grid gap-1">
                    <span className="font-medium">Description</span>
                    <textarea
                        name="description"
                        rows={3}
                        defaultValue={category.description ?? ""}
                        placeholder="Optional description…"
                        className="border rounded px-3 py-2"
                    />
                </label>

                <div className="flex gap-2">
                    <button className="px-3 py-2 rounded bg-black text-white">
                        Save changes
                    </button>
                    <Link
                        href="/admin/categories"
                        className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
