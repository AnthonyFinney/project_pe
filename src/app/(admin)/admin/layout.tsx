import AdminGate from "./AdminGate";
import Link from "next/link";
import {
    Zap,
    LayoutDashboard,
    FileText,
    Users,
    Menu,
    Bell,
    Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Prompts", href: "/admin/prompts", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Categories", href: "/admin/categories", icon: Tag },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGate>
            <div className="min-h-screen bg-gray-50">
                {/* Desktop sidebar */}
                <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                    <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                        <div className="flex items-center h-16 px-4 border-b border-gray-200">
                            <Link
                                href="/admin"
                                className="flex items-center space-x-2"
                            >
                                <Zap className="w-8 h-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">
                                    Admin
                                </span>
                            </Link>
                        </div>
                        <nav className="mt-4 flex-1">
                            {nav.map(({ name, href, icon: Icon }) => (
                                <Link
                                    key={name}
                                    href={href}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{name}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-gray-200">
                            <Button
                                asChild
                                type="submit"
                                className="w-full text-black gap-2 px-3 py-2 rounded border bg-transparent hover:bg-gray-50"
                            >
                                <Link href="/">Home</Link>
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main column */}
                <div className="lg:pl-64">
                    {/* Top bar with CSS-only mobile menu */}
                    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
                        <div className="flex items-center justify-between h-16 px-4">
                            {/* Mobile: details/summary toggler (no JS) */}
                            <details className="lg:hidden relative">
                                <summary className="list-none p-2 rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer inline-flex">
                                    <Menu className="w-6 h-6" />
                                </summary>
                                <div className="absolute left-0 top-12 w-64 bg-white shadow-lg border rounded-md overflow-hidden">
                                    <div className="flex items-center justify-between h-14 px-4 border-b">
                                        <Link
                                            href="/admin"
                                            className="flex items-center space-x-2"
                                        >
                                            <Zap className="w-7 h-7 text-blue-600" />
                                            <span className="text-lg font-bold text-gray-900">
                                                Admin
                                            </span>
                                        </Link>
                                    </div>
                                    <nav className="py-2">
                                        {nav.map(
                                            ({ name, href, icon: Icon }) => (
                                                <Link
                                                    key={name}
                                                    href={href}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span>{name}</span>
                                                </Link>
                                            )
                                        )}
                                    </nav>
                                    <div className="p-3 border-t">
                                        <Button
                                            asChild
                                            type="submit"
                                            className="w-full text-black inline-flex items-center gap-2 px-3 py-2 rounded border bg-transparent hover:bg-gray-50"
                                        >
                                            <Link href="/">Home</Link>
                                        </Button>
                                    </div>
                                </div>
                            </details>

                            <div className="flex items-center gap-3 ml-auto">
                                <button className="inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 bg-transparent hover:bg-gray-50">
                                    <Bell className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            A
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Admin User
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page content */}
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </AdminGate>
    );
}
