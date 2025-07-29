export type Variable = {
  name: string;
  type: "text" | "textarea" | "select" | "dropdown" | "number" | "url";
  label?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  description?: string;
};

export type PromptType = {
  id: string;
  title: string;
  content: string;
  category: string;
  categoryName?: string;
  isLocked?: boolean;
  variables?: Variable[];
  thumbnail?: string | null;
  description: string;
  useCases?: string[];
  exampleValues?: Record<string, string>;
  status?: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};
