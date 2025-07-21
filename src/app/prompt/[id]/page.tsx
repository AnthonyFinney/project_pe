"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VariableInput from "@/components/VariableInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Edit, Save, ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { prompts } from "@/constants";
import Image from "next/image";

// interface Variable {
//   name: string;
//   type: "text" | "textarea" | "select" | "dropdown" | "number" | "url";
//   label?: string;
//   placeholder?: string;
//   options?: string[];
//   required?: boolean;
//   description?: string;
// }

export default function PromptDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const promptId = params.id as string;
  const fromCategory = searchParams.get("from");

  const [prompt, setPrompt] = useState<(typeof prompts)[0] | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [processedContent, setProcessedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    const foundPrompt = prompts.find((p) => p.id === promptId);
    if (foundPrompt) {
      setPrompt(foundPrompt);
      setProcessedContent(foundPrompt.content);
      setEditedContent(foundPrompt.content);

      // Initialize variables
      const initialVariables: Record<string, string> = {};
      foundPrompt.variables.forEach((variable) => {
        initialVariables[variable.name] = "";
      });
      setVariables(initialVariables);
    }
  }, [promptId]);

  useEffect(() => {
    if (prompt) {
      let content = isEditing ? editedContent : prompt.content;

      // Replace variables in content
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\[${key}\\]`, "g");
        content = content.replace(regex, value || `[${key}]`);
      });

      setProcessedContent(content);
    }
  }, [variables, prompt, isEditing, editedContent]);

  const handleVariableChange = (variable: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(processedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const loadExample = () => {
    if (prompt?.exampleValues) {
      setVariables(prompt.exampleValues);
      setShowExample(true);
    }
  };

  const clearAll = () => {
    const clearedVariables: Record<string, string> = {};
    prompt?.variables.forEach((variable) => {
      clearedVariables[variable.name] = "";
    });
    setVariables(clearedVariables);
    setShowExample(false);
  };

  if (!prompt) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Prompt not found
            </h1>
            <Link href="/prompts">
              <Button>Back to Prompts</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (prompt.isLocked) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Premium Content
            </h1>
            <p className="text-gray-600 mb-6">
              This prompt requires a premium subscription to access.
            </p>
            <Link href="/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe Now
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={
              fromCategory ? `/prompts?category=${fromCategory}` : "/prompts"
            }
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {prompt?.categoryName || "Prompts"}</span>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {prompt.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {prompt.categoryName}
                  </span>
                  {prompt.type === "image" && (
                    <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Image Generation</span>
                    </span>
                  )}
                </div>
              </div>
              {prompt.thumbnail && (
                <div className="ml-6">
                  <div className="relative">
                    <Image
                      src={prompt.thumbnail || "/placeholder.svg"}
                      alt="Prompt example"
                      className="w-64 h-40 object-cover rounded-lg border border-gray-200 shadow-md"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Example Output</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Variables Input Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Customize Your Prompt
                  </h2>
                  {prompt.exampleValues && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadExample}
                        className="text-xs bg-transparent"
                      >
                        Load Example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        className="text-xs bg-transparent"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {prompt.variables.map((variable) => (
                    <VariableInput
                      key={variable.name}
                      variable={variable}
                      value={variables[variable.name]}
                      onChange={(value) =>
                        handleVariableChange(variable.name, value)
                      }
                    />
                  ))}
                </div>

                {prompt.type === "image" && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <ImageIcon className="w-4 h-4" />
                      <span>Image Generation Tips</span>
                    </h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Be specific with style and composition</p>
                      <p>• Include lighting and mood details</p>
                      <p>• Specify quality and resolution</p>
                      <p>• Add camera settings for realism</p>
                    </div>
                  </div>
                )}

                {showExample && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-xs text-green-800 font-medium">
                      ✓ Example values loaded!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      You can modify these values or use them as-is.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Content Section */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Generated Prompt
                  </h2>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center space-x-2 bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{isEditing ? "Cancel" : "Edit"}</span>
                    </Button>
                    {isEditing && (
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </Button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Edit your prompt here..."
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-64">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                      {processedContent}
                    </pre>
                  </div>
                )}

                {/* Variable indicators */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {prompt.variables.map((variable) => (
                      <span
                        key={variable.name}
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          variables[variable.name]
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {variable.name}:{" "}
                        {variables[variable.name] ? "✓" : "pending"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Usage Tips */}
              <div
                className={`mt-6 border rounded-lg p-4 ${
                  prompt.type === "image"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    prompt.type === "image"
                      ? "text-purple-900"
                      : "text-blue-900"
                  }`}
                >
                  {prompt.type === "image"
                    ? "🎨 Image Generation Tips"
                    : "💡 Usage Tips"}
                </h3>
                <ul
                  className={`text-sm space-y-1 ${
                    prompt.type === "image"
                      ? "text-purple-800"
                      : "text-blue-800"
                  }`}
                >
                  <li>
                    • Fill in all variables above to get the most effective
                    prompt
                  </li>
                  <li>• You can edit the prompt directly if needed</li>
                  <li>
                    • Copy the final prompt to use with your favorite AI tool
                  </li>
                  <li>
                    • Use the custom input option for select/dropdown fields
                    when needed
                  </li>
                  {prompt.type === "image" && (
                    <>
                      <li>
                        • Use with DALL-E, Midjourney, Stable Diffusion, or
                        similar tools
                      </li>
                      <li>
                        • Experiment with different styles and compositions
                      </li>
                      <li>
                        • The more specific you are, the better the results
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Example Output Preview for Image Prompts */}
              {prompt.type === "image" && prompt.thumbnail && (
                <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span>Expected Output Style</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Image
                        src={prompt.thumbnail || "/placeholder.svg"}
                        alt="Example output"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        This is an example of what your customized prompt might
                        generate. The actual output will vary based on:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Your specific variable inputs</li>
                        <li>• The AI model you are using</li>
                        <li>• Random generation variations</li>
                        <li>• Additional parameters you set</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
