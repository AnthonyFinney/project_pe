"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";
import Link from "next/link";

const mockPrompts = [
  {
    id: "1",
    title: "Creative Blog Post Writer",
    category: "Writing",
    status: "published",
    isLocked: false,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "2",
    title: "Fantasy Landscape Generator",
    category: "Image Generation",
    status: "published",
    isLocked: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Advanced SEO Content Strategy",
    category: "Writing",
    status: "published",
    isLocked: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
  },
  {
    id: "4",
    title: "Portrait Photography Prompt",
    category: "Image Generation",
    status: "draft",
    isLocked: true,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
];

export default function AdminPrompts() {
  const [prompts, setPrompts] = useState(mockPrompts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = prompt.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || prompt.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || prompt.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      setPrompts(prompts.filter((p) => p.id !== id));
    }
  };

  const toggleLock = (id: string) => {
    setPrompts(
      prompts.map((p) => (p.id === id ? { ...p, isLocked: !p.isLocked } : p))
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prompts</h1>
            <p className="text-gray-600">Manage your AI prompts library</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Writing">Writing</option>
              <option value="Image Generation">Image Generation</option>
              <option value="Coding">Coding</option>
              <option value="Business">Business</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Button variant="outline" className="bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
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
                {filteredPrompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {prompt.title}
                        </span>
                        {prompt.isLocked && (
                          <Lock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {prompt.category}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          prompt.status
                        )}`}
                      >
                        {prompt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {prompt.updatedAt}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Link href={`/admin/prompts/${prompt.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLock(prompt.id)}
                          className="bg-transparent"
                        >
                          {prompt.isLocked ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(prompt.id)}
                          className="bg-transparent text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredPrompts.length} of {prompts.length} prompts
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-transparent"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-600 text-white"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              2
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
