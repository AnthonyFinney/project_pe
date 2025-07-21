"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, ImageIcon, Crown } from "lucide-react"
import Link from "next/link"

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    content: string
    category: string
    categoryName?: string
    isLocked?: boolean
    thumbnail?: string | null
    description?: string
    useCases?: string[]
  }
  isLocked?: boolean
}

export default function PromptCard({ prompt, isLocked = false }: PromptCardProps) {
  // Extract the first sentence or up to 150 characters for the description if not provided
  const promptDescription = prompt.description || prompt.content.split(".")[0].substring(0, 150) + "..."

  // Default use cases if none provided
  const useCases = prompt.useCases || ["Content creation", "Brainstorming ideas", "Professional communication"]

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 relative hover:shadow-lg hover:border-blue-300 transition-all duration-200 group ${isLocked ? "opacity-75" : ""}`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center p-6">
            <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{prompt.title}</h3>
            <p className="text-sm text-gray-600 font-medium mb-4">Premium Content</p>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {prompt.title}
            </h3>
            {!isLocked && (
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </div>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {prompt.categoryName || prompt.category}
          </span>
        </div>

        {prompt.thumbnail && (
          <div className="ml-4">
            <div className="relative">
              <img
                src={prompt.thumbnail || "/placeholder.svg"}
                alt="Prompt preview"
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded">
                <ImageIcon className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}
      </div>

      {!isLocked && (
        <>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{promptDescription}</p>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Best used for:</h4>
            <div className="flex flex-wrap gap-2">
              {useCases.map((useCase, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {useCase}
                </span>
              ))}
            </div>
          </div>

          <Link href={`/prompt/${prompt.id}?from=${prompt.category}`} className="w-full">
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}
