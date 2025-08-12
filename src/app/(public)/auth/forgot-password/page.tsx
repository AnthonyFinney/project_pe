"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, Zap } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const supabase = supabaseBrowser();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">
                                Check your email
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <Mail className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-gray-600">
                                We've sent a password reset link to{" "}
                                <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500">
                                Click the link in the email to reset your
                                password. If you don't see it, check your spam
                                folder.
                            </p>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setSuccess(false)}
                                    className="w-full bg-transparent"
                                >
                                    Try another email
                                </Button>
                                <Link href="/auth/login">
                                    <Button
                                        variant="outline"
                                        className="w-full bg-transparent"
                                    >
                                        Back to sign in
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center space-x-2 mb-6"
                    >
                        <Zap className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">
                            PromptCraft
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Reset password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form
                            onSubmit={handleResetPassword}
                            className="space-y-4"
                        >
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send reset link"}
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
