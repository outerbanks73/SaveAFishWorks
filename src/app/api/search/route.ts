import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/lib/search/index";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? undefined;
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "10");

  if (q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const data = await searchContent(q, { type, limit });
    return NextResponse.json(data);
  } catch {
    // Typesense not available — fallback to empty
    return NextResponse.json({ results: [], total: 0 });
  }
}
