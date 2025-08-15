// app/(admin)/admin/users/AdminUsers.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Mail, Ban, Shield, Crown } from "lucide-react";
import {
    setUserRole,
    suspendUser,
} from "../../app/(admin)/admin/actions/users";

type UIUser = {
    id: string;
    name: string;
    email: string;
    plan: "Free" | "Pro" | "Enterprise" | string;
    status: "active" | "suspended" | "inactive" | string;
    totalSpent: number;
    lastActive: string;
    role?: string;
    avatar_url?: string | null;
};

export default function AdminUsers({
    initialUsers,
}: {
    initialUsers: UIUser[];
}) {
    const [users, setUsers] = useState<UIUser[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isPending, startTransition] = useTransition();

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = user.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesPlan =
                selectedPlan === "all" || user.plan === selectedPlan;
            const matchesStatus =
                selectedStatus === "all" || user.status === selectedStatus;
            return matchesSearch && matchesPlan && matchesStatus;
        });
    }, [users, searchTerm, selectedPlan, selectedStatus]);

    const getPlanBadge = (plan: string) => {
        const styles = {
            Free: "bg-gray-100 text-gray-800",
            Pro: "bg-blue-100 text-blue-800",
            Enterprise: "bg-purple-100 text-purple-800",
        };
        return styles[plan as keyof typeof styles] || styles.Free;
    };

    const getRoleBadge = (role?: string) => {
        const styles = {
            admin: "bg-yellow-100 text-yellow-800",
            user: "bg-gray-100 text-gray-800",
        };
        return styles[role as keyof typeof styles] || styles.user;
    };

    // Server action wrappers (optimistic UI)
    const promote = (id: string) =>
        startTransition(async () => {
            await setUserRole(id, "admin");
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role: "admin" } : u))
            );
        });

    const demote = (id: string) =>
        startTransition(async () => {
            await setUserRole(id, "user");
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role: "user" } : u))
            );
        });

    const suspend = (id: string) =>
        startTransition(async () => {
            await suspendUser(id);
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id ? { ...u, status: "inactive" } : u
                )
            );
        });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600">Manage your platform users</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                    <a href="/api/admin/users/export">
                        <Mail className="w-4 h-4 mr-2" />
                        Export CSV
                    </a>
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Plans</option>
                        <option value="Free">Free</option>
                        <option value="Pro">Pro</option>
                        <option value="Enterprise">Enterprise</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <Button variant="outline" className="bg-transparent">
                        <Filter className="w-4 h-4 mr-2" />
                        Export (UI)
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Email
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Plan
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Role
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Revenue
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Last Active
                                </th>
                                {/* Actions */}
                                {/* <th className="text-left py-3 px-4 font-medium text-gray-900">
                                    Actions
                                </th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(
                                                user.plan
                                            )}`}
                                        >
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                                                user.role
                                            )}`}
                                        >
                                            {user.role || "user"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        ${user.totalSpent.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {user.lastActive}
                                    </td>
                                    {/* Actions */}
                                    {/* <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                title="Make admin"
                                                variant="outline"
                                                size="sm"
                                                className="bg-transparent"
                                                disabled={isPending}
                                                onClick={() => promote(user.id)}
                                            >
                                                <Shield className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                title="Make user"
                                                variant="outline"
                                                size="sm"
                                                className="bg-transparent"
                                                disabled={isPending}
                                                onClick={() => demote(user.id)}
                                            >
                                                <Crown className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                title="Suspend"
                                                variant="outline"
                                                size="sm"
                                                className="bg-transparent text-red-600"
                                                disabled={isPending}
                                                onClick={() => suspend(user.id)}
                                            >
                                                <Ban className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-6 text-center text-gray-500"
                                    >
                                        No users match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-gray-900">
                        {users.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-green-600">
                        {users.filter((u) => u.status === "active").length}
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-blue-600">
                        {users.filter((u) => u.plan === "Pro").length}
                    </div>
                    <div className="text-sm text-gray-600">Pro Subscribers</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-purple-600">
                        $
                        {users
                            .reduce((acc, u) => acc + (u.totalSpent || 0), 0)
                            .toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                        Total Revenue (all-time)
                    </div>
                </div>
            </div>
        </div>
    );
}
