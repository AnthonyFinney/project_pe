import { TrendingUp, TrendingDown, Users, FileText, DollarSign, Crown } from "lucide-react"

const stats = [
  {
    name: "Total Users",
    value: "1,234",
    change: "+12%",
    changeType: "increase",
    icon: Users,
  },
  {
    name: "Total Prompts",
    value: "456",
    change: "+8%",
    changeType: "increase",
    icon: FileText,
  },
  {
    name: "Monthly Revenue",
    value: "$12,450",
    change: "+23%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    name: "Pro Subscribers",
    value: "342",
    change: "+15%",
    changeType: "increase",
    icon: Crown,
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === "increase" ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
