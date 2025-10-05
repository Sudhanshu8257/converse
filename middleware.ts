import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware to handle authentication and route protection
export function middleware(request: NextRequest) {
  // Get the value of the 'auth' cookie
  const authCookie = request.cookies.get("auth")?.value;
  
  // If the user is authenticated
  if (authCookie) {
    // Redirect authenticated users trying to access login or register pages to /chat
    if (
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname.startsWith("/login")
    ) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
  } else {
    // Redirect unauthenticated users trying to access /chat to the login page
    if (request.nextUrl.pathname.startsWith("/chat")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname || "/#");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with the request if no redirection is needed
  return NextResponse.next();
}

// Configuration for the paths the middleware should match
export const config = {
  matcher: ["/chat/:path*", "/login", "/register"],
};
