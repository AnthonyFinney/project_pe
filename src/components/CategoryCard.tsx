import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface CategoryCardProps {
  category: {
    id: string
    title: string
    description: string
    icon: LucideIcon
    promptCount: number
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon

  return (
    <Link href={`/prompts?category=${category.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-gray-500">{category.promptCount} prompts</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
      </div>
    </Link>
  )
}
