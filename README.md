# IEEE MUST Student Branch — Website

The official website, admin dashboard, and REST API for the IEEE MUST Student Branch.

The site is a React single-page app backed by a Node/Express + MongoDB API. Content that changes often — executive committee, committees, events, members, partners, gallery, recruitment status — is served from the database and edited through a separate admin dashboard, so the site can be updated without a redeploy.

## Repository layout

This repo keeps the three parts of the project on **separate branches** rather than in one tree:

| Branch      | What it holds        | Stack                                    | Deployed on |
| ----------- | -------------------- | ---------------------------------------- | ----------- |
| `main`      | Public website       | React 19, Vite, Framer Motion, GSAP, Three.js | Vercel  |
| `dashboard` | Admin dashboard      | React 19, Vite, Axios, Recharts           | Vercel      |
| `backend`   | REST API             | Node, Express 4, Mongoose 8, MongoDB      | Railway     |

Check out the branch for the part you want to work on:

```bash
git checkout backend    # or: main, dashboard
```

## Features

**Public site** — animated landing page, About with an interactive solar-system section, committee and event listings, membership and recruitment info, and an "Ask AI" assistant that answers questions about the branch using live data from the database.

**Admin dashboard** — JWT-protected panel for managing ExCom, committees, members, events, partners, gallery, website team, and the mailing list, plus analytics and user management for superadmins. Images are uploaded straight to Cloudinary from the browser.

**API** — public read-only endpoints for the website and JWT-guarded admin endpoints for the dashboard, with Helmet, CORS allowlisting, and rate limiting on auth.

## Getting started

Requires **Node 18+** and a MongoDB database (Atlas or local).

Each branch is its own npm project. Clone once, then check out the branch you need:

```bash
git clone https://github.com/M7mdA13/IEEE-WEBSITE2026.git
cd IEEE-WEBSITE2026
npm install
```

Create a `.env` file in the branch root (see the variables below — `.env` is gitignored and must never be committed), then:

```bash
npm run dev      # main / dashboard — Vite dev server
npm run dev      # backend — nodemon on http://localhost:5000
```

To run the whole stack locally, clone the repo into separate folders — one per branch — and start the backend first, then point each frontend's `VITE_API_URL` at it.

### Environment variables

**`backend`**

| Variable          | Required | Notes                                                        |
| ----------------- | -------- | ------------------------------------------------------------ |
| `MONGODB_URI`     | yes      | MongoDB connection string                                     |
| `JWT_SECRET`      | yes      | Signing secret for admin tokens — use a long random value     |
| `JWT_EXPIRES_IN`  | no       | Token lifetime, defaults to `7d`                              |
| `ALLOWED_ORIGINS` | yes      | Comma-separated origins allowed by CORS (your frontend URLs)  |
| `GROQ_API_KEY`    | yes      | Powers the AI assistant (`llama-3.1-8b-instant` via Groq)     |
| `PORT`            | no       | Defaults to `5000`                                            |
| `NODE_ENV`        | no       | Defaults to `development`                                     |

**`main`**

| Variable       | Required | Notes                                         |
| -------------- | -------- | --------------------------------------------- |
| `VITE_API_URL` | yes      | Base URL of the API, with no trailing slash    |

**`dashboard`**

| Variable                        | Required | Notes                                       |
| ------------------------------- | -------- | ------------------------------------------- |
| `VITE_API_URL`                  | yes      | Base URL of the API                          |
| `VITE_CLOUDINARY_CLOUD_NAME`    | yes      | Cloudinary account for image uploads         |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | yes      | An **unsigned** upload preset                |

`VITE_*` values are inlined into the client bundle at build time and are therefore public — never put a private key behind a `VITE_` prefix.

### Seeding

The backend ships a seed script for populating an empty database:

```bash
npm run seed
```

## API overview

Base URL: `<API>/api`

| Route                | Auth      | Purpose                                                     |
| -------------------- | --------- | ----------------------------------------------------------- |
| `GET  /health`       | none      | Health check                                                 |
| `POST /admin/auth/login` | none  | Returns a JWT — rate limited to 20 requests / 15 min         |
| `/public/*`          | none      | Read-only content for the website                            |
| `/admin/*`           | JWT       | Full CRUD for the dashboard                                  |

Both `/public` and `/admin` expose the same resources: `excom`, `committees`, `members`, `events`, `pages`, `recruitment`, `partners`, `mailing-list`, `website-team`, and `gallery`. `/public/ai/chat` backs the site's AI assistant. Admin routes authenticate with an httpOnly session cookie, falling back to an `Authorization: Bearer <token>` header for API clients.

## Project structure

The public site (`main`):

```text
src/
├── api/public.js        # Fetch helpers for the public API
├── components/          # Navbar, Footer, cursor, backgrounds, AI button
├── data/                # Static fallback content (committees, events)
├── pages/               # Home, About, Committees, Committee, Events,
│                        # Membership, AIAssistant, NotFound
├── styles/
├── utils/               # Cloudinary URL helpers
├── App.jsx              # Routing
└── main.jsx             # Entry point
```

The dashboard (`dashboard`) follows the same shape, with `components/dashboard/` holding one section per resource and `components/layout/` holding the sidebar, navbar, and toasts.

The API (`backend`):

```text
config/       # DB connection, CORS allowlist
controllers/  # One controller per resource
middleware/   # JWT auth, 404, error handler
models/       # Mongoose schemas
routes/
├── admin/    # JWT-guarded CRUD
└── public/   # Read-only + AI chat
scripts/      # seed.js
server.js     # Entry point
```

## Contributing

Branch off the branch you're changing (`main`, `dashboard`, or `backend`), keep changes scoped to that one part, and open a pull request against the same branch.

Before you commit: never add a `.env` file or paste a key, connection string, or token into source — everything secret is read from the environment, and it should stay that way.

## About

Built and maintained by the Website Team of the IEEE MUST Student Branch.

- [Facebook](https://www.facebook.com/IEEEMUST.egy)
- [Instagram](https://www.instagram.com/ieeemust/)
- [LinkedIn](https://www.linkedin.com/company/mustieeesb/)
- [TikTok](https://www.tiktok.com/@ieee.must.sb)
