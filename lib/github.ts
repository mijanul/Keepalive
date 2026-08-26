const GITHUB_API = "https://api.github.com";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export function githubConfig() {
  return {
    token: requiredEnv("GH_PAT"),
    repo: requiredEnv("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH?.trim() || "main",
  };
}

export async function createRepoFile(path: string, content: string, message: string) {
  const { token, repo, branch } = githubConfig();
  const response = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
    }),
  });

  const body = (await response.json()) as {
    message?: string;
    content?: { html_url?: string; path?: string };
    commit?: { html_url?: string };
  };

  if (!response.ok) {
    throw new Error(body.message || `GitHub commit failed (${response.status})`);
  }

  return {
    path: body.content?.path ?? path,
    fileUrl: body.content?.html_url,
    commitUrl: body.commit?.html_url,
  };
}
