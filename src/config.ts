import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "http-headers",
  slug: "http-headers",
  description: "Analyze HTTP response headers -- security score, HSTS/CSP check, server detection, caching config. Score 0-100.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/analyze",
      price: "$0.001",
      description: "Analyze HTTP response headers for a URL",
      toolName: "network_analyze_headers",
      toolDescription: `Use this when you need to analyze HTTP response headers of a URL for security and configuration. Returns a full header audit in JSON.

Returns: 1. allHeaders (raw key-value map) 2. securityScore (0-100) 3. securityHeaders (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy -- present/missing) 4. server software detected 5. caching config (Cache-Control, ETag, Expires) 6. recommendations array.

Example output: {"url":"https://example.com","securityScore":85,"securityHeaders":{"hsts":true,"csp":true,"xFrameOptions":true,"xContentType":true,"referrerPolicy":false},"server":"nginx","caching":{"cacheControl":"max-age=3600","etag":true},"recommendations":["Add Referrer-Policy header"]}

Use this FOR security audits, DevOps monitoring, compliance checks, and verifying proper header configuration after deployment.

Do NOT use for SSL certificate check -- use security_check_ssl instead. Do NOT use for web scraping -- use web_scrape_to_markdown instead. Do NOT use for GDPR compliance -- use compliance_scan_gdpr instead.`,
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL to analyze (e.g. https://example.com)" },
        },
        required: ["url"],
      },
      outputSchema: {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "URL analyzed"
            },
            "statusCode": {
              "type": "number",
              "description": "HTTP status code"
            },
            "headers": {
              "type": "object",
              "description": "Response headers"
            },
            "securityHeaders": {
              "type": "object",
              "description": "Security header analysis"
            },
            "score": {
              "type": "number",
              "description": "Security score"
            },
            "issues": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "url",
            "statusCode",
            "headers"
          ]
        },
    },
  ],
};
