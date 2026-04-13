import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "http-headers",
  slug: "http-headers",
  description: "Analyze HTTP response headers for security, caching, and server detection.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/analyze",
      price: "$0.001",
      description: "Analyze HTTP response headers for a URL",
      toolName: "network_analyze_headers",
      toolDescription: "Use this when you need to analyze HTTP response headers of a URL. Checks security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), detects server software, analyzes caching configuration, and provides a security score. Returns all headers, security assessment, cache info, and recommendations. Do NOT use for SSL certificate check — use security_check_ssl instead. Do NOT use for web scraping — use web_scrape_to_markdown instead.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL to analyze (e.g. https://example.com)" },
        },
        required: ["url"],
      },
    },
  ],
};
