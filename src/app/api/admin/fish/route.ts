import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireEditor } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireEditor();
  if (error) return error;

  const fish = await prisma.fishSpecies.findMany({ orderBy: { commonName: "asc" } });
  return NextResponse.json(fish);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireEditor();
  if (error) return error;

  const body = await req.json();
  const fish = await prisma.fishSpecies.create({
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
      status: body.status ?? "DRAFT",
      compatibleWith: body.compatibleWith ?? [],
      incompatibleWith: body.incompatibleWith ?? [],
      relatedGuides: body.relatedGuides ?? [],
      relatedProducts: body.relatedProducts ?? [],
      faqs: body.faqs ?? [],
      createdById: session!.user.id,
    },
  });

  revalidatePath("/fish");
  return NextResponse.json(fish, { status: 201 });
}
