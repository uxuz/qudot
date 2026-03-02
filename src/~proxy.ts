// This is only used in development and will be removed in the final version
// The entire application will essentially be completely static without any serverless edge functions
// Lowercase redirects will be handled by a simple Cloudflare rule that will handle redirects to the lowercase version

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  const match = url.pathname.match(/^\/([^\/]+)$/);

  if (!match) return NextResponse.next();

  const username = match[1];
  const lower = username.toLowerCase();

  if (username !== lower) {
    url.pathname = `/${lower}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:username",
};
