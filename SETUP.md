# Property uploads, address search and profiles

The frontend now sends one multipart request to `POST /api/properties` with a
`propertyData` JSON string and repeated `images` file fields. The backend verifies
the login cookie and active account before accepting uploads. It validates the
property, uploads the temporary disk files to Cloudinary, and saves the image URLs
and public IDs with the property in MongoDB. Temporary files are removed afterward;
successful Cloudinary uploads are removed if a later upload or database save fails.
Cleanup failures are logged for manual follow-up. The old demonstration
`POST /api/uploads` route has been replaced by property submission.

## Credentials

Add the following to the existing `backend/.env` (do not replace existing settings):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Find these in the Cloudinary console's API Keys settings. No unsigned upload preset
is needed: uploads are signed by the backend SDK. Keep the API secret server-side.
Existing `JWT_SECRET` must remain configured. MongoDB must be running locally at
`mongodb://127.0.0.1:27017/propview`, as configured in `backend/server.js`.

Create `frontend/.env.local` with:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_browser_key
```

In the Google Cloud project, enable billing, **Maps JavaScript API** and
**Places API (New)**. Restrict the key to those APIs and to website HTTP referrers
such as `http://localhost:5173/*` and your production site's origin. Add the actual
local port if Vite uses a different one. A browser key is visible in the frontend;
website and API restrictions control its use. No map ID or backend Google key is
needed for this autocomplete widget.

Restart both servers after adding environment variables. Build the frontend again
after changing its key for production. Production hosting must proxy `/api` to
Express on the same origin; the Vite proxy does this in development. Use HTTPS in
production because the authentication cookie is secure there.

## Run and verify

Install dependencies with `npm install` in both `backend` and `frontend`.
Run `node server.js` in `backend` and `npm run dev` in `frontend`.

1. Sign in with an existing active account. The navigation should show **Profile**.
2. Refresh the page: the account is restored via `GET /api/me`.
3. Open **List Property**, select a Google address suggestion, review the populated
   fields, and enter the flat/unit number. Manual entry works if Google is unavailable.
4. Choose 1–10 JPG/PNG/WebP photos (5 MB maximum each), complete the required fields,
   and publish. The profile page shows the saved property and its Cloudinary photo.
5. Verify URLs/public IDs in MongoDB and images in Cloudinary's `propview/properties`
   folder. `backend/uploads` should not retain successful submission files.
6. Sign out from the profile page. The navigation returns to **Sign in**, and protected
   pages redirect to sign-in.

The new endpoints are `GET /api/me`, `POST /api/signout`, `POST /api/properties`, and
`GET /api/properties/mine`. The last endpoint only returns the signed-in user's records.
Image files are private temporary server files until uploaded; no disk static-file
route is exposed. Cloudinary delivery URLs are public, so use property photos intended
for the listing.

Automated backend checks: `npm test` in `backend`. These use real multipart requests,
Multer, JWT checks and Mongoose validation, with mocked database persistence and
Cloudinary calls. Live provider behavior requires the credentials above.

References:
- https://developers.google.com/maps/documentation/javascript/place-autocomplete-new
- https://developers.google.com/maps/documentation/javascript/get-api-key
- https://cloudinary.com/documentation/node_image_and_video_upload
