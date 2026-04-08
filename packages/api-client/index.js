export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const trimSlash = (value) => value.replace(/\/+$/, "");

export function createApiClient({ baseUrl, credentials = "include" }) {
  const resolvedBaseUrl = trimSlash(baseUrl ?? "http://localhost:8081");

  async function request(path, options = {}) {
    const response = await fetch(`${resolvedBaseUrl}${path}`, {
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {})
      },
      ...options
    });

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new ApiError(
        payload?.message ?? `Request failed with status ${response.status}`,
        response.status,
        payload
      );
    }

    return payload;
  }

  return {
    get: (path, options = {}) => request(path, { ...options, method: "GET" }),
    post: (path, body, options = {}) =>
      request(path, {
        ...options,
        method: "POST",
        body: body == null ? undefined : JSON.stringify(body)
      }),
    patch: (path, body, options = {}) =>
      request(path, {
        ...options,
        method: "PATCH",
        body: body == null ? undefined : JSON.stringify(body)
      })
  };
}
