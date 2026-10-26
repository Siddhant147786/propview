# Deployment and operations

## Single-server hosting

1. Install Node.js 24+ and run `npm run install:all` and `npm run build`.
2. Set the backend environment variables listed in `backend/.env.example`.
3. Set `NODE_ENV=production`, `APP_ORIGIN=https://your-domain.example`, and `PORT=3000`.
4. Start `node backend/server.js` through your hosting platform's process manager.
5. Terminate HTTPS at your reverse proxy and forward requests to the API server.
   Express serves both the built frontend and `/api`, including SPA route fallback.
   Set `TRUST_PROXY_HOPS` to your actual trusted proxy count (usually `1` for one proxy).

Production cookies require HTTPS. To test the combined server over local HTTP, use
`SERVE_FRONTEND=true` without `NODE_ENV=production`. Development uses Vite's proxy.

Example Nginx location inside an HTTPS-enabled server block:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 55m;
    proxy_read_timeout 120s;
}
```

## Containers

With Docker Compose installed and `backend/.env` configured:

```sh
docker compose --env-file frontend/.env.local up --build -d
```

The frontend Google browser key is a build argument. Backend secrets are supplied at
runtime, excluded from the build context, and must never be committed. MongoDB uses
a named volume and is not exposed on a host port. The application binds to localhost
port 3000 for an HTTPS reverse proxy. Set `APP_ORIGIN` in `backend/.env` to that public origin.
This Compose file is a single-host baseline, not a multi-region or high-availability setup.

## Support administrator

Create and verify a normal account. Add its email to the server environment:

```env
ADMIN_EMAILS=your-registered-email@example.com
```

Multiple administrators can be comma-separated. Restart the backend and refresh the
browser. The navigation then shows **Support admin** at `/admin`. Administrators can
read enquiries, publish responses and mark them resolved. Responses appear on the
sender's Contact page; no support emails are sent automatically. An empty allowlist
means no accounts have administrator access. The backend checks this on every admin request.

## Google Maps

Enable Maps JavaScript API and Places API (New), enable billing, and apply HTTP
referrer and API restrictions to the browser key. For production map styling and
advanced markers, supply `VITE_GOOGLE_MAP_ID`. Local builds fall back to Google's
`DEMO_MAP_ID`. Rebuild the frontend after any `VITE_*` change.

Reference: [Google advanced marker setup](https://developers.google.com/maps/documentation/javascript/advanced-markers/add-marker).

## Operations

- `/api/health` returns 200 when the database is connected and 503 otherwise.
- Monitor process logs and health failures through your hosting platform.
- Failed Cloudinary removals are persisted in the `cleanupjobs` collection and retried
  every minute with exponential backoff, capped at 24 hours. Jobs disappear on success.
  If MongoDB also fails when scheduling cleanup, public IDs are logged for manual follow-up.
- Maintain MongoDB backups through your provider or `mongodump`, store them separately,
  and test restoration into a separate database. Do not delete the Compose data volume.
- The built-in request limiter is per process. Use a shared rate-limit store or gateway
  before scaling to multiple API replicas.
- Removed properties are archived, not purged; messages and support records remain.
  Review retention needs before public launch. Privacy copy describes current behavior.
- Registration and password reset use the configured Gmail sender and app password.
  Verify delivery to an account you control before launch.
- No payment collection, booking deposits, external valuation service or LLM provider
  is integrated in this MVP.
