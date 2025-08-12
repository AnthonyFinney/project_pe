"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { prompts } from "@/constants";

// Category mapping for display names
const categoryNames: Record<string, string> = {
  writing: "Writing",
  image: "Image Generation",
  ecommerce: "E-commerce",
  coding: "Coding",
  business: "Business",
  lifestyle: "Lifestyle",
  productivity: "Productivity",
  "social-media": "Social Media",
};

export default function PromptsPage() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrompts, setFilteredPrompts] = useState<typeof prompts>([]);

  // Filter prompts by category and search query
  useEffect(() => {
    let result = selectedCategory
      ? prompts.filter((prompt) => prompt.category === selectedCategory)
      : prompts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(query) ||
          prompt.content.toLowerCase().includes(query) ||
          (prompt.description &&
            prompt.description.toLowerCase().includes(query)) ||
          (prompt.useCases &&
            prompt.useCases.some((useCase) =>
              useCase.toLowerCase().includes(query)
            ))
      );
    }

    setFilteredPrompts(result);
  }, [selectedCategory, searchQuery]);

  const freePrompts = filteredPrompts.filter((p) => !p.isLocked);
  const lockedPrompts = filteredPrompts.filter((p) => p.isLocked);

  const categoryDisplayName = selectedCategory
    ? categoryNames[selectedCategory]
    : null;

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory
              ? `${categoryDisplayName} Prompts`
              : "AI Prompts Library"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {selectedCategory
              ? `Discover ${categoryDisplayName?.toLowerCase()} prompts to enhance your AI interactions`
              : "Ready-to-use prompts to enhance your AI interactions and boost productivity"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={`Search ${
                selectedCategory ? categoryDisplayName : "all"
              } prompts...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {filteredPrompts.length} result
              {filteredPrompts.length !== 1 ? "s" : ""} found for {searchQuery}
            </p>
          )}
        </div>

        {/* Show message if no prompts in category or matching search */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No prompts found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No prompts match "${searchQuery}" in ${
                    selectedCategory ? categoryDisplayName : "any category"
                  }`
                : `No prompts available in ${categoryDisplayName}`}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={clearSearch}>
                Clear Search
              </Button>
            ) : (
              <Link href="/categories">
                <Button variant="outline">Browse Other Categories</Button>
              </Link>
            )}
          </div>
        )}

        {/* Free Prompts */}
        {freePrompts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {selectedCategory ? "Free Prompts" : "Free Prompts"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {freePrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        )}

        {/* Locked Prompts */}
        {lockedPrompts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Premium Prompts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 space-y-2">
              {lockedPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} isLocked={true} />
              ))}
            </div>

            {/* Subscription CTA */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-100">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Unlock All Prompts
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get access to our complete library of premium prompts and
                advanced features
              </p>
              <Link href="/pricing">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Subscribe Now - $9/month
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
