import { Clock, User, FileText, DollarSign } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "user_signup",
    message: "New user John Doe signed up",
    time: "2 minutes ago",
    icon: User,
  },
  {
    id: 2,
    type: "prompt_created",
    message: "New prompt 'Creative Writing Assistant' was published",
    time: "15 minutes ago",
    icon: FileText,
  },
  {
    id: 3,
    type: "subscription",
    message: "Jane Smith upgraded to Pro plan",
    time: "1 hour ago",
    icon: DollarSign,
  },
  {
    id: 4,
    type: "prompt_used",
    message: "Blog Post Writer prompt used 50 times today",
    time: "2 hours ago",
    icon: FileText,
  },
]

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
