export const API_BASE_URL = "https://cocktails.solvro.pl/api/v1";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export async function apiFetch<T>(
  path: string,
  params?: URLSearchParams,
  init?: RequestInit,
): Promise<T> {
  const query = params?.size ? `?${params}` : "";
  const response = await fetch(`${API_BASE_URL}${path}${query}`, init);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new ApiError(
      response.status,
      body?.message ?? `Request to ${path} failed with ${response.status}`,
    );
  }

  return (await response.json()) as T;
}
