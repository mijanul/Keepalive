import { NextResponse } from "next/server";

import { pingUrl } from "@/lib/ping";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.HEALTH_URL?.trim();
  if (!url) {
    return NextResponse.json(
      { ok: false, error: "HEALTH_URL is not set on the server" },
      { status: 500 },
    );
  }

  const result = await pingUrl(url);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
