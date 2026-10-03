# IEEE MUST Student Branch — Admin Dashboard

The content management dashboard for the [IEEE MUST Student Branch website](https://github.com/M7mdA13/IEEE-WEBSITE2026). Board members sign in here to update what the public site shows — executive committee, committees, events, partners, gallery, website team, recruitment status, and the mailing list — without touching code or redeploying.

> This is the `dashboard` branch of the project repo. The public site lives on `main` and the API on `backend`.

## Stack

React 19 · Vite · React Router 7 · Axios · Recharts · Cloudinary · vanilla CSS with custom properties · Font Awesome. Deployed on Vercel.

## Getting started

Requires **Node 18+** and a running instance of the project's API (see the `backend` branch).

```bash
git clone -b dashboard https://github.com/M7mdA13/IEEE-WEBSITE2026.git
cd IEEE-WEBSITE2026
npm install
```

Create a `.env` in the project root with the variables below, then:

```bash
npm run dev       # Vite dev server
npm run build     # production build
npm run preview   # serve the build locally
npm run lint      # ESLint
```

Sign in with an admin account from the API's database. If you're starting from an empty database, the backend's `npm run seed` creates the first superadmin.

### Environment variables

| Variable                        | Required | Notes                                            |
| ------------------------------- | -------- | ------------------------------------------------ |
| `VITE_API_URL`                  | yes      | Base URL of the API, no trailing slash            |
| `VITE_CLOUDINARY_CLOUD_NAME`    | yes      | Cloudinary account that receives image uploads    |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | yes      | An **unsigned** upload preset                     |

`VITE_*` values are inlined into the client bundle at build time and are therefore public. Never put a private key — a Cloudinary API secret, a database URI — behind a `VITE_` prefix; unsigned presets exist precisely so the browser can upload without one.

Both the local dev origin and the deployed dashboard URL have to be listed in the API's `ALLOWED_ORIGINS`, or every request fails CORS.

## Sections

| Route                     | What it manages                                        |
| ------------------------- | ------------------------------------------------------ |
| `/login`                  | Sign in                                                 |
| `/signup`                 | Create an account                                       |
| `/dashboard/overview`     | Stats and recent activity                               |
| `/dashboard/committees`   | Committees and their heads                              |
| `/dashboard/events`       | Events                                                  |
| `/dashboard/members`      | Executive committee                                     |
| `/dashboard/partners`     | Partner organizations                                   |
| `/dashboard/website-team` | Website team credits                                    |
| `/dashboard/recruitment`  | Open or close recruitment and set the message shown     |
| `/dashboard/mailing-list` | Subscribers collected by the public site                |
| `/dashboard/gallery`      | Gallery images                                          |
| `/dashboard/analytics`    | Recharts visualizations                                 |
| `/dashboard/settings`     | Your own profile and password                           |
| `/dashboard/users`        | Admin accounts — **superadmin only**                    |

## How it works

**Auth.** Logging in calls the API, which sets an httpOnly session cookie. Axios is configured with `withCredentials: true` so that cookie rides along on every request — no token is stored in JavaScript. A `localStorage` flag only drives the client-side redirect; the real check is server-side on every call. A response interceptor in [`src/api/index.js`](src/api/index.js) catches any `401`, clears the flag, and bounces you to `/login`, so an expired session can't leave you on a half-broken screen.

**Images.** Uploads go from the browser straight to Cloudinary using an unsigned preset ([`src/utils/cloudinary.js`](src/utils/cloudinary.js)), into the `ieee-must` folder; only the resulting URL is saved through the API. Files are compressed client-side first ([`src/utils/imageCompressor.js`](src/utils/imageCompressor.js)). Image bytes never pass through the API or the database.

**Roles.** Accounts are `admin` or `superadmin`. The Users section is hidden from the sidebar for non-superadmins and the API enforces the same rule server-side.

## Project structure

```text
src/
├── api/index.js          # Axios instance, credentials, 401 interceptor
├── components/
│   ├── dashboard/        # One component per section
│   └── layout/           # Sidebar, Navbar, Toast
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Dashboard.jsx     # Layout + nested section routes
├── styles/
├── utils/                # Cloudinary upload, image compression, toasts, URLs
├── App.jsx               # Routing and route guards
└── main.jsx              # Entry point
```

`vercel.json` rewrites all paths to `index.html` so client-side routing survives a hard refresh on any URL.

## Contributing

Branch off `dashboard` and open pull requests against it. New sections follow the existing shape: a component in `src/components/dashboard/`, a nested route in `Dashboard.jsx`, and an entry in the sidebar's nav list.

Never commit a `.env` or paste a key, connection string, or password into source.
