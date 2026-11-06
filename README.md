# Lookiy public web

This is the separate public website and client booking experience. It uses the Lookiy brand and takes layout cues from a modern ride-booking site. The rider, fleet, and business tools remain in the mobile app; they are not proxied by this web application.

## Local setup

1. Start the API gateway and its auth, geo, journey, matching, operator and supporting services.
2. Copy `.env.example` to `.env.local` in this directory and fill in the values you use.
3. Run `npm ci` and `npm run dev` in this directory. The site opens at `http://localhost:3200`.

Browser requests go to this Next.js app, which forwards a small allowlist of endpoints to the gateway. Session tokens and the device signature are stored as HTTP-only, same-site cookies. The server forwards the signature to auth-service when verifying the session. Production HTTPS enables secure cookies. Sessions created before the signature cookie was introduced require one fresh sign-in.

`GOOGLE_WEB_CLIENT_ID` enables the official Google Identity Services sign-in button. Use the Web application client ID accepted by auth-service's `GOOGLE_WEB_CLIENT_ID`, and add the exact website origin to its authorized JavaScript origins in Google Cloud. This public identifier is returned by `/api/session/google-config`; no OAuth client secret is used. Existing accounts with 2FA still complete the authenticator step, and inactive accounts are rejected. Email/phone login remains available if Google is unconfigured or unavailable.

## Vercel environment variables

| Name | Vercel type | Value |
| --- | --- | --- |
| `API_GATEWAY_URL` | Config | Required. HTTPS base origin of the Lookiy API gateway. |
| `SITE_URL` | Config | Production web-client origin for canonical page metadata. |
| `GOOGLE_WEB_CLIENT_ID` | Config | Required for Google sign-in. Use the Web OAuth client ID also allowed by auth-service. |
| `GOOGLE_MAPS_KEY` | Secret | Required for the interactive map. Use a dedicated key restricted to Maps JavaScript API and the exact web-client referrer. |
| `GOOGLE_MAPS_MAP_ID` | Config | Optional Google Cloud Map ID. Leave blank for the default map. |
| `APP_STORE_URL` | Config | Optional published Apple App Store listing URL. |
| `PLAY_STORE_URL` | Config | Optional published Google Play listing URL. |

Use these names as written. No `NEXT_PUBLIC_` variables are required. `/api/maps/config` verifies the current web session before returning the website-restricted browser key at runtime. The browser can inspect that key in its map requests. The backend `GOOGLE_MAPS_API_KEY` belongs only to geo-service, which handles public search and authenticated route previews. Web search uses Geocoding API and route previews use Routes API. Register each allowed web-client origin separately in Google Cloud for Maps referrers and the Web OAuth client's JavaScript origins.

## Scope

- Public pages: home, about, investors, business, support, and app download.
- Client pages: sign in, registration, place search, route and fare preview, ride or delivery request, active/past journey list, journey details with recorded rider movement and text chat, client cancellation and completion.
- The client proxy explicitly allows only the routes these pages need. Rider and business actions direct visitors to the mobile app.

Visitors can search and select places without signing in. Clicking “Plan your journey” saves those choices and verifies the session before opening planning. Guests go to `/login?next=/ride`, then return to the planner with their locations after password/Google login and any required 2FA. The planner and actual booking still require a session. The website shows API errors and does not substitute demo journeys or fake prices. If the Maps browser key is absent, the booking form still works with the API route estimate, and the map panel explains the missing configuration. Rider GPS upload, pairing, wallet settlement and other mobile-only controls remain in the mobile app.

Support submissions use `POST /api/support` on this Next.js server, which forwards to the gateway's `POST /support/requests` endpoint. The user service stores requests in MongoDB. Staff can retrieve them from the gateway's authenticated `GET /support/requests` endpoint. The form works for signed-out visitors, including business and investor inquiries. Do not collect passwords or payment PINs in support messages.

Build and type-check with `npm run build` and `npm run typecheck`.
