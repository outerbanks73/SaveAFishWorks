import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/admin", "/configurator", "/api/tanks", "/api/maintenance", "/api/configurations", "/api/notifications", "/api/push"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  if (!req.auth?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = req.auth.user.role;

  // Admin routes: ADMIN and EDITOR can access, except /admin/users which is ADMIN-only
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isAdminOnly = pathname.startsWith("/admin/users") || pathname.startsWith("/api/admin/users");

    if (isAdminOnly && role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (role !== "ADMIN" && role !== "EDITOR") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/configurator/:path*", "/api/tanks/:path*", "/api/maintenance/:path*", "/api/configurations/:path*", "/api/notifications/:path*", "/api/push/:path*", "/api/admin/:path*"],
};
