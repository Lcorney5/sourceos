import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/auth", "/", "/pricing", "/privacy", "/terms"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`))
  );
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase isn't configured yet (e.g. local dev before setup). Let public
    // pages render; dashboard routes will fail their own data fetches.
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Required: this triggers Supabase's token refresh and must not be removed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // API routes (webhooks, etc.) authenticate themselves — e.g. Stripe/Twilio
  // verify a request signature instead of a user session — so they must
  // never be redirected to /login.
  if (pathname.startsWith("/api/")) {
    return response;
  }

  if (!user && !isPublicPath(pathname)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
