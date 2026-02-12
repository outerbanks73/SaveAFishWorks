import Typesense from "typesense";

export function getTypesenseClient() {
  return new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST ?? "localhost",
        port: parseInt(process.env.TYPESENSE_PORT ?? "8108"),
        protocol: "http",
      },
    ],
    apiKey: process.env.TYPESENSE_API_KEY ?? "change-me-typesense-api-key",
    connectionTimeoutSeconds: 5,
  });
}
