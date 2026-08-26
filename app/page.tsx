"use client";

import { useState } from "react";

type Result = { ok: boolean; text: string };
type Busy = "health" | "health-db" | "commit" | null;

export default function HomePage() {
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function runCheck(kind: Exclude<Busy, null>, path: string, method = "GET") {
    setBusy(kind);
    setResult(null);
    try {
      const response = await fetch(path, {
        method,
        cache: "no-store",
        headers:
          method === "POST"
            ? {
                "Content-Type": "application/json",
                ...(secret ? { "x-commit-secret": secret } : {}),
              }
            : undefined,
        body: method === "POST" ? JSON.stringify(secret ? { secret } : {}) : undefined,
      });
      const data = await response.json();
      setResult({ ok: Boolean(data.ok), text: JSON.stringify(data, null, 2) });
    } catch (error) {
      setResult({
        ok: false,
        text: error instanceof Error ? error.message : "Request failed",
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <main>
      <h1>Keepalive</h1>
      <p>
        GitHub Actions ping <code>/health</code> every 8 minutes (app only). Use the buttons to
        check app health or database health, or to push a random note.
      </p>

      <section className="panel">
        <div className="actions">
          <button
            type="button"
            onClick={() => runCheck("health", "/api/health")}
            disabled={busy !== null}
          >
            {busy === "health" ? "Checking health…" : "Check health"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => runCheck("health-db", "/api/health/db")}
            disabled={busy !== null}
          >
            {busy === "health-db" ? "Checking database…" : "Check database health"}
          </button>
          <input
            type="password"
            autoComplete="off"
            placeholder="Commit secret (required if COMMIT_SECRET is set on Vercel)"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
          />
          <button
            type="button"
            className="secondary"
            onClick={() => runCheck("commit", "/api/commit", "POST")}
            disabled={busy !== null}
          >
            {busy === "commit" ? "Writing note…" : "Write a random note and push"}
          </button>
        </div>
        {result ? <pre className={`result ${result.ok ? "ok" : "bad"}`}>{result.text}</pre> : null}
      </section>
    </main>
  );
}
