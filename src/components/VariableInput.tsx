"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Check, X } from "lucide-react";
import { Variable } from "@/types";

interface VariableInputProps {
  variable: Variable;
  value: string;
  onChange: (value: string) => void;
}

export default function VariableInput({
  variable,
  value,
  onChange,
}: VariableInputProps) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleCustomToggle = () => {
    if (isCustomMode) {
      // Switching back to preset options
      setIsCustomMode(false);
      setCustomValue("");
      onChange("");
    } else {
      // Switching to custom input
      setIsCustomMode(true);
      setCustomValue(value);
    }
  };

  const handleCustomSave = () => {
    onChange(customValue);
    setIsCustomMode(false);
  };

  const handleCustomCancel = () => {
    setCustomValue("");
    setIsCustomMode(false);
  };

  const renderInput = () => {
    // If in custom mode for select/dropdown, show text input
    if (
      isCustomMode &&
      (variable.type === "select" || variable.type === "dropdown")
    ) {
      return (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder={
                variable.placeholder ||
                `Enter custom ${variable.label?.toLowerCase()}`
              }
            />
            <Button
              type="button"
              size="sm"
              onClick={handleCustomSave}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCustomCancel}
              className="bg-transparent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Enter your custom value and click the check mark to save
          </p>
        </div>
      );
    }

    switch (variable.type) {
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder={
              variable.placeholder || `Enter ${variable.label?.toLowerCase()}`
            }
            rows={3}
            required={variable.required}
          />
        );

      case "select":
        return (
          <div className="space-y-2">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required={variable.required}
            >
              <option value="">Select an option</option>
              {variable.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {variable.options && variable.options.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCustomToggle}
                className="bg-transparent text-xs"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Use custom value
              </Button>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div className="space-y-2">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required={variable.required}
            >
              <option value="">Choose from dropdown</option>
              {variable.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {variable.options && variable.options.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCustomToggle}
                className="bg-transparent text-xs"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Enter custom option
              </Button>
            )}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder={
              variable.placeholder || `Enter ${variable.label?.toLowerCase()}`
            }
            required={variable.required}
          />
        );

      case "url":
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder={variable.placeholder || "https://example.com"}
            required={variable.required}
          />
        );

      default: // text
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder={
              variable.placeholder || `Enter ${variable.label?.toLowerCase()}`
            }
            required={variable.required}
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {variable.label ||
          variable.name
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        {variable.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {variable.description && (
        <p className="text-xs text-gray-500 mt-1">{variable.description}</p>
      )}
    </div>
  );
}
