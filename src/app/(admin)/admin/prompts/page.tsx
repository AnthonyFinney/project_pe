// app/admin/prompts/page.tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
import {
    getAllPromptsAction,
    deletePromptAction,
    toggleLockAction,
} from "../actions/prompts";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Edit, Lock, Unlock } from "lucide-react";
import DeletePromptForm from "@/components/admin/DeletePromptForm";

type SearchParams = {
    q?: string | string[];
    status?: "all" | "draft" | "published" | "archived" | string | string[];
    category?: string | string[]; // category slug
    page?: string | string[];
};

function valOf(v: string | string[] | undefined) {
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
        published: "bg-green-100 text-green-800",
        draft: "bg-yellow-100 text-yellow-800",
        archived: "bg-gray-100 text-gray-800",
    };
    return styles[status] ?? styles.draft;
}

export default async function AdminPromptsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    // Next.js requires awaiting searchParams in Server Components
    const sp = await searchParams;

    const q = (valOf(sp.q) ?? "").trim();
    const status =
        (valOf(sp.status) as
            | "all"
            | "draft"
            | "published"
            | "archived"
            | undefined) ?? "all";
    const categorySlug = valOf(sp.category) || undefined;
    const page = Math.max(1, Number(valOf(sp.page) ?? "1"));
    const pageSize = 20;

    const {
        items,
        count,
        page: curPage,
        pageSize: curSize,
    } = await getAllPromptsAction({
        search: q || undefined,
        status,
        categorySlug,
        isLocked: "all",
        page,
        pageSize,
        sortBy: "updated_at",
        sortDir: "desc",
    });

    const totalPages = Math.max(1, Math.ceil(count / curSize));

    // Build query helpers for pagination links
    const base = new URLSearchParams();
    if (q) base.set("q", q);
    if (status && status !== "all") base.set("status", status);
    if (categorySlug) base.set("category", categorySlug);

    const prevHref = `/admin/prompts?${new URLSearchParams({
        ...Object.fromEntries(base.entries()),
        page: String(Math.max(1, curPage - 1)),
    })}`;
    const nextHref = `/admin/prompts?${new URLSearchParams({
        ...Object.fromEntries(base.entries()),
        page: String(Math.min(totalPages, curPage + 1)),
    })}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Prompts
                    </h1>
                    <p className="text-gray-600">
                        Manage your AI prompts library
                    </p>
                </div>
                <Link href="/admin/prompts/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        New Prompt
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                {/* Submit via GET to filter on the server */}
                <form
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                    action="/admin/prompts"
                    method="get"
                >
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Search prompts..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category filter (by slug) from current page items */}
                    <select
                        name="category"
                        defaultValue={categorySlug ?? ""}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {Array.from(
                            new Map(
                                items
                                    .filter((i) => i.category?.slug)
                                    .map((i) => [
                                        i.category!.slug!,
                                        i.category!.name ?? i.category!.slug!,
                                    ])
                            ).entries()
                        ).map(([slug, label]) => (
                            <option key={slug} value={slug}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <select
                        name="status"
                        defaultValue={status}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>

                    <Button
                        type="submit"
                        variant="outline"
                        className="bg-transparent"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Apply
                    </Button>
                </form>
            </div>

            {/* Prompts Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Title
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Category
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Status
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
                            {items.map((prompt) => (
                                <tr
                                    key={prompt.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900">
                                                {prompt.title ?? "(untitled)"}
                                            </span>
                                            {prompt.isLocked && (
                                                <Lock className="w-4 h-4 text-yellow-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {prompt.category?.name ??
                                            prompt.category?.slug ??
                                            "—"}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                String(prompt.status ?? "draft")
                                            )}`}
                                        >
                                            {String(prompt.status ?? "draft")}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {prompt.updatedAt
                                            ? new Date(
                                                  prompt.updatedAt
                                              ).toLocaleString()
                                            : "—"}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/prompts/${prompt.id}/edit`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-transparent"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            {/* Toggle lock (server action) */}
                                            <form action={toggleLockAction}>
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={prompt.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="current"
                                                    value={String(
                                                        prompt.isLocked
                                                    )}
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-transparent"
                                                    type="submit"
                                                >
                                                    {prompt.isLocked ? (
                                                        <Unlock className="w-4 h-4" />
                                                    ) : (
                                                        <Lock className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </form>

                                            {/* Delete (server action) with client-side confirm */}
                                            <DeletePromptForm
                                                id={prompt.id}
                                                action={deletePromptAction}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-8 text-center text-gray-500"
                                    >
                                        No prompts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {items.length} of {count} prompts
                </p>
                <div className="flex space-x-2">
                    <Link href={prevHref} aria-disabled={curPage <= 1}>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={curPage <= 1}
                            className="bg-transparent"
                        >
                            Previous
                        </Button>
                    </Link>
                    <span className="px-3 py-2 text-sm border rounded bg-white">
                        Page {curPage} / {totalPages}
                    </span>
                    <Link href={nextHref} aria-disabled={curPage >= totalPages}>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={curPage >= totalPages}
                            className="bg-transparent"
                        >
                            Next
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
