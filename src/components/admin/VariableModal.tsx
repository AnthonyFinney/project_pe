"use client";

import { useState } from "react";
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
import { Plus, X } from "lucide-react";
import type { Variable } from "./PromptForm";

interface VariableModalProps {
  variable: Variable | null;
  onSave: (variable: Variable) => void;
  onClose: () => void;
}

export default function VariableModal({
  variable,
  onSave,
  onClose,
}: VariableModalProps) {
  const [formData, setFormData] = useState<Variable>(
    variable || {
      id: "",
      name: "",
      label: "",
      type: "text",
      placeholder: "",
      description: "",
      required: false,
      options: [],
    }
  );
  const [newOption, setNewOption] = useState("");

  const handleSave = () => {
    if (!formData.label.trim()) {
      alert("Please enter a variable label");
      return;
    }

    // Auto-generate name from label if not provided
    if (!formData.name) {
      const generatedName = formData.label
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_");
      setFormData((prev) => ({ ...prev, name: generatedName }));
    }

    onSave(formData);
  };

  const addOption = () => {
    if (newOption.trim() && !formData.options?.includes(newOption.trim())) {
      setFormData((prev) => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()],
      }));
      setNewOption("");
    }
  };

  const removeOption = (optionToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      options:
        prev.options?.filter((option) => option !== optionToRemove) || [],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {variable ? "Edit Variable" : "Add Variable"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => {
                  const label = e.target.value;
                  const name = label
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]/g, "")
                    .replace(/\s+/g, "_");
                  setFormData((prev) => ({ ...prev, label, name }));
                }}
                placeholder="Variable Label"
              />
            </div>
            <div>
              <Label htmlFor="name">Variable Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="variable_name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Variable["type"]) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="url">URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={formData.placeholder || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  placeholder: e.target.value,
                }))
              }
              placeholder="Enter placeholder text..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe this variable..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required Field</Label>
            <Switch
              id="required"
              checked={formData.required}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, required: checked }))
              }
            />
          </div>

          {(formData.type === "select" || formData.type === "dropdown") && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2 mt-2">
                {formData.options?.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{option}</span>
                    <button
                      onClick={() => removeOption(option)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!formData.options || formData.options.length === 0) && (
                  <p className="text-gray-500 text-sm">No options added yet</p>
                )}
              </div>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add option..."
                  onKeyPress={(e) => e.key === "Enter" && addOption()}
                  className="flex-1"
                />
                <Button
                  onClick={addOption}
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {variable ? "Update Variable" : "Add Variable"}
          </Button>
        </div>
      </div>
    </div>
  );
}
