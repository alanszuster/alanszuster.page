# Alan Szuster - Personal Website

**Website**: [https://www.alanszuster.dev](https://www.alanszuster.dev)

This is my personal website showcasing my work as a Site Reliability Engineer (SRE). The site highlights my expertise in cloud infrastructure, system automation, monitoring, and development skills, with AI/ML projects as side endeavors. The site is built using Next.js, a React framework, and written in TypeScript for type safety and better developer experience. It is deployed on Vercel, ensuring fast and reliable hosting.

## Technology Stack

- **Frontend**: Next.js, TypeScript, HTML5, CSS3
- **Styling**: CSS Modules, PostCSS
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel, GitHub Actions
- **Runtime**: Node.js 26.x (LTS), npm 12+
- **Domain**: `alanszuster.dev` (Cloudflare DNS only, DNSSEC, CAA)
- **AI backend**: [doodleai](https://github.com/alanszuster/doodleai) on Hugging Face Spaces

## AI/ML Playground

Canvas → `src/pages/api/*` → doodleai. The API routes call the model with a **Vercel OIDC token**
(`Authorization: Bearer`, no shared secret); doodleai accepts only this project's production
environment. Strokes are redrawn (cropped, centred, 280×280) before sending to match the model's
training data. `/api/health` checks doodleai's authenticated `/status` (reachable, token accepted,
model loaded). Shared logic: `src/server/upstream.ts`.

## Configuration

| Variable | Purpose |
|---|---|
| `AI_APP_ENDPOINT` | Base URL of doodleai |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (default `https://www.alanszuster.dev`) |
| `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` | `true` enables Vercel Web Analytics |
| `VERCEL_OIDC_TOKEN` | Set by Vercel (header `x-vercel-oidc-token`); `vercel env pull` for local use. A `development` token is rejected by the production API by design |

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Security

- Headers in `next.config.ts`: CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP
- No secrets in the repo or browser; `/api/predict` validates input and is rate limited by a Vercel firewall rule (6 req/min/IP, configured in Vercel)

## CI/CD

`.github/workflows/ci.yml`: tests on PRs and `main`; PRs get a Vercel preview; `main` builds, deploys, then bumps the version, tags and creates a release. The bump runs after the deploy and retries against the latest `main`, so it cannot block a deployment. Deploys are serialised and the workflow token is read-only by default. To roll back, revert and push (re-running an old run redeploys that old commit).

## Author

**Alan Szuster**
SRE, ML/AI Engineer

## License

© 2025 Alan Szuster. All rights reserved.
