"use client";

import { Badge } from "@/components/ui/badge";
import { X, AlertCircle } from "lucide-react";
import VariableInput from "@/components/VariableInput";
import type { PromptFormData } from "./PromptForm";

interface PreviewModalProps {
  prompt: PromptFormData;
  previewValues: Record<string, string>;
  onPreviewValuesChange: (values: Record<string, string>) => void;
  generatedPrompt: string;
  onClose: () => void;
}

export default function PreviewModal({
  prompt,
  previewValues,
  onPreviewValuesChange,
  generatedPrompt,
  onClose,
}: PreviewModalProps) {
  const handleVariableChange = (variableName: string, value: string) => {
    onPreviewValuesChange({
      ...previewValues,
      [variableName]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">
              {prompt.title || "New Prompt"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {prompt.description || "No description provided"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(90vh-120px)]">
          {/* Variables Panel */}
          <div className="p-6 border-r border-gray-200 overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Configure Variables</h3>
            {prompt.variables.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No variables to configure.</p>
                <p className="text-sm">
                  Add variables to make your prompt customizable.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prompt.variables.map((variable) => (
                  <VariableInput
                    key={variable.id}
                    variable={variable}
                    value={previewValues[variable.name] || ""}
                    onChange={(value) =>
                      handleVariableChange(variable.name, value)
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Generated Prompt Panel */}
          <div className="p-6 overflow-y-auto bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Generated Prompt</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[200px]">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {generatedPrompt || "Enter prompt content to see preview..."}
              </pre>
            </div>

            {/* Prompt Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <Badge variant="secondary">
                  {prompt.category || "Not selected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <Badge
                  variant={
                    prompt.status === "published" ? "default" : "secondary"
                  }
                >
                  {prompt.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Premium:</span>
                <Badge variant={prompt.isPremium ? "destructive" : "secondary"}>
                  {prompt.isPremium ? "Premium" : "Free"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
