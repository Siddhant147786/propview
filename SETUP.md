# Local setup

Use Node.js 24 or newer. MongoDB defaults to `mongodb://127.0.0.1:27017/propview`;
set `MONGODB_URI` to override it. Start MongoDB before the backend.

## Backend environment

Copy `backend/.env.example` to `backend/.env` only if that file does not already
exist. Preserve existing credentials when adding settings.

- `JWT_SECRET`: a long random secret for signing login and verification tokens.
- `GOOGLE_APP_PASSWORD`: the Gmail app password used to send verification/reset codes.
- `MAIL_USER`: the Gmail address that owns that password (defaults to propview2026@gmail.com).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: signed image-upload credentials.
- `MONGODB_URI`: optional database connection URI.
- `PORT`: optional API port, defaults to 3000.
- `ADMIN_EMAILS`: optional comma-separated registered account emails allowed to use /admin.
- `APP_ORIGIN`: public frontend origin when deployed; normally unnecessary with the Vite proxy.
- `TRUST_PROXY_HOPS`: trusted reverse-proxy count; leave at 0 for direct local connections.

Never put JWT, email, database or Cloudinary secrets in frontend variables.

## Google address autocomplete and maps

Create `frontend/.env.local` with:

```env
VITE_GOOGLE_MAPS_API_KEY=your_browser_key
VITE_ENABLE_GOOGLE_AUTOCOMPLETE=true
VITE_GOOGLE_MAP_ID=
```

Enable Maps JavaScript API, Places API (New), and billing in the Google Cloud
project. Restrict the browser key to those APIs and your website HTTP referrers,
including the actual development origin and port. Frontend browser keys are
visible to users; backend secrets must stay server-side.

A map ID is optional locally (the app uses Google's demonstration ID). Supply
your own map ID for production. Selecting an address fills location fields and
coordinates; manually editing its address clears the old coordinates. Listings
without coordinates still appear in search, but not as map markers.

Reference: [Google address autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new).

Optional live check: with Vite stopped and Playwright Chromium installed, run
`npm run verify:google --prefix frontend`. It requests suggestions for one address
at `http://127.0.0.1:5173`; allow that referrer for local testing. No listing is saved.

## Run

From the repository root:

```sh
npm run install:all
npm run dev:api
# In another terminal:
npm run dev:web
```

Open the Vite URL shown in the terminal. Restart Vite after changing frontend
environment variables. On PowerShell, use `npm.cmd` if `npm.ps1` is blocked.

## Check the workflows

1. Register, request an email code, verify it, and create your account.
2. Sign in and refresh: the session should remain active.
3. Open List Property, choose an autocomplete suggestion or enter an address manually.
4. Upload 1–10 JPG, PNG or WebP photos (5 MB each maximum) and publish.
5. Find the listing in search, open its details, and display its map if coordinates exist.
6. Edit the listing from your profile; leaving photos empty preserves existing photos.
   Selecting new photos replaces the existing set.
7. With another account, send the owner a message. Read and reply from each profile.
8. Submit a Contact enquiry. A configured administrator can respond from /admin;
   the sender sees the response on the Contact page.
9. Reset a password and confirm old sessions are invalidated.
10. Remove a listing and confirm it is no longer public.

Cloudinary stores public property photos. Uploads use temporary private disk files,
which are removed after processing. Failed remote deletions are retried in the
background. There is no public local-uploads route.

## API groups

- `/api/generateotp`, `/api/verifyotp`, `/api/register`, `/api/signin`
- `/api/forgot-password`, `/api/reset-password`, `/api/signout`
- `/api/me`: GET session/profile and PATCH name/phone
- `/api/properties`: public search and authenticated multipart creation
- `/api/properties/mine`, `/api/properties/neighbourhoods`
- `/api/properties/:id`: GET detail; owner-only PATCH and DELETE
- `/api/properties/:id/edit`: owner-only full editable data
- `/api/messages`: GET inbox and POST new conversation
- `/api/messages/:id/replies`: POST reply
- `/api/messages/:id`: PATCH read count or open/closed status
- `/api/contact`: GET own enquiries and POST new enquiry
- `/api/admin/enquiries`: administrator-only GET; PATCH /:id response/status
- `/api/health`: database readiness

See [README.md](README.md) for tests and [DEPLOYMENT.md](DEPLOYMENT.md) for deployment.
