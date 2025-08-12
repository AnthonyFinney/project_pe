import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { removeCategory } from "../actions/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Tag } from "lucide-react";

// If you want explicit typing, uncomment these lines:
// import type { Database } from "@/types/database.types";
// type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export const dynamic = "force-dynamic"; // or export const revalidate = 30;

export default async function CategoriesPage() {
    const client = await supabaseServer();

    const { data, error } = await client
        .from("categories")
        .select("id,name,slug,description,prompt_count,created_at,updated_at")
        .order("name", { ascending: true });

    if (error) {
        throw error;
    }

    const categories = data ?? [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="w-6 h-6 text-gray-700" />
                    <h1 className="text-3xl font-bold text-gray-900">
                        Categories
                    </h1>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        New Category
                    </Button>
                </Link>
            </div>

            {/* Empty state */}
            {categories.length === 0 && (
                <Card>
                    <CardContent className="p-6 text-center text-gray-600">
                        <p>No categories yet.</p>
                        <p className="text-sm">
                            Create your first category to organize prompts.
                        </p>
                        <div className="mt-4">
                            <Link href="/admin/categories/new">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Category
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* List */}
            {categories.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                                        Name
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                                        Slug
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                                        Description
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                                        Prompts
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                                        Updated
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-900">
                                            {c.name}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {c.slug}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {c.description ?? (
                                                <span className="text-gray-400">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {c.prompt_count ?? 0}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {c.updated_at
                                                ? new Date(
                                                      c.updated_at
                                                  ).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {/* If you add an edit page later: */}
                                                {/* <Link href={`/admin/categories/${c.id}/edit`}>
                          <Button variant="outline" size="sm" className="bg-transparent">Edit</Button>
                        </Link> */}

                                                <form
                                                    action={removeCategory.bind(
                                                        null,
                                                        c.id
                                                    )}
                                                >
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-transparent text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center text-gray-500"
                                        >
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
