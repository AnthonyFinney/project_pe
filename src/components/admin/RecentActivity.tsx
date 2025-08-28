import { Clock, User, FileText, DollarSign } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";

type Activity = {
  id: string;
  type: "user_signup" | "prompt_published" | "subscription";
  message: string;
  time: string; // ISO
  icon: any;
};

function timeAgo(iso: string) {
  const now = new Date().getTime();
  const ts = new Date(iso).getTime();
  const diff = Math.max(0, now - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const d = Math.floor(hr / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export default async function RecentActivity() {
  const supabase = await supabaseServer();

  const [usersRes, promptsRes, subsRes] = await Promise.all([
    supabase.from("profiles").select("id, email, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("prompts").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("subscriptions").select("id, plan_name, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const activities: Activity[] = [];

  (usersRes.data ?? []).forEach((u: any) =>
    activities.push({
      id: `user:${u.id}`,
      type: "user_signup",
      message: `New user ${u.email || u.id} signed up`,
      time: u.created_at,
      icon: User,
    })
  );

  (promptsRes.data ?? [])
    .filter((p: any) => p.status === "published")
    .forEach((p: any) =>
      activities.push({
        id: `prompt:${p.id}`,
        type: "prompt_published",
        message: `Prompt '${p.title}' was published`,
        time: p.updated_at || new Date().toISOString(),
        icon: FileText,
      })
    );

  (subsRes.data ?? []).forEach((s: any) =>
    activities.push({
      id: `sub:${s.id}`,
      type: "subscription",
      message: `${s.status === "active" ? "New" : "Updated"} ${s.plan_name || "subscription"}`,
      time: s.created_at,
      icon: DollarSign,
    })
  );

  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  const top = activities.slice(0, 8);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {top.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">{timeAgo(activity.time)}</p>
                </div>
              </div>
            </div>
          );
        })}
        {top.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
