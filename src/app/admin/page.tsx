import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import RecentActivity from "@/components/admin/RecentActivity";
import QuickActions from "@/components/admin/QuickActions";

// In a real app, you'd check authentication here
async function checkAdminAuth() {
  // Simulate auth check
  return true; // For demo purposes
}

export default async function AdminDashboard() {
  const isAdmin = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here what is happening with PromptCraft.
          </p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
