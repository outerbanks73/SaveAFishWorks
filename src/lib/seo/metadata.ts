import type { Metadata } from "next";

const SITE_NAME = "Aquatic Motiv";
const SITE_URL = "https://learn.aquaticmotiv.com";

interface MetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: MetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/images/og/default.png`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
