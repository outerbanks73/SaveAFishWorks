import fs from "fs";
import path from "path";

const GUIDES_DIR = path.join(process.cwd(), "src/data/guides/content");

export function getGuideContent(slug: string): string {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf-8");
}
