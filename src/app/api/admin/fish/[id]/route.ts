import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const fish = await prisma.fishSpecies.findUnique({ where: { id } });
  if (!fish) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(fish);
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  const body = await req.json();

  const fish = await prisma.fishSpecies.update({
    where: { id },
    data: {
      slug: body.slug,
      commonName: body.commonName,
      scientificName: body.scientificName,
      family: body.family,
      origin: body.origin,
      description: body.description,
      image: body.image || null,
      difficulty: body.difficulty,
      temperament: body.temperament,
      diet: body.diet,
      lifespan: body.lifespan,
      size: body.size,
      tankSize: body.tankSize,
      temperature: body.temperature,
      ph: body.ph,
      hardness: body.hardness,
      waterType: body.waterType,
      careNotes: body.careNotes ?? "",
      status: body.status,
      compatibleWith: body.compatibleWith ?? [],
      incompatibleWith: body.incompatibleWith ?? [],
      relatedGuides: body.relatedGuides ?? [],
      relatedProducts: body.relatedProducts ?? [],
      faqs: body.faqs ?? [],
    },
  });

  revalidatePath("/fish");
  return NextResponse.json(fish);
}

export async function DELETE(_req: NextRequest, ctx: Context) {
  const { error } = await requireEditor();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.fishSpecies.update({ where: { id }, data: { status: "ARCHIVED" } });

  revalidatePath("/fish");
  return NextResponse.json({ success: true });
}
