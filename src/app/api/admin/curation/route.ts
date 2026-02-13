import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  const lists = await prisma.curationList.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(lists);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireEditor();
  if (error) return error;

  const body = await req.json();
  const list = await prisma.curationList.create({
    data: {
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      intro: body.intro ?? "",
      image: body.image || null,
      items: body.items ?? [],
      status: body.status ?? "DRAFT",
      relatedLists: body.relatedLists ?? [],
      relatedGuides: body.relatedGuides ?? [],
      targetPersonas: body.targetPersonas ?? [],
      faqs: body.faqs ?? [],
      createdById: session!.user.id,
    },
  });

  revalidatePath("/best");
  return NextResponse.json(list, { status: 201 });
}
