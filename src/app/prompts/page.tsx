"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";

const prompts = [
  {
    id: "1",
    title: "Creative Blog Post Writer",
    content:
      "Write a compelling blog post about [TOPIC] that engages readers and provides valuable insights. Include an attention-grabbing headline, introduction, main points, and conclusion.",
    category: "writing",
    categoryName: "Writing",
    isLocked: false,
    thumbnail: null,
    description:
      "Generate engaging blog posts with structured content that captivates readers and delivers value.",
    useCases: ["Blog content", "Article writing", "Content marketing"],
  },
  {
    id: "2",
    title: "Product Description Generator",
    content:
      "Create a persuasive product description for [PRODUCT] that highlights key features, benefits, and appeals to the target audience. Focus on emotional triggers and clear value propositions.",
    category: "ecommerce",
    categoryName: "E-commerce",
    isLocked: false,
    thumbnail: null,
    description:
      "Craft compelling product descriptions that highlight benefits and drive conversions.",
    useCases: ["Product listings", "E-commerce sites", "Marketing materials"],
  },
  {
    id: "3",
    title: "Social Media Caption Creator",
    content:
      "Generate engaging social media captions for [PLATFORM] about [TOPIC]. Include relevant hashtags, call-to-action, and maintain brand voice consistency.",
    category: "social-media",
    categoryName: "Social Media",
    isLocked: false,
    thumbnail: null,
    description:
      "Create platform-specific captions that engage followers and drive interaction.",
    useCases: ["Instagram posts", "Twitter content", "LinkedIn updates"],
  },
  {
    id: "4",
    title: "Code Review Assistant",
    content:
      "Review the following code and provide constructive feedback on performance, readability, and best practices: [CODE]. Suggest improvements and explain reasoning.",
    category: "coding",
    categoryName: "Coding",
    isLocked: false,
    thumbnail: null,
    description:
      "Get expert code reviews with actionable feedback to improve your programming.",
    useCases: [
      "Code improvement",
      "Learning programming",
      "Technical documentation",
    ],
  },
  {
    id: "5",
    title: "Email Marketing Template",
    content:
      "Create a professional email marketing campaign for [PRODUCT/SERVICE] that includes subject line, personalized greeting, value proposition, and clear CTA.",
    category: "business",
    categoryName: "Business",
    isLocked: false,
    thumbnail: null,
    description:
      "Design effective email campaigns that engage subscribers and drive conversions.",
    useCases: ["Newsletter creation", "Sales emails", "Customer outreach"],
  },
  {
    id: "6",
    title: "Advanced SEO Content Strategy",
    content:
      "Develop a comprehensive SEO content strategy for [KEYWORD] including content pillars, topic clusters, and optimization techniques...",
    category: "writing",
    categoryName: "Writing",
    isLocked: true,
    thumbnail: null,
    description:
      "Build a complete SEO content strategy to improve rankings and organic traffic.",
  },
  {
    id: "7",
    title: "Fantasy Landscape Generator",
    content:
      "Create a breathtaking fantasy landscape featuring floating islands with ethereal lighting and mystical atmosphere...",
    category: "image",
    categoryName: "Image Generation",
    isLocked: false,
    thumbnail: "/images/fantasy-landscape-example.png",
    description:
      "Generate stunning fantasy landscapes for creative projects and visual inspiration.",
    useCases: ["Game design", "Book covers", "Creative inspiration"],
  },
  {
    id: "8",
    title: "Portrait Photography Prompt",
    content:
      "Generate a stunning portrait with professional lighting setup and cinematic mood...",
    category: "image",
    categoryName: "Image Generation",
    isLocked: true,
    thumbnail: "/placeholder.svg?height=200&width=300",
    description:
      "Create professional-quality portrait images with cinematic lighting and mood.",
  },
  {
    id: "9",
    title: "Business Plan Generator",
    content:
      "Create a comprehensive business plan for [BUSINESS TYPE] including executive summary, market analysis, financial projections, and growth strategy...",
    category: "business",
    categoryName: "Business",
    isLocked: true,
    thumbnail: null,
    description:
      "Generate complete business plans ready for investors and strategic planning.",
  },
  {
    id: "10",
    title: "Lifestyle Blog Content",
    content:
      "Write engaging lifestyle content about [TOPIC] that resonates with your audience and provides practical tips and inspiration...",
    category: "lifestyle",
    categoryName: "Lifestyle",
    isLocked: true,
    thumbnail: null,
    description:
      "Create engaging lifestyle content that connects with readers and provides value.",
  },
  {
    id: "11",
    title: "Productivity System Setup",
    content:
      "Design a personalized productivity system for [PROFESSION/ROLE] that includes task management, goal setting, and time blocking strategies...",
    category: "productivity",
    categoryName: "Productivity",
    isLocked: false,
    thumbnail: null,
    description:
      "Build custom productivity systems tailored to specific roles and work styles.",
    useCases: [
      "Personal organization",
      "Team productivity",
      "Work-life balance",
    ],
  },
  {
    id: "12",
    title: "E-commerce Product Launch",
    content:
      "Plan and execute a successful product launch for [PRODUCT] including pre-launch marketing, launch day activities, and post-launch follow-up...",
    category: "ecommerce",
    categoryName: "E-commerce",
    isLocked: true,
    thumbnail: null,
    description:
      "Create comprehensive product launch strategies for maximum market impact.",
  },
];

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
        {/* Back to Categories Link */}
        {selectedCategory && (
          <div className="mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Categories</span>
            </Link>
          </div>
        )}

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
