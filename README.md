# HTTP Headers Analyzer API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://http-headers.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Analyze HTTP response headers -- security score, HSTS/CSP check, server detection, caching config. Score 0-100. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "http-headers": {
      "url": "https://http-headers.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://http-headers.api.klymax402.com/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `network_analyze_headers` | POST | `/api/analyze` | $0.003 | Analyze HTTP response headers for a URL |

### `network_analyze_headers`

Use this when you need to analyze HTTP response headers of a URL for security and configuration. Returns a full header audit in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | Full URL to analyze (e.g. https://example.com) |

Example response:

```json
{"url":"https://example.com","securityScore":85,"securityHeaders":{"hsts":true,"csp":true,"xFrameOptions":true,"xContentType":true,"referrerPolicy":false},"server":"nginx","caching":{"cacheControl":"max-age=3600","etag":true},"recommendations":["Add Referrer-Policy header"]}
```

**When to use**: security audits, DevOps monitoring, compliance checks, and verifying proper header configuration after deployment.

**Not for**: SSL certificate check (use `security_check_ssl`), web scraping (use `web_scrape_to_markdown`), GDPR compliance (use `compliance_scan_gdpr`).

## Example agent prompts

- "Analyze HTTP response headers of a URL for security and configuration"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
