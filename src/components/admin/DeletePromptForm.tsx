// src/components/admin/DeletePromptForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type DeletePromptFormProps = {
    id: string;
    // server action signature
    action: (formData: FormData) => Promise<void>;
    confirmMessage?: string;
};

export default function DeletePromptForm({
    id,
    action,
    confirmMessage = "Are you sure you want to delete this prompt? This action cannot be undone.",
}: DeletePromptFormProps) {
    return (
        <form
            action={action}
            onSubmit={(e) => {
                if (!confirm(confirmMessage)) e.preventDefault();
            }}
        >
            <input type="hidden" name="id" value={id} />
            <Button
                variant="outline"
                size="sm"
                type="submit"
                className="bg-transparent text-red-600 hover:text-red-700"
                aria-label="Delete prompt"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </form>
    );
}
