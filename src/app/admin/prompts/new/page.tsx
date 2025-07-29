"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import PromptForm, { type PromptFormData } from "@/components/admin/PromptForm";

export default function NewPromptPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (promptData: PromptFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating prompt:", promptData);
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
