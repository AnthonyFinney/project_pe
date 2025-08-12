"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import PromptForm, { type PromptFormData } from "@/components/admin/PromptForm";

// Mock data for the prompt being edited
const mockPrompt: PromptFormData = {
    title: "Creative Blog Post Writer",
    description:
        "Generate engaging and creative blog posts on any topic with customizable tone and style.",
    content:
        "Write a {tone} blog post about {topic} that is approximately {word_count} words long. The target audience is {audience}. Include {key_points} key points and make sure to {call_to_action}.",
    category: "writing",
    isLocked: false,
    status: "published",
    variables: [
        {
            id: "1",
            name: "tone",
            label: "Writing Tone",
            type: "select",
            placeholder: "Select tone...",
            description: "Choose the tone for your blog post",
            required: true,
            options: [
                "Professional",
                "Casual",
                "Friendly",
                "Authoritative",
                "Conversational",
            ],
        },
        {
            id: "2",
            name: "topic",
            label: "Blog Topic",
            type: "text",
            placeholder: "Enter your blog topic...",
            description: "The main topic or subject of your blog post",
            required: true,
        },
        {
            id: "3",
            name: "word_count",
            label: "Word Count",
            type: "number",
            placeholder: "500",
            description: "Approximate number of words for the blog post",
            required: false,
        },
        {
            id: "4",
            name: "audience",
            label: "Target Audience",
            type: "text",
            placeholder: "e.g., small business owners, students, professionals",
            description: "Who is the intended audience for this blog post?",
            required: true,
        },
    ],
    useCases: [
        "Content marketing campaigns",
        "Personal blogging",
        "Business communications",
        "Educational content",
    ],
};

export default function EditPrompt({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (promptData: PromptFormData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Updating prompt:", promptData);
            router.push("/admin/prompts");
        } catch (error) {
            console.error("Error updating prompt:", error);
            alert("Failed to update prompt. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <PromptForm
                mode="edit"
                initialData={mockPrompt}
                onSave={handleSave}
                isLoading={isLoading}
                backUrl="/admin/prompts"
            />
        </AdminLayout>
    );
}
