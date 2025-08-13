// src/app/admin/categories/new/page.tsx
import { createCategoryAction } from "../../actions/categories";

export default function NewCategoryPage() {
    return (
        <form action={createCategoryAction} className="max-w-md space-y-3">
            <label className="grid gap-1">
                <span>Name *</span>
                <input name="name" className="border rounded px-2 py-1" />
            </label>
            <label className="grid gap-1">
                <span>Description</span>
                <textarea
                    name="description"
                    className="border rounded px-2 py-1"
                />
            </label>
            <button className="px-3 py-2 rounded bg-black text-white">
                Create
            </button>
        </form>
    );
}
