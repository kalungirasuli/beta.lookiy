# Lookiy public web

This is the separate public website and client booking experience. It uses the Lookiy brand and takes layout cues from a modern ride-booking site. The rider, fleet, and business tools remain in the mobile app; they are not proxied by this web application.

## Local setup

1. Start the API gateway and its auth, geo, journey, matching, operator and supporting services.
2. Copy `.env.example` to `.env.local` in this directory and fill in the values you use.
3. Run `npm ci` and `npm run dev` in this directory. The site opens at `http://localhost:3200`.

`API_GATEWAY_URL` is server-only. Browser requests go to this Next.js app, which forwards a small allowlist of client endpoints to the gateway. Access and refresh tokens are stored as HTTP-only, same-site cookies. The app automatically refreshes an expired access token once and clears the cookies when the session is rejected. Production HTTPS enables secure cookies.

`GOOGLE_WEB_CLIENT_ID` enables the official Google Identity Services sign-in button. Use the Web application client ID accepted by auth-service's `GOOGLE_WEB_CLIENT_ID`, and add the exact website origin to its authorized JavaScript origins in Google Cloud. This public identifier is returned by `/api/session/google-config`; no OAuth client secret is used. Existing accounts with 2FA still complete the authenticator step, and inactive accounts are rejected. Email/phone login remains available if Google is unconfigured or unavailable.

`NEXT_PUBLIC_GOOGLE_MAPS_KEY` enables the signed-in interactive route map. Restrict it by this website's origin and enable Maps JavaScript API. Website place search is public through a bounded, rate-limited `/geo/public/search` gateway endpoint; all other geo and booking routes retain authentication. The geo service needs its own `GOOGLE_MAPS_API_KEY` for place search and driving routes. `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` is optional for standard markers. Configure `NEXT_PUBLIC_APP_STORE_URL` and `NEXT_PUBLIC_PLAY_STORE_URL` when the mobile store listings are published.

## Scope

- Public pages: home, about, investors, business, support, and app download.
- Client pages: sign in, registration, place search, route and fare preview, ride or delivery request, active/past journey list, journey details with recorded rider movement and text chat, client cancellation and completion.
- The client proxy explicitly allows only the routes these pages need. Rider and business actions direct visitors to the mobile app.

Visitors can search and select places without signing in. Clicking “Plan your journey” saves those choices and verifies the session before opening planning. Guests go to `/login?next=/ride`, then return to the planner with their locations after password/Google login and any required 2FA. The planner and actual booking still require a session. The website shows API errors and does not substitute demo journeys or fake prices. If the Maps browser key is absent, the booking form still works with the API route estimate, and the map panel explains the missing configuration. Rider GPS upload, pairing, wallet settlement and other mobile-only controls remain in the mobile app.

Support submissions use `POST /api/support` on this Next.js server, which forwards to the gateway's `POST /support/requests` endpoint. The user service stores requests in MongoDB. Staff can retrieve them from the gateway's authenticated `GET /support/requests` endpoint. The form works for signed-out visitors, including business and investor inquiries. Do not collect passwords or payment PINs in support messages.

Build and type-check with `npm run build` and `npm run typecheck`.
