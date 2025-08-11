export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    // Allows to automatically instanciate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.4";
    };
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string;
                    description: string | null;
                    icon: string | null;
                    id: string;
                    name: string;
                    prompt_count: number;
                    slug: string;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    icon?: string | null;
                    id?: string;
                    name: string;
                    prompt_count?: number;
                    slug: string;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    icon?: string | null;
                    id?: string;
                    name?: string;
                    prompt_count?: number;
                    slug?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            collections: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: string;
                    is_public: boolean;
                    name: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    is_public?: boolean;
                    name: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    is_public?: boolean;
                    name?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            favorites: {
                Row: {
                    created_at: string;
                    id: string;
                    prompt_id: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    prompt_id: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    prompt_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "favorites_prompt_id_fkey";
                        columns: ["prompt_id"];
                        isOneToOne: false;
                        referencedRelation: "prompts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "favorites_prompt_id_fkey";
                        columns: ["prompt_id"];
                        isOneToOne: false;
                        referencedRelation: "prompts_public";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profiles: {
                Row: {
                    avatar_url: string | null;
                    created_at: string;
                    display_name: string | null;
                    email: string;
                    full_name: string | null;
                    id: string;
                    role: string | null;
                    updated_at: string;
                };
                Insert: {
                    avatar_url?: string | null;
                    created_at?: string;
                    display_name?: string | null;
                    email?: string;
                    full_name?: string | null;
                    id: string;
                    role?: string | null;
                    updated_at?: string;
                };
                Update: {
                    avatar_url?: string | null;
                    created_at?: string;
                    display_name?: string | null;
                    email?: string;
                    full_name?: string | null;
                    id?: string;
                    role?: string | null;
                    updated_at?: string;
                };
                Relationships: [];
            };
            prompts: {
                Row: {
                    category_id: string | null;
                    content: string;
                    created_at: string;
                    created_by: string | null;
                    description: string | null;
                    example_values: Json;
                    id: string;
                    is_locked: boolean;
                    status: Database["public"]["Enums"]["prompt_status_enum"];
                    tags: string[];
                    thumbnail_url: string | null;
                    title: string;
                    type: Database["public"]["Enums"]["prompt_type_enum"];
                    updated_at: string;
                    use_cases: string[];
                    variables: Json;
                };
                Insert: {
                    category_id?: string | null;
                    content: string;
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    example_values?: Json;
                    id?: string;
                    is_locked?: boolean;
                    status?: Database["public"]["Enums"]["prompt_status_enum"];
                    tags?: string[];
                    thumbnail_url?: string | null;
                    title: string;
                    type?: Database["public"]["Enums"]["prompt_type_enum"];
                    updated_at?: string;
                    use_cases?: string[];
                    variables?: Json;
                };
                Update: {
                    category_id?: string | null;
                    content?: string;
                    created_at?: string;
                    created_by?: string | null;
                    description?: string | null;
                    example_values?: Json;
                    id?: string;
                    is_locked?: boolean;
                    status?: Database["public"]["Enums"]["prompt_status_enum"];
                    tags?: string[];
                    thumbnail_url?: string | null;
                    title?: string;
                    type?: Database["public"]["Enums"]["prompt_type_enum"];
                    updated_at?: string;
                    use_cases?: string[];
                    variables?: Json;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_prompts_category";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "fk_prompts_category";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "prompts_public";
                        referencedColumns: ["category_id"];
                    }
                ];
            };
            subscriptions: {
                Row: {
                    cancel_at_period_end: boolean;
                    canceled_at: string | null;
                    created_at: string;
                    currency: string;
                    current_period_end: string | null;
                    current_period_start: string | null;
                    id: string;
                    interval_type: string;
                    plan_name: string;
                    price_amount: number;
                    status: string;
                    stripe_customer_id: string | null;
                    stripe_subscription_id: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    cancel_at_period_end?: boolean;
                    canceled_at?: string | null;
                    created_at?: string;
                    currency?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    id?: string;
                    interval_type: string;
                    plan_name: string;
                    price_amount: number;
                    status: string;
                    stripe_customer_id?: string | null;
                    stripe_subscription_id?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    cancel_at_period_end?: boolean;
                    canceled_at?: string | null;
                    created_at?: string;
                    currency?: string;
                    current_period_end?: string | null;
                    current_period_start?: string | null;
                    id?: string;
                    interval_type?: string;
                    plan_name?: string;
                    price_amount?: number;
                    status?: string;
                    stripe_customer_id?: string | null;
                    stripe_subscription_id?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            prompts_public: {
                Row: {
                    category_id: string | null;
                    category_name: string | null;
                    category_slug: string | null;
                    content: string | null;
                    created_at: string | null;
                    example_values: Json | null;
                    id: string | null;
                    tags: string[] | null;
                    thumbnail_url: string | null;
                    title: string | null;
                    updated_at: string | null;
                    use_cases: string[] | null;
                    variables: Json | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            create_prompt_admin: {
                Args: {
                    p_title: string;
                    p_content: string;
                    p_description?: string;
                    p_category_slug?: string;
                    p_thumbnail_url?: string;
                };
                Returns: string;
            };
            is_admin: {
                Args: { uid: string };
                Returns: boolean;
            };
            publish_prompt: {
                Args: { p_id: string; make_published?: boolean };
                Returns: undefined;
            };
        };
        Enums: {
            prompt_status_enum: "draft" | "published" | "archived";
            prompt_type_enum: "text" | "image";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
    keyof Database,
    "public"
>];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
          DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
          DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
          Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
          Insert: infer I;
      }
        ? I
        : never
    : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
          Update: infer U;
      }
        ? U
        : never
    : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
    public: {
        Enums: {
            prompt_status_enum: ["draft", "published", "archived"],
            prompt_type_enum: ["text", "image"],
        },
    },
} as const;
