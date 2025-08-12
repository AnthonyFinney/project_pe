// middleware.ts (or src/middleware.ts)
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types/database.types";

export async function middleware(req: NextRequest) {
    // Only guard /admin routes
    if (!req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    // Important: use the same response object for Supabase so cookie updates persist
    const res = NextResponse.next();

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env
            .NEXT_PUBLIC_SUPABASE_ANON_KEY! /* anon is correct for SSR sessions */,
        {
            cookies: {
                getAll() {
                    return req.cookies
                        .getAll()
                        .map(({ name, value }) => ({ name, value }));
                },
                setAll(cookies) {
                    cookies.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Refreshes session if needed & returns user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check admin via RPC (expects boolean)
    const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin", {
        uid: user.id,
    });

    if (rpcError || !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return res;
}

export const config = {
    matcher: ["/admin/:path*"],
};
