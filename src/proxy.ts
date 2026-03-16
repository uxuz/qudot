// For backwards compatibility of usernames, as they are all now all lowercase

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
