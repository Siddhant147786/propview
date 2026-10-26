# PropView

A React and Express property marketplace for browsing homes, publishing listings,
comparing neighbourhood asking prices, and contacting property owners.

Implemented workflows:

- Email-verified registration, cookie sessions, sign-in/out, password reset and profile editing.
- Property creation, photo uploads, detail pages, owner edits and removal.
- Buy/rent search, city/locality, budget, bedroom and property-type filters, sorting and pagination.
- Rule-based quick text search (for example, `2 bhk flats in Pune under 60 lakh`). This is not an LLM service.
- Google address autocomplete and optional property map views; manual addresses remain supported.
- Private conversations, replies, unread counts, close/reopen controls and 15-second polling.
- Support enquiries, sender-visible responses, and an administrator support inbox.
- Neighbourhood asking-price summaries based on current listings.
- Image cleanup retry jobs, health endpoint, production static hosting and CI.

## Run locally

Use Node.js 24+ and MongoDB. Follow [SETUP.md](SETUP.md) for credentials and provider configuration.

```sh
npm run install:all
npm run dev:api
# In a second terminal:
npm run dev:web
```

Open the Vite URL (normally http://localhost:5173). On Windows PowerShell with script
execution disabled, use `npm.cmd` and `npx.cmd` in place of `npm` and `npx`.

## Verify

```sh
npm test
npm run build
cd frontend
npx playwright install chromium
cd ..
npm run test:e2e
```

MongoDB must be running for integration/browser tests. They create randomly named
`propview_test_*` databases and remove only those databases when done. Set
`TEST_MONGODB_URI` to use another MongoDB server; the database name is always overridden.
Tests stub email and Cloudinary to avoid sending mail or uploading files. Browser tests
also intercept Google Maps requests. Live provider permissions require a separate check.

See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting, admin access, backups and maintenance.
