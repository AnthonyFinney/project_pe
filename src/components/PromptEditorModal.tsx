"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Copy, Edit } from "lucide-react"

interface PromptEditorModalProps {
  prompt: {
    id: string
    title: string
    content: string
    category: string
    categoryName?: string
  } | null
  isOpen: boolean
  onClose: () => void
  onSave?: (prompt: any) => void
}

export default function PromptEditorModal({ prompt, isOpen, onClose, onSave }: PromptEditorModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (prompt) {
      setEditedContent(prompt.content)
    }
  }, [prompt])

  if (!isOpen || !prompt) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    if (onSave) {
      onSave({ ...prompt, content: editedContent })
    }
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{prompt.title}</h2>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
              {prompt.categoryName || prompt.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <label htmlFor="prompt-content" className="block text-sm font-medium text-gray-700 mb-2">
            Prompt Content
          </label>
          <textarea
            id="prompt-content"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            disabled={!isEditing}
            className={`w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isEditing ? "bg-gray-50" : "bg-white"
            }`}
            placeholder="Enter your prompt content here..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCopy} className="flex items-center space-x-2 bg-transparent">
              <Copy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy Prompt"}</span>
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>{isEditing ? "Cancel Edit" : "Edit Mode"}</span>
            </Button>
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
