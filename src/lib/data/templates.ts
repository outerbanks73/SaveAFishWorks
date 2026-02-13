import { prisma } from "@/lib/db";
import { templates as staticTemplates, type AquascapeTemplate } from "@/data/templates";

export async function getAllTemplates(): Promise<AquascapeTemplate[]> {
  try {
    const count = await prisma.configuratorTemplate.count();
    if (count > 0) {
      const rows = await prisma.configuratorTemplate.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
      return rows.map((r) => ({
        id: r.templateId,
        name: r.name,
        description: r.description,
        style: r.style as AquascapeTemplate["style"],
        tankId: r.tankId,
        difficulty: r.difficulty as AquascapeTemplate["difficulty"],
        productIds: r.shopifyProductIds,
      }));
    }
  } catch {
    // fall through
  }
  return staticTemplates;
}

export async function getTemplateById(templateId: string): Promise<AquascapeTemplate | undefined> {
  try {
    const r = await prisma.configuratorTemplate.findUnique({ where: { templateId } });
    if (r) {
      return {
        id: r.templateId,
        name: r.name,
        description: r.description,
        style: r.style as AquascapeTemplate["style"],
        tankId: r.tankId,
        difficulty: r.difficulty as AquascapeTemplate["difficulty"],
        productIds: r.shopifyProductIds,
      };
    }
  } catch {
    // fall through
  }
  return staticTemplates.find((t) => t.id === templateId);
}
