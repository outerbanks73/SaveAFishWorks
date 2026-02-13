import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { getAllGlossaryTerms } from "@/lib/data/glossary";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  try {
    const count = await prisma.glossaryTerm.count();
    if (count > 0) {
      const rows = await prisma.glossaryTerm.findMany({
        select: { slug: true, term: true },
        orderBy: { term: "asc" },
      });
      return NextResponse.json(rows.map((r) => ({ slug: r.slug, title: r.term })));
    }
  } catch {
    // fall through
  }

  const terms = await getAllGlossaryTerms();
  return NextResponse.json(terms.map((t) => ({ slug: t.slug, title: t.term })));
}
