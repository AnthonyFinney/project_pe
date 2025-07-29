"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import PromptForm, { type PromptFormData } from "@/components/admin/PromptForm";
import { createPrompt } from "@/lib/promptServer";

export default function NewPromptPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    console.log(
        "Supabase Key length:",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
    );

    const handleSave = async (promptData: PromptFormData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Creating prompt:", promptData);
            await createPrompt(promptData);
            router.push("/admin/prompts");
        } catch (error) {
            console.error("Error creating prompt:", error);
            alert("Failed to create prompt. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <PromptForm
                mode="create"
                onSave={handleSave}
                isLoading={isLoading}
                backUrl="/admin/prompts"
            />
        </AdminLayout>
    );
}
