import { Button } from "@/components/ui/button"
import { Plus, Mail, Settings } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Link href="/admin/prompts/new" className="block">
          <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Prompt
          </Button>
        </Link>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Mail className="w-4 h-4 mr-2" />
          Send Newsletter
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Settings className="w-4 h-4 mr-2" />
          Platform Settings
        </Button>
      </div>
    </div>
  )
}
