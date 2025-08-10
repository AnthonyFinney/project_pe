import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types/database.types";

export const middleware = async (req: NextRequest) => {
    if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req, res });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/login", req.url));

    const { data: isAdmin } = await supabase.rpc("is_admin", { uid: user.id });
    if (!isAdmin) return NextResponse.redirect(new URL("/", req.url));

    return res;
};

export const config = {
    matcher: ["/admin/:path"],
};
