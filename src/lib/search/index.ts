import { getTypesenseClient } from "./client";

const COLLECTION_NAME = "content";

const COLLECTION_SCHEMA = {
  name: COLLECTION_NAME,
  fields: [
    { name: "title", type: "string" as const },
    { name: "description", type: "string" as const, optional: true },
    { name: "body", type: "string" as const, optional: true },
    { name: "type", type: "string" as const, facet: true },
    { name: "category", type: "string" as const, facet: true, optional: true },
    { name: "slug", type: "string" as const },
    { name: "url", type: "string" as const },
    { name: "tags", type: "string[]" as const, optional: true },
  ],
};

export async function ensureCollection() {
  const client = getTypesenseClient();

  try {
    await client.collections(COLLECTION_NAME).retrieve();
  } catch {
    await client.collections().create(COLLECTION_SCHEMA);
  }
}

export async function indexDocuments(documents: Array<{
  id: string;
  title: string;
  description?: string;
  body?: string;
  type: string;
  category?: string;
  slug: string;
  url: string;
  tags?: string[];
}>) {
  const client = getTypesenseClient();

  // Import in batches of 100
  for (let i = 0; i < documents.length; i += 100) {
    const batch = documents.slice(i, i + 100);
    await client
      .collections(COLLECTION_NAME)
      .documents()
      .import(batch, { action: "upsert" });
  }

  return documents.length;
}

export async function searchContent(query: string, options?: { type?: string; limit?: number }) {
  const client = getTypesenseClient();

  const searchParams: Record<string, string | number> = {
    q: query,
    query_by: "title,description,body,tags",
    per_page: options?.limit ?? 10,
  };

  if (options?.type) {
    searchParams.filter_by = `type:${options.type}`;
  }

  const result = await client
    .collections(COLLECTION_NAME)
    .documents()
    .search(searchParams);

  return {
    results: (result.hits ?? []).map((hit) => ({
      id: (hit.document as Record<string, unknown>).id as string,
      title: (hit.document as Record<string, unknown>).title as string,
      description: (hit.document as Record<string, unknown>).description as string | undefined,
      type: (hit.document as Record<string, unknown>).type as string,
      url: (hit.document as Record<string, unknown>).url as string,
      highlights: hit.highlights,
    })),
    total: result.found,
  };
}
