import { prisma } from "@/lib/db";
import { getGuideContent as getMdxContent } from "@/lib/utils/mdx";

export async function getGuideBody(slug: string): Promise<string> {
  try {
    const guide = await prisma.guide.findUnique({
      where: { slug },
      select: { bodyMarkdown: true },
    });
    if (guide?.bodyMarkdown) {
      return guide.bodyMarkdown;
    }
  } catch {
    // fall through
  }
  return getMdxContent(slug);
}
