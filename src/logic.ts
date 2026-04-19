import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

const SECURITY_HEADERS = [
  { name: "strict-transport-security", label: "HSTS", weight: 20 },
  { name: "content-security-policy", label: "CSP", weight: 20 },
  { name: "x-frame-options", label: "X-Frame-Options", weight: 10 },
  { name: "x-content-type-options", label: "X-Content-Type-Options", weight: 10 },
  { name: "referrer-policy", label: "Referrer-Policy", weight: 10 },
  { name: "permissions-policy", label: "Permissions-Policy", weight: 10 },
  { name: "x-xss-protection", label: "X-XSS-Protection", weight: 5 },
  { name: "cross-origin-opener-policy", label: "COOP", weight: 5 },
  { name: "cross-origin-resource-policy", label: "CORP", weight: 5 },
  { name: "cross-origin-embedder-policy", label: "COEP", weight: 5 },
];

export function registerRoutes(app: Hono) {
  app.post("/api/analyze", async (c) => {
    await tryRequirePayment(0.001);
    const body = await c.req.json().catch(() => null);
    if (!body?.url) {
      return c.json({ error: "Missing required field: url" }, 400);
    }

    let url: string = body.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      const result = await analyzeHeaders(url);
      return c.json(result);
    } catch (e: any) {
      return c.json({ error: `Header analysis failed: ${e.message}` }, 400);
    }
  });
}

async function analyzeHeaders(url: string) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent": "x402-http-headers/1.0",
    },
  });

  // Collect all headers
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  // Consume body to avoid leaking
  await response.text();

  // Security analysis
  const securityHeaders: Record<string, { present: boolean; value: string | null; label: string }> = {};
  let securityScore = 0;
  let totalWeight = 0;

  for (const sh of SECURITY_HEADERS) {
    totalWeight += sh.weight;
    const value = headers[sh.name] || null;
    const present = value !== null;
    securityHeaders[sh.label] = { present, value, label: sh.label };
    if (present) securityScore += sh.weight;
  }

  const scorePercent = Math.round((securityScore / totalWeight) * 100);

  // Grade
  let grade: string;
  if (scorePercent >= 90) grade = "A";
  else if (scorePercent >= 70) grade = "B";
  else if (scorePercent >= 50) grade = "C";
  else if (scorePercent >= 30) grade = "D";
  else grade = "F";

  // Server detection
  const server = headers["server"] || headers["x-powered-by"] || "unknown";

  // Cache info
  const cacheControl = headers["cache-control"] || null;
  const age = headers["age"] || null;
  const etag = headers["etag"] || null;
  const lastModified = headers["last-modified"] || null;
  const expires = headers["expires"] || null;

  // Recommendations
  const recommendations: string[] = [];
  for (const sh of SECURITY_HEADERS) {
    if (!headers[sh.name]) {
      recommendations.push(`Add ${sh.label} header for improved security`);
    }
  }

  return {
    url,
    statusCode: response.status,
    statusText: response.statusText,
    server,
    headers,
    headerCount: Object.keys(headers).length,
    security: {
      score: scorePercent,
      grade,
      headers: securityHeaders,
    },
    cache: {
      cacheControl,
      age,
      etag,
      lastModified,
      expires,
    },
    recommendations,
  };
}
