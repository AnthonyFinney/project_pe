"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, User, LogOut, Shield } from "lucide-react";
import { supabaseBrowser, getMyRole } from "@/lib/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<"admin" | "user" | null>(null);
    const [roleLoading, setRoleLoading] = useState(false);

    const router = useRouter();
    const supabase = supabaseBrowser();

    useEffect(() => {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            setLoading(false);
            return;
        }

        // Get initial session
        const getSession = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                setUser(session?.user || null);
            } catch (error) {
                console.error("Error getting session:", error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    useEffect(() => {
        let active = true;
        (async () => {
            if (!user) {
                setRole(null);
                return;
            }
            setRoleLoading(true);
            const r = await getMyRole(); // should query public.profiles for the logged-in user
            if (active) setRole((r as "admin" | "user" | null) ?? null);
            setRoleLoading(false);
        })();
        return () => {
            active = false;
        };
    }, [user?.id]);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const AccountButton = () => {
        if (loading) {
            return (
                <Button variant="outline" size="sm" disabled>
                    Loading...
                </Button>
            );
        }

        if (user) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            {user.user_metadata?.full_name ||
                                user.email?.split("@")[0] ||
                                "Account"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link
                                href="/account"
                                className="flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                My Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/billing"
                                className="flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Billing
                            </Link>
                        </DropdownMenuItem>

                        {/* Admin-only link */}
                        {role === "admin" && !roleLoading && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2"
                                >
                                    <Shield className="w-4 h-4" /> Admin
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="flex items-center gap-2 text-red-600"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                </Button>
            </div>
        );
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Zap className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">
                            PromptCraft
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/categories"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Categories
                        </Link>
                        <Link
                            href="/prompts"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Prompts
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Pricing
                        </Link>
                        <AccountButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/categories"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Categories
                            </Link>
                            <Link
                                href="/prompts"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Prompts
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            {user ? (
                                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                                    <Link
                                        href="/account"
                                        className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    <Link
                                        href="/billing"
                                        className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Billing
                                    </Link>
                                    {/* Admin-only link */}
                                    {role === "admin" && !roleLoading && (
                                        <Link
                                            href="/admin"
                                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-red-600 hover:text-red-700 transition-colors font-medium text-left"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                                    <Link
                                        href="/auth/login"
                                        className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
