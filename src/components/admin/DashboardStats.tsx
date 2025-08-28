import { TrendingUp, TrendingDown, Users, FileText, DollarSign, Crown } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";

export default async function DashboardStats() {
  const supabase = await supabaseServer();

  // Total users
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  // Total published prompts (via table or view)
  const { count: promptsCount } = await supabase
    .from("prompts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  // Active subscriptions (pro subscribers)
  const { count: proSubsCount } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  // Monthly revenue (sum current period start in this month)
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
  const { data: revRows } = await supabase
    .from("subscriptions")
    .select("price_amount,current_period_start,status")
    .gte("current_period_start", start)
    .lt("current_period_start", end)
    .eq("status", "active");
  const monthlyCents = (revRows ?? []).reduce((sum, r: any) => sum + (r.price_amount ?? 0), 0);
  const monthlyRevenue = `$${(monthlyCents / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const stats = [
    { name: "Total Users", value: (usersCount ?? 0).toLocaleString(), icon: Users },
    { name: "Total Prompts", value: (promptsCount ?? 0).toLocaleString(), icon: FileText },
    { name: "Monthly Revenue", value: monthlyRevenue, icon: DollarSign },
    { name: "Pro Subscribers", value: (proSubsCount ?? 0).toLocaleString(), icon: Crown },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon as any;
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
          </div>
        );
      })}
    </div>
  );
}
