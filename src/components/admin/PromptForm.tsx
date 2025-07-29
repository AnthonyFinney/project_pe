"use client";

import { useState, useEffect } from "react";
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
import Link from "next/link";
import VariableModal from "@/components/admin/VariableModal";
import PreviewModal from "@/components/admin/PreviewModal";

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
    category: string;
    isLocked: boolean;
    status: "draft" | "published" | "archived";
    variables: Variable[];
    useCases: string[];
}

const categories = [
    { value: "writing", label: "Writing" },
    { value: "image-generation", label: "Image Generation" },
    { value: "coding", label: "Coding" },
    { value: "business", label: "Business" },
    { value: "marketing", label: "Marketing" },
    { value: "education", label: "Education" },
    { value: "creative", label: "Creative" },
];

interface PromptFormProps {
    initialData?: Partial<PromptFormData>;
    onSave: (data: PromptFormData) => Promise<void>;
    isLoading: boolean;
    mode: "create" | "edit";
    backUrl?: string;
}

export default function PromptForm({
    initialData = {},
    onSave,
    isLoading,
    mode,
    backUrl = "/admin/prompts",
}: PromptFormProps) {
    const [promptData, setPromptData] = useState<PromptFormData>({
        title: "",
        description: "",
        content: "",
        category: "",
        isLocked: false,
        status: "draft",
        variables: [],
        useCases: [],
        ...initialData,
    });

    const [showPreview, setShowPreview] = useState(false);
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [editingVariable, setEditingVariable] = useState<Variable | null>(
        null
    );
    const [previewValues, setPreviewValues] = useState<Record<string, string>>(
        {}
    );
    const [newTag, setNewTag] = useState("");
    const [newUseCase, setNewUseCase] = useState("");

    // Initialize preview values when variables change
    useEffect(() => {
        const initialValues: Record<string, string> = {};
        promptData.variables.forEach((variable) => {
            initialValues[variable.name] = "";
        });
        setPreviewValues(initialValues);
    }, [promptData.variables]);

    const handleSave = async () => {
        if (!promptData.title.trim()) {
            alert("Please enter a prompt title");
            return;
        }
        if (!promptData.description.trim()) {
            alert("Please enter a prompt description");
            return;
        }
        if (!promptData.content.trim()) {
            alert("Please enter prompt content");
            return;
        }
        if (!promptData.category) {
            alert("Please select a category");
            return;
        }

        await onSave(promptData);
    };

    const handleAddVariable = () => {
        setEditingVariable(null);
        setShowVariableModal(true);
    };

    const handleEditVariable = (variable: Variable) => {
        setEditingVariable(variable);
        setShowVariableModal(true);
    };

    const handleDeleteVariable = (variableId: string) => {
        if (confirm("Are you sure you want to delete this variable?")) {
            setPromptData((prev) => ({
                ...prev,
                variables: prev.variables.filter((v) => v.id !== variableId),
            }));
        }
    };

    const handleSaveVariable = (variable: Variable) => {
        if (editingVariable) {
            setPromptData((prev) => ({
                ...prev,
                variables: prev.variables.map((v) =>
                    v.id === variable.id ? variable : v
                ),
            }));
        } else {
            const newVariable = {
                ...variable,
                id: Date.now().toString(),
            };
            setPromptData((prev) => ({
                ...prev,
                variables: [...prev.variables, newVariable],
            }));
        }
        setShowVariableModal(false);
        setEditingVariable(null);
    };

    const generatePreview = () => {
        let preview = promptData.content;
        promptData.variables.forEach((variable) => {
            const value = previewValues[variable.name] || `{${variable.name}}`;
            preview = preview.replace(
                new RegExp(`{${variable.name}}`, "g"),
                value
            );
        });
        return preview;
    };

    const addUseCase = () => {
        if (
            newUseCase.trim() &&
            !promptData.useCases.includes(newUseCase.trim())
        ) {
            setPromptData((prev) => ({
                ...prev,
                useCases: [...prev.useCases, newUseCase.trim()],
            }));
            setNewUseCase("");
        }
    };

    const removeUseCase = (useCaseToRemove: string) => {
        setPromptData((prev) => ({
            ...prev,
            useCases: prev.useCases.filter(
                (useCase) => useCase !== useCaseToRemove
            ),
        }));
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
                        disabled={!promptData.content.trim()}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
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
                        </CardContent>
                    </Card>

                    {/* Variables */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    Variables ({promptData.variables.length})
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
                            {promptData.variables.length === 0 ? (
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
                                    {promptData.variables.map((variable) => (
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
                                                        {variable.description}
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
                                    ))}
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
                                {promptData.useCases.map((useCase, index) => (
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
                                ))}
                                {promptData.useCases.length === 0 && (
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
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && addUseCase()
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
                                    value={promptData.category}
                                    onValueChange={(value) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            category: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select category..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.value}
                                                value={category.value}
                                            >
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={promptData.status}
                                    onValueChange={(
                                        value:
                                            | "draft"
                                            | "published"
                                            | "archived"
                                    ) =>
                                        setPromptData((prev) => ({
                                            ...prev,
                                            status: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Draft
                                        </SelectItem>
                                        <SelectItem value="published">
                                            Published
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            Archived
                                        </SelectItem>
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
                                    checked={promptData.isLocked}
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
                                    {promptData.variables.length}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Use Cases:
                                </span>
                                <span className="font-medium">
                                    {promptData.useCases.length}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Characters:
                                </span>
                                <span className="font-medium">
                                    {promptData.content.length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Preview */}
                    {promptData.content && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">
                                        {promptData.content.replace(
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
