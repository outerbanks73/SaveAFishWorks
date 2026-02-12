export interface BreadcrumbItem {
  label: string;
  href: string;
}

const SITE_URL = "https://learn.aquaticmotiv.com";

export function buildBreadcrumbs(
  segments: { label: string; href: string }[]
): BreadcrumbItem[] {
  return [{ label: "Home", href: "/" }, ...segments];
}

export function breadcrumbsToSchemaItems(crumbs: BreadcrumbItem[]) {
  return crumbs.map((c) => ({
    name: c.label,
    url: `${SITE_URL}${c.href}`,
  }));
}
