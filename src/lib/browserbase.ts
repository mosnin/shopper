// Browserbase - the deep-shopping browser. Env-gated like every other
// provider: without BROWSERBASE_API_KEY + BROWSERBASE_PROJECT_ID callers
// treat deep shopping as not configured and return 501. A session is a real
// headless browser the agent can drive over CDP (connectUrl) when a hunt
// needs more than scraping: forums, marketplaces, logged-out storefronts,
// listings that only render in a browser.

import { fetchWithTimeout } from "@/lib/http";

const API = "https://api.browserbase.com/v1";

export function isBrowserbaseConfigured(): boolean {
  return Boolean(process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID);
}

export type BrowserSession = {
  id: string;
  status: string;
  connectUrl?: string;
  seleniumRemoteUrl?: string;
};

/** Create a fresh browser session for a deep-shopping run. */
export async function createBrowserSession(): Promise<BrowserSession> {
  const res = await fetchWithTimeout(`${API}/sessions`, {
    method: "POST",
    headers: {
      "X-BB-API-Key": process.env.BROWSERBASE_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId: process.env.BROWSERBASE_PROJECT_ID }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Browserbase session create failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as BrowserSession;
  return {
    id: data.id,
    status: data.status,
    connectUrl: data.connectUrl,
    seleniumRemoteUrl: data.seleniumRemoteUrl,
  };
}

/** The live debugger view for a session, so a human can watch the agent shop. */
export async function sessionDebugUrl(sessionId: string): Promise<string | undefined> {
  const res = await fetchWithTimeout(`${API}/sessions/${sessionId}/debug`, {
    headers: { "X-BB-API-Key": process.env.BROWSERBASE_API_KEY! },
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { debuggerFullscreenUrl?: string };
  return data.debuggerFullscreenUrl;
}
