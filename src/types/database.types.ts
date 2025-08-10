export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Variable = {
    name: string;
    type: "text" | "textarea" | "select" | "dropdown" | "number" | "url";
    label?: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    description?: string;
};

export type PromptStatus = "draft" | "published" | "archived";
export type PromptTypeEnum = "text" | "image";

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    icon: string | null;
                    prompt_count: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    icon?: string | null;
                    prompt_count?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    icon?: string | null;
                    prompt_count?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            prompts: {
                Row: {
                    id: string;
                    title: string;
                    content: string;
                    variables: Json; // array of Variable-like objects
                    description: string;
                    thumbnail_url: string | null;
                    use_cases: string[];
                    example_values: Json;
                    tags: string[];
                    is_locked: boolean;
                    status: PromptStatus;
                    type: PromptTypeEnum;
                    category_id: string | null;
                    created_by: string | null;
                    created_at: string;
                    updated_at: string | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    content: string;
                    variables?: Json;
                    description: string;
                    thumbnail_url?: string | null;
                    use_cases?: string[];
                    example_values?: Json;
                    tags?: string[];
                    is_locked?: boolean;
                    status?: PromptStatus;
                    type?: PromptTypeEnum;
                    category_id?: string | null;
                    created_by?: string | null;
                    created_at?: string;
                    updated_at?: string | null;
                };
                Update: {
                    id?: string;
                    title?: string;
                    content?: string;
                    variables?: Json;
                    description?: string;
                    thumbnail_url?: string | null;
                    use_cases?: string[];
                    example_values?: Json;
                    tags?: string[];
                    is_locked?: boolean;
                    status?: PromptStatus;
                    type?: PromptTypeEnum;
                    category_id?: string | null;
                    created_by?: string | null;
                    created_at?: string;
                    updated_at?: string | null;
                };
            };
            subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    stripe_customer_id: string | null;
                    stripe_subscription_id: string | null;
                    status:
                        | "active"
                        | "canceled"
                        | "past_due"
                        | "unpaid"
                        | "trialing";
                    plan_name: string;
                    price_amount: number;
                    currency: string;
                    interval_type: "month" | "year";
                    current_period_start: string | null;
                    current_period_end: string | null;
                    cancel_at_period_end: boolean;
                    canceled_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    stripe_customer_id?: string | null;
                    stripe_subscription_id?: string | null;
                    status:
                        | "active"
                        | "canceled"
                        | "past_due"
                        | "unpaid"
                        | "trialing";
                    plan_name: string;
                    price_amount: number;
                    currency?: string;
                    interval_type: "month" | "year";
                    current_period_start?: string | null;
                    current_period_end?: string | null;
                    cancel_at_period_end?: boolean;
                    canceled_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    stripe_customer_id?: string | null;
                    stripe_subscription_id?: string | null;
                    status?:
                        | "active"
                        | "canceled"
                        | "past_due"
                        | "unpaid"
                        | "trialing";
                    plan_name?: string;
                    price_amount?: number;
                    currency?: string;
                    interval_type?: "month" | "year";
                    current_period_start?: string | null;
                    current_period_end?: string | null;
                    cancel_at_period_end?: boolean;
                    canceled_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            favorites: {
                Row: {
                    id: string;
                    user_id: string;
                    prompt_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    prompt_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    prompt_id?: string;
                    created_at?: string;
                };
            };
            collections: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string | null;
                    is_public: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string | null;
                    is_public?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}
