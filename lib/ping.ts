export type PingResult = {
  ok: boolean;
  status?: number;
  target?: string;
  body?: unknown;
  error?: string;
};

export function healthDbUrl(healthUrl: string): string {
  const trimmed = healthUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/health")) {
    return `${trimmed}/db`;
  }
  return `${trimmed}/health/db`;
}

export async function pingUrl(url: string): Promise<PingResult> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(120_000),
    });
    const text = await response.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      // keep raw text
    }
    return {
      ok: response.ok,
      status: response.status,
      target: url,
      body: parsed,
    };
  } catch (error) {
    return {
      ok: false,
      target: url,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}
