import { NextResponse } from "next/server";

import { createRepoFile } from "@/lib/github";
import { randomNote } from "@/lib/phrases";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expectedSecret = process.env.COMMIT_SECRET?.trim();
  if (expectedSecret) {
    const headerSecret = request.headers.get("x-commit-secret")?.trim();
    const body = (await request.json().catch(() => ({}))) as { secret?: string };
    const provided = headerSecret || body.secret?.trim();
    if (provided !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Invalid commit secret" }, { status: 401 });
    }
  }

  try {
    const note = randomNote();
    const result = await createRepoFile(
      note.filename,
      note.text,
      `chore: random keepalive note ${note.filename}`,
    );
    return NextResponse.json({ ok: true, ...result, preview: note.text.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Commit failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
