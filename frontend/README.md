# PropView frontend

React, React Router and Vite frontend for the PropView marketplace.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run test:e2e
```

The development server proxies `/api` to Express at port 3000. Browser tests
need MongoDB and a Playwright Chromium installation (`npx playwright install chromium`).
They run a separate API server on port 3101 and use a disposable test database.

Configure Google Maps through ignored `.env.local` variables shown in
`.env.example`. Never put backend secrets in frontend variables.

See the root [setup guide](../SETUP.md), [project README](../README.md), and
[deployment guide](../DEPLOYMENT.md) for complete instructions.
