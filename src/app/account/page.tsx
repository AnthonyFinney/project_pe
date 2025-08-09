"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Calendar,
    Crown,
    Settings,
    CreditCard,
    Heart,
    FileText,
    BarChart3,
    Shield,
    Bell,
    Eye,
    EyeOff,
} from "lucide-react";

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (!session) {
                    router.push("/auth/login");
                    return;
                }
                setUser(session.user);
            } catch (error) {
                console.error("Error getting user:", error);
                router.push("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [router, supabase.auth]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Mock data for demo purposes
    const accountStats = {
        promptsCreated: 12,
        favoritePrompts: 8,
        totalUsage: 156,
        joinDate: user.created_at,
    };

    const subscriptionStatus = {
        plan: "Free",
        status: "Active",
        nextBilling: null,
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            My Account
                        </h1>
                        <p className="text-gray-600">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Profile Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Profile Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {user.user_metadata
                                                    ?.full_name || "User"}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                {showEmail
                                                    ? user.email
                                                    : "••••••••@••••••.com"}
                                                <button
                                                    onClick={() =>
                                                        setShowEmail(!showEmail)
                                                    }
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    {showEmail ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Member Since
                                            </label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {formatDate(
                                                        accountStats.joinDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Account Status
                                            </label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Shield className="w-4 h-4 text-green-500" />
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-green-100 text-green-800"
                                                >
                                                    Verified
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Account Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-gray-900">
                                                {accountStats.promptsCreated}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Prompts Created
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-red-50 rounded-lg">
                                            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-gray-900">
                                                {accountStats.favoritePrompts}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Favorites
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-gray-900">
                                                {accountStats.totalUsage}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total Usage
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                            <div className="text-2xl font-bold text-gray-900">
                                                0
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Premium Uses
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Subscription Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Crown className="w-5 h-5" />
                                        Subscription
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <Badge
                                            variant="secondary"
                                            className="mb-2"
                                        >
                                            {subscriptionStatus.plan} Plan
                                        </Badge>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {subscriptionStatus.plan === "Free"
                                                ? "Upgrade to unlock premium features"
                                                : `Next billing: ${subscriptionStatus.nextBilling}`}
                                        </p>
                                        <Button className="w-full" asChild>
                                            <a href="/pricing">
                                                {subscriptionStatus.plan ===
                                                "Free"
                                                    ? "Upgrade Plan"
                                                    : "Manage Billing"}
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a href="/billing">
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Billing & Payments
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <Bell className="w-4 h-4 mr-2" />
                                        Notifications
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <Shield className="w-4 h-4 mr-2" />
                                        Privacy Settings
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Account Settings
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-600">
                                                Created new prompt
                                            </span>
                                            <span className="text-gray-400 ml-auto">
                                                2h ago
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-gray-600">
                                                Favorited prompt
                                            </span>
                                            <span className="text-gray-400 ml-auto">
                                                1d ago
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span className="text-gray-600">
                                                Account created
                                            </span>
                                            <span className="text-gray-400 ml-auto">
                                                {formatDate(
                                                    accountStats.joinDate
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
