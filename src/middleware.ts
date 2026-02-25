import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// XE 시절 category 쿼리 파라미터 → 새 경로 매핑
const SERMON_CATEGORY_MAP: Record<string, string> = {
  "223": "sunday",
  "224": "seminar",
  "225": "wednesday",
  "226": "dawn",
  "227": "special",
  "19193": "message",
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // /Sunday01?category=xxx → /sermons?category=yyy
  if (pathname === "/Sunday01") {
    const url = request.nextUrl.clone();
    url.pathname = "/sermons";

    if (searchParams.has("category")) {
      const xeCategory = searchParams.get("category")!;
      const newCategory = SERMON_CATEGORY_MAP[xeCategory];
      url.searchParams.delete("category");
      if (newCategory) {
        url.searchParams.set("category", newCategory);
      }
    }

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Sunday01"],
};
