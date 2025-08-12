"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Save,
    Eye,
    Plus,
    Trash2,
    Edit,
    X,
    Settings,
} from "lucide-react";

import VariableModal from "@/components/admin/VariableModal";
import PreviewModal from "@/components/admin/PreviewModal";

// DB types/enums
import type { Database } from "@/types/database.types";
import { Constants } from "@/types/database.types";

type PromptStatus = Database["public"]["Enums"]["prompt_status_enum"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type CategoryOption = Pick<CategoryRow, "id" | "name" | "slug">;

export interface Variable {
    id: string;
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "dropdown" | "number" | "url";
    placeholder?: string;
    description?: string;
    required?: boolean;
    options?: string[];
}

export interface PromptFormData {
    title: string;
    description: string;
    content: string;
    categorySlug: string; // RPC expects slug
    isLocked: boolean;
    status: PromptStatus;
    variables: Variable[];
    useCases: string[];
    tags: string[];
    thumbnailUrl?: string;
    exampleValues?: Record<string, any>;
}

// enum values straight from DB constants (prevents drift)
const STATUS_VALUES = Constants.public.Enums
    .prompt_status_enum as readonly PromptStatus[];
const toPromptStatus = (v: string): PromptStatus =>
    STATUS_VALUES.includes(v as PromptStatus) ? (v as PromptStatus) : "draft";

interface PromptFormProps {
    categories?: CategoryOption[]; // make optional; default to []
    initialData?: Partial<PromptFormData>;
    onSave: (data: PromptFormData) => Promise<void>;
    isLoading: boolean;
    mode: "create" | "edit";
    backUrl?: string;
}

export default function PromptForm({
    categories = [], // ✅ avoid categories.length crash
    initialData = {},
    onSave,
    isLoading,
    mode,
    backUrl = "/admin/prompts",
}: PromptFormProps) {
    // ✅ safe merge: never overwrite defaults with undefined
    const [promptData, setPromptData] = useState<PromptFormData>({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        content: initialData.content ?? "",
        categorySlug: initialData.categorySlug ?? "",
        isLocked: initialData.isLocked ?? false,
        status: initialData.status ?? "draft",
        variables: initialData.variables ?? [],
        useCases: initialData.useCases ?? [],
        tags: initialData.tags ?? [],
        thumbnailUrl: initialData.thumbnailUrl ?? "",
        exampleValues: initialData.exampleValues ?? {},
    });

    const [showPreview, setShowPreview] = useState(false);
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [editingVariable, setEditingVariable] = useState<Variable | null>(
        null
    );
    const [previewValues, setPreviewValues] = useState<Record<string, string>>(
        {}
    );

    // Local helpers for adding list items
    const [newUseCase, setNewUseCase] = useState("");
    const [newTag, setNewTag] = useState("");

    // JSON textarea state for exampleValues
    const [exampleText, setExampleText] = useState(
        JSON.stringify(promptData.exampleValues ?? {}, null, 2)
    );
    const [exampleError, setExampleError] = useState<string | null>(null);

    // Derived flag: any validation blockers
    const canSave = useMemo(() => {
        return (
            !!promptData.title.trim() &&
            !!promptData.description.trim() &&
            !!promptData.content.trim() &&
            !!promptData.categorySlug &&
            !exampleError
        );
    }, [promptData, exampleError]);

    // Prepare category options with slug (filter out null/undefined slugs)
    const categoryOptions = useMemo(
        () =>
            (categories ?? [])
                .filter(
                    (c): c is CategoryOption & { slug: string } => !!c?.slug
                )
                .map((c) => ({ ...c, name: c.name ?? c.slug })),
        [categories]
    );

    // Initialize preview values when variables change
    useEffect(() => {
        const initialValues: Record<string, string> = {};
        (promptData.variables ?? []).forEach((v) => {
            initialValues[v.name] = "";
        });
        setPreviewValues(initialValues);
    }, [promptData.variables]);

    // Keep exampleValues in sync with textarea (validate on change)
    useEffect(() => {
        try {
            const parsed = exampleText.trim() ? JSON.parse(exampleText) : {};
            setPromptData((p) => ({ ...p, exampleValues: parsed }));
            setExampleError(null);
        } catch {
            setExampleError("Invalid JSON");
        }
    }, [exampleText]);

    const handleSave = async () => {
        if (!canSave) {
            alert(
                exampleError
                    ? "Please fix Example Values JSON."
                    : "Please fill out all required fields."
            );
            return;
        }
        await onSave(promptData);
    };

    // Variables CRUD
    const handleAddVariable = () => {
        setEditingVariable(null);
        setShowVariableModal(true);
    };
    const handleEditVariable = (variable: Variable) => {
        setEditingVariable(variable);
        setShowVariableModal(true);
    };
    const handleDeleteVariable = (id: string) => {
        if (!confirm("Delete this variable?")) return;
        setPromptData((prev) => ({
            ...prev,
            variables: (prev.variables ?? []).filter((v) => v.id !== id),
        }));
    };
    const handleSaveVariable = (variable: Variable) => {
        setPromptData((prev) => {
            const list = prev.variables ?? [];
            const exists = list.some((v) => v.id === variable.id);
            return {
                ...prev,
                variables: exists
                    ? list.map((v) => (v.id === variable.id ? variable : v))
                    : [...list, { ...variable, id: Date.now().toString() }],
            };
        });
        setShowVariableModal(false);
        setEditingVariable(null);
    };

    // Use cases
    const addUseCase = () => {
        const val = newUseCase.trim();
        if (val && !(promptData.useCases ?? []).includes(val)) {
            setPromptData((prev) => ({
                ...prev,
                useCases: [...(prev.useCases ?? []), val],
            }));
            setNewUseCase("");
        }
    };
    const removeUseCase = (val: string) =>
        setPromptData((prev) => ({
            ...prev,
            useCases: (prev.useCases ?? []).filter((u) => u !== val),
        }));

    // Tags
    const addTag = () => {
        const val = newTag.trim();
        if (val && !(promptData.tags ?? []).includes(val)) {
            setPromptData((prev) => ({
                ...prev,
                tags: [...(prev.tags ?? []), val],
            }));
            setNewTag("");
        }
    };
    const removeTag = (val: string) =>
        setPromptData((prev) => ({
            ...prev,
            tags: (prev.tags ?? []).filter((t) => t !== val),
        }));

    // Preview
    const generatePreview = () => {
        let preview = promptData.content ?? "";
        (promptData.variables ?? []).forEach((variable) => {
            const value = previewValues[variable.name] || `{${variable.name}}`;
            preview = preview.replace(
                new RegExp(`{${variable.name}}`, "g"),
                value
            );
        });
        return preview;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href={backUrl}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Prompts
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {mode === "create"
                                ? "Create New Prompt"
                                : "Edit Prompt"}
                        </h1>
                        <p className="text-gray-600">
                            {mode === "create"
                                ? "Create a new AI prompt template for users"
                                : "Modify your AI prompt configuration"}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="bg-transparent"
                        disabled={!(promptData.content ?? "").trim()}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading || !canSave}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading
                            ? mode === "create"
                                ? "Creating..."
                                : "Saving..."
                            : mode === "create"
                            ? "Create Prompt"
                            : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={promptData.title}
                                    onChange={(e) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter prompt title..."
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={promptData.description}
                                    onChange={(e) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Describe what this prompt does..."
                                    className="mt-1 min-h-[100px]"
                                />
                            </div>

                            <div>
                                <Label htmlFor="content">
                                    Prompt Content *
                                </Label>
                                <Textarea
                                    id="content"
                                    value={promptData.content}
                                    onChange={(e) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter your prompt content with variables like {variable_name}..."
                                    className="mt-1 min-h-[150px] font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Use curly braces to define variables:{" "}
                                    {"{variable_name}"}
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="thumbnailUrl">
                                    Thumbnail URL
                                </Label>
                                <Input
                                    id="thumbnailUrl"
                                    value={promptData.thumbnailUrl ?? ""}
                                    onChange={(e) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            thumbnailUrl: e.target.value,
                                        }))
                                    }
                                    placeholder="https://..."
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Variables */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    Variables{" "}
                                    {(promptData.variables ?? []).length > 0
                                        ? `(${promptData.variables!.length})`
                                        : ""}
                                </CardTitle>
                                <Button
                                    onClick={handleAddVariable}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Variable
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {(promptData.variables ?? []).length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No variables defined yet.</p>
                                    <p className="text-sm">
                                        Add variables to make your prompt
                                        customizable.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(promptData.variables ?? []).map(
                                        (variable) => (
                                            <div
                                                key={variable.id}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">
                                                            {variable.label}
                                                        </span>
                                                        <Badge variant="secondary">
                                                            {variable.type}
                                                        </Badge>
                                                        {variable.required && (
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-xs"
                                                            >
                                                                Required
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Variable:{" "}
                                                        <code className="bg-gray-100 px-1 rounded">
                                                            {"{" +
                                                                variable.name +
                                                                "}"}
                                                        </code>
                                                    </p>
                                                    {variable.description && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {
                                                                variable.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditVariable(
                                                                variable
                                                            )
                                                        }
                                                        className="bg-transparent"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteVariable(
                                                                variable.id
                                                            )
                                                        }
                                                        className="bg-transparent text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Use Cases */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Use Cases</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {(promptData.useCases ?? []).map(
                                    (useCase, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                        >
                                            <span className="text-sm">
                                                {useCase}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeUseCase(useCase)
                                                }
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )
                                )}
                                {(promptData.useCases ?? []).length === 0 && (
                                    <p className="text-gray-500 text-sm">
                                        No use cases added yet
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <Input
                                    value={newUseCase}
                                    onChange={(e) =>
                                        setNewUseCase(e.target.value)
                                    }
                                    placeholder="Add a use case..."
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(), addUseCase())
                                    }
                                    className="flex-1"
                                />
                                <Button
                                    onClick={addUseCase}
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {(promptData.tags ?? []).map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-800"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="text-gray-500 hover:text-gray-700"
                                            aria-label={`Remove ${tag}`}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {(promptData.tags ?? []).length === 0 && (
                                    <p className="text-gray-500 text-sm">
                                        No tags yet. Add a few keywords.
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add a tag…"
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(), addTag())
                                    }
                                    className="flex-1"
                                />
                                <Button
                                    onClick={addTag}
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Example Values (JSON) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Example Values (JSON)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Textarea
                                value={exampleText}
                                onChange={(e) => setExampleText(e.target.value)}
                                placeholder='{"var1":"example", "var2": 123}'
                                className="font-mono text-sm min-h-[160px]"
                            />
                            {exampleError ? (
                                <p className="text-xs text-red-600">
                                    {exampleError}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    This JSON is stored and used to prefill your
                                    variables in examples.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={promptData.categorySlug}
                                    onValueChange={(value) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            categorySlug: value,
                                        }))
                                    }
                                    disabled={
                                        (categoryOptions ?? []).length === 0
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue
                                            placeholder={
                                                (categoryOptions ?? []).length
                                                    ? "Select category..."
                                                    : "No categories found"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(categoryOptions ?? []).map((c) => (
                                            <SelectItem
                                                key={c.slug}
                                                value={c.slug}
                                            >
                                                {c.name ?? c.slug}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(categoryOptions ?? []).length === 0 && (
                                    <p className="text-xs text-amber-700 mt-1">
                                        No categories yet.{" "}
                                        <Link
                                            href="/admin/categories/new"
                                            className="underline"
                                        >
                                            Create one
                                        </Link>
                                        .
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={promptData.status}
                                    onValueChange={(value) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            status: toPromptStatus(value),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_VALUES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s.charAt(0).toUpperCase() +
                                                    s.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="premium">
                                        Premium Prompt
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                        Require subscription to access
                                    </p>
                                </div>
                                <Switch
                                    id="premium"
                                    checked={!!promptData.isLocked}
                                    onCheckedChange={(checked) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            isLocked: checked,
                                        }))
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Variables:
                                </span>
                                <span className="font-medium">
                                    {(promptData.variables ?? []).length}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Use Cases:
                                </span>
                                <span className="font-medium">
                                    {(promptData.useCases ?? []).length}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tags:</span>
                                <span className="font-medium">
                                    {(promptData.tags ?? []).length}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Characters:
                                </span>
                                <span className="font-medium">
                                    {(promptData.content ?? "").length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Preview */}
                    {(promptData.content ?? "").length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">
                                        {(promptData.content ?? "").replace(
                                            /\{([^}]+)\}/g,
                                            "{$1}"
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Variable Modal */}
            {showVariableModal && (
                <VariableModal
                    variable={editingVariable}
                    onSave={handleSaveVariable}
                    onClose={() => {
                        setShowVariableModal(false);
                        setEditingVariable(null);
                    }}
                />
            )}

            {/* Preview Modal */}
            {showPreview && (
                <PreviewModal
                    prompt={promptData}
                    previewValues={previewValues}
                    onPreviewValuesChange={setPreviewValues}
                    generatedPrompt={generatePreview()}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}
