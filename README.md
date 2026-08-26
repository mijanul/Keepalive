# Keepalive

Public helper for the Doctor Strange API on Render.

- GitHub Actions pings `/health` every 8 minutes
- GitHub Actions writes today's UTC date to `heartbeat/monthly.txt` every 30 days
- A Vercel UI can ping `/health`, `/health/db`, or push a random note into `notes/`

## Secrets

### GitHub Actions (this repo)

**Settings → Secrets and variables → Actions**

| Secret | Required | What it is |
| ------ | -------- | ---------- |
| `HEALTH_URL` | Yes | `https://<your-app>.onrender.com/health` |

No PAT is needed for Actions. The 30-day commit uses the built-in `GITHUB_TOKEN`.

### Vercel (frontend)

**Project → Settings → Environment Variables** (Production and Preview).  
Never use a `NEXT_PUBLIC_` prefix for tokens.

| Variable | Required | What it is |
| -------- | -------- | ---------- |
| `HEALTH_URL` | Yes | Same public `/health` URL |
| `GITHUB_REPO` | Yes | `mijanul/Keepalive` |
| `GITHUB_BRANCH` | No | `main` by default |
| `GH_PAT` | Yes | Fine-grained PAT (see below) |
| `COMMIT_SECRET` | Recommended | Password the UI must send before committing |

The PAT stays on the Vercel server. The browser only calls `/api/health`, `/api/health/db`, and `/api/commit`. The 8-minute Action never calls `/health/db`.

## PAT to create

Create a **fine-grained personal access token**:

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. **Generate new token**
3. Token name: `Vercel Keepalive`
4. Expiration: 90 days (or custom)
5. Resource owner: `mijanul`
6. Repository access: **Only select repositories** → `Keepalive`
7. Repository permissions:
   - **Contents**: Read and write
   - **Metadata**: Read (automatic)
8. Generate and copy it once

Set that value as `GH_PAT` on Vercel only.

Classic token alternative: scope `public_repo` only. Fine-grained is better because it is limited to this one repo.

Do **not** put this PAT in:

- the frontend code
- `NEXT_PUBLIC_*` variables
- Doctor Strange / KamarTaj env files
- GitHub Actions secrets (not needed there)

## Full setup

1. Deploy Doctor Strange to Render with `GET /health` and `GET /health/db` live.
2. In **https://github.com/mijanul/Keepalive** → **Settings → Secrets and variables → Actions**:
   - `HEALTH_URL` = `https://<your-app>.onrender.com/health`
3. Create a fine-grained PAT (section above) and copy it once.
4. Import this repo in Vercel. Add env vars: `HEALTH_URL`, `GITHUB_REPO`, `GH_PAT`, and `COMMIT_SECRET`.
5. Deploy the Vercel project.
6. GitHub → **Actions → Ping health → Run workflow** once to confirm the 8-minute job.
7. Open the Vercel URL and click **Check health** and **Check database health**.

Local UI:

```bash
cd Keepalive
cp .env.example .env.local
# fill GH_PAT, HEALTH_URL, GITHUB_REPO
npm install
npm run dev
```
