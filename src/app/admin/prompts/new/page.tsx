"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Eye, Plus, X, Edit3 } from "lucide-react"
import Link from "next/link"

interface Variable {
  name: string
  type: "text" | "textarea" | "select" | "dropdown" | "number" | "url"
  label?: string
  placeholder?: string
  options?: string[]
  required?: boolean
  description?: string
}

export default function NewPrompt() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    variables: [] as Variable[],
    isLocked: false,
    status: "draft",
    thumbnail: "",
    type: "text",
    tags: [] as string[],
  })
  const [newVariable, setNewVariable] = useState<Variable>({
    name: "",
    type: "text",
    label: "",
    placeholder: "",
    options: [],
    required: true,
    description: "",
  })
  const [newTag, setNewTag] = useState("")
  const [editingVariableIndex, setEditingVariableIndex] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd save to database
    console.log("Saving prompt:", formData)
    router.push("/admin/prompts")
  }

  const addVariable = () => {
    if (newVariable.name && !formData.variables.find((v) => v.name === newVariable.name.toUpperCase())) {
      const variable: Variable = {
        ...newVariable,
        name: newVariable.name.toUpperCase(),
        label:
          newVariable.label ||
          newVariable.name
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase()),
      }

      setFormData({
        ...formData,
        variables: [...formData.variables, variable],
      })

      // Reset form
      setNewVariable({
        name: "",
        type: "text",
        label: "",
        placeholder: "",
        options: [],
        required: true,
        description: "",
      })
    }
  }

  const updateVariable = () => {
    if (editingVariableIndex !== null && newVariable.name) {
      const updatedVariables = [...formData.variables]
      updatedVariables[editingVariableIndex] = {
        ...newVariable,
        name: newVariable.name.toUpperCase(),
        label:
          newVariable.label ||
          newVariable.name
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase()),
      }

      setFormData({
        ...formData,
        variables: updatedVariables,
      })

      setEditingVariableIndex(null)
      setNewVariable({
        name: "",
        type: "text",
        label: "",
        placeholder: "",
        options: [],
        required: true,
        description: "",
      })
    }
  }

  const editVariable = (index: number) => {
    setNewVariable({ ...formData.variables[index] })
    setEditingVariableIndex(index)
  }

  const removeVariable = (index: number) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((_, i) => i !== index),
    })
  }

  const addOption = () => {
    if (newVariable.options && newVariable.options.length < 10) {
      setNewVariable({
        ...newVariable,
        options: [...(newVariable.options || []), ""],
      })
    }
  }

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...(newVariable.options || [])]
    updatedOptions[index] = value
    setNewVariable({
      ...newVariable,
      options: updatedOptions,
    })
  }

  const removeOption = (index: number) => {
    setNewVariable({
      ...newVariable,
      options: newVariable.options?.filter((_, i) => i !== index) || [],
    })
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const variableTypes = [
    { value: "text", label: "Text Input" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Select Dropdown" },
    { value: "dropdown", label: "Multi-choice Dropdown" },
    { value: "number", label: "Number Input" },
    { value: "url", label: "URL Input" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/prompts">
              <Button variant="outline" size="sm" className="bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Prompt</h1>
              <p className="text-gray-600">Add a new prompt to your library</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="bg-transparent">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Prompt
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter prompt title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="writing">Writing</option>
                      <option value="image">Image Generation</option>
                      <option value="coding">Coding</option>
                      <option value="business">Business</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="social-media">Social Media</option>
                      <option value="productivity">Productivity</option>
                      <option value="lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="text">Text Generation</option>
                      <option value="image">Image Generation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt Content *
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your prompt content. Use [VARIABLE_NAME] for variables that users can customize."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use square brackets for variables, e.g., [TOPIC], [STYLE], [AUDIENCE]
                  </p>
                </div>
              </div>
            </div>

            {/* Variables */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Variables Configuration</h2>

              {/* Add/Edit Variable Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  {editingVariableIndex !== null ? "Edit Variable" : "Add New Variable"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variable Name *</label>
                    <input
                      type="text"
                      value={newVariable.name}
                      onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., TOPIC, STYLE"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Input Type *</label>
                    <select
                      value={newVariable.type}
                      onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as Variable["type"] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {variableTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Label</label>
                    <input
                      type="text"
                      value={newVariable.label}
                      onChange={(e) => setNewVariable({ ...newVariable, label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated from variable name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder Text</label>
                    <input
                      type="text"
                      value={newVariable.placeholder}
                      onChange={(e) => setNewVariable({ ...newVariable, placeholder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hint text for users"
                    />
                  </div>
                </div>

                {(newVariable.type === "select" || newVariable.type === "dropdown") && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                    <div className="space-y-2">
                      {newVariable.options?.map((option, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Option ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="bg-transparent text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                        className="bg-transparent"
                        disabled={(newVariable.options?.length || 0) >= 10}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={newVariable.description}
                    onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Help text for this variable"
                  />
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="required"
                    checked={newVariable.required}
                    onChange={(e) => setNewVariable({ ...newVariable, required: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
                    Required field
                  </label>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={editingVariableIndex !== null ? updateVariable : addVariable}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingVariableIndex !== null ? "Update Variable" : "Add Variable"}
                  </Button>
                  {editingVariableIndex !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingVariableIndex(null)
                        setNewVariable({
                          name: "",
                          type: "text",
                          label: "",
                          placeholder: "",
                          options: [],
                          required: true,
                          description: "",
                        })
                      }}
                      className="bg-transparent"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Variables List */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-gray-900">Current Variables</h3>
                {formData.variables.length === 0 ? (
                  <p className="text-gray-500 text-sm">No variables added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {formData.variables.map((variable, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">[{variable.name}]</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {variableTypes.find((t) => t.value === variable.type)?.label}
                            </span>
                            {variable.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Required</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {variable.label || variable.name.replace(/_/g, " ")}
                          </p>
                          {variable.description && <p className="text-xs text-gray-500 mt-1">{variable.description}</p>}
                          {variable.options && variable.options.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">Options: {variable.options.join(", ")}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => editVariable(index)}
                            className="bg-transparent"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVariable(index)}
                            className="bg-transparent text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tag"
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="bg-transparent">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isLocked"
                    checked={formData.isLocked}
                    onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isLocked" className="ml-2 block text-sm text-gray-700">
                    Premium content (requires subscription)
                  </label>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            {formData.type === "image" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thumbnail</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {formData.thumbnail && (
                    <div>
                      <img
                        src={formData.thumbnail || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use clear, descriptive variable names</li>
                <li>• Choose appropriate input types for better UX</li>
                <li>• Provide helpful descriptions and placeholders</li>
                <li>• Test your prompts before publishing</li>
                <li>• Use relevant tags for discoverability</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
