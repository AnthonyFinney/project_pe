// AUTO-GENERATED on 2025-08-11T15:34:38.039377Z
// Clean TypeScript helpers for 'subscriptions' table/view
// Edit safely: these are small and readable by design.
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
    Database,
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/types/database.types";
import { Constants } from "@/types/database.types";

// Types
export type Subscriptions = Tables<"subscriptions">;
export type SubscriptionsInsert = TablesInsert<"subscriptions">;
export type SubscriptionsUpdate = TablesUpdate<"subscriptions">;

// Zod schema for runtime validation
export const subscriptionsSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    plan_name: z.string(),
    interval_type: z.string(),
    price_amount: z.number(),
    currency: z.string(),
    status: z.string(),
    cancel_at_period_end: z.boolean(),
    canceled_at: z.string().nullable(),
    current_period_start: z.string().nullable(),
    current_period_end: z.string().nullable(),
    stripe_customer_id: z.string().nullable(),
    stripe_subscription_id: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

// CRUD Helpers
export function subscriptionsRepo(client: SupabaseClient<Database>) {
    const table = client.from("subscriptions");

    async function list() {
        const { data, error } = await table
            .select("*")
            .order("id", { ascending: true });
        if (error) throw error;
        return data as Subscriptions[];
    }

    async function getById(id: string) {
        const { data, error } = await table.select("*").eq("id", id).single();
        if (error) throw error;
        return data as Subscriptions;
    }

    async function create(values: SubscriptionsInsert) {
        const parse = subscriptionsSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table.insert(values).select("*").single();
        if (error) throw error;
        return data as Subscriptions;
    }

    async function update(id: string, values: SubscriptionsUpdate) {
        const parse = subscriptionsSchema.partial().safeParse(values);
        if (!parse.success) throw new Error(parse.error.message);
        const { data, error } = await table
            .update(values)
            .eq("id", id)
            .select("*")
            .single();
        if (error) throw error;
        return data as Subscriptions;
    }

    async function remove(id: string) {
        const { error } = await table.delete().eq("id", id);
        if (error) throw error;
    }

    return { list, getById, create, update, remove };
}
