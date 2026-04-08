import { createApiClient } from "@restaurante/api-client";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";
export const api = createApiClient({ baseUrl: rawBaseUrl.replace(/\/+$/, "") });
