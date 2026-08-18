# IEEE MUST Student Branch — API

REST API powering the [IEEE MUST Student Branch](https://github.com/M7mdA13/IEEE-WEBSITE2026) website and admin dashboard.

Node + Express + MongoDB. It exposes two surfaces: a read-only `/api/public` tree consumed by the website, and a JWT-guarded `/api/admin` tree consumed by the dashboard. Content the branch updates regularly — ExCom, committees, members, events, partners, gallery, recruitment status — lives in the database so the site changes without a redeploy.

> This is the `backend` branch of the project repo. The public site lives on `main` and the admin dashboard on `dashboard`.

## Stack

Express 4 · Mongoose 8 · MongoDB · JSON Web Tokens · bcrypt · Helmet · express-rate-limit · express-validator · Cloudinary · Groq (AI assistant). Deployed on Railway.

## Getting started

Requires **Node 18+** and a MongoDB database (Atlas or local).

```bash
git clone -b backend https://github.com/M7mdA13/IEEE-WEBSITE2026.git
cd IEEE-WEBSITE2026
npm install
```

Create a `.env` in the project root with the variables below, then:

```bash
npm run dev     # nodemon, http://localhost:5000
npm start       # plain node, for production
```

Confirm it's up with `GET /api/health`.

### Environment variables

| Variable          | Required | Notes                                                       |
| ----------------- | -------- | ----------------------------------------------------------- |
| `MONGODB_URI`     | yes      | MongoDB connection string                                    |
| `JWT_SECRET`      | yes      | Signing secret for admin tokens — use a long random value    |
| `JWT_EXPIRES_IN`  | no       | Token lifetime, defaults to `7d`                             |
| `ALLOWED_ORIGINS` | yes      | Comma-separated origins allowed by CORS (your frontend URLs) |
| `GROQ_API_KEY`    | yes      | Powers the AI assistant (`llama-3.1-8b-instant`)             |
| `PORT`            | no       | Defaults to `5000`                                           |
| `NODE_ENV`        | no       | `development` adds stack traces to error responses           |

`.env` is gitignored and must stay that way — every secret is read from the environment.

### Seeding

```bash
npm run seed
```

**This drops and repopulates** the Committee, Member, Event, ExCom, Partner, Page, and RecruitmentStatus collections from the static data in the script, and creates one superadmin user if none exists. It is meant for bootstrapping an empty database, not for running against one with real content.

The seeded admin uses a placeholder password defined at the top of [`scripts/seed.js`](scripts/seed.js). **Change it immediately after first login**, and change it in the script before seeding anything that will be reachable from the internet.

## Architecture

```text
config/
├── db.js              # Mongoose connection
└── corsOptions.js     # Origin allowlist from ALLOWED_ORIGINS
controllers/           # One controller per resource
middleware/
├── auth.js            # JWT verification
├── notFound.js
└── errorHandler.js    # Normalizes Mongoose/Mongo/CORS errors
models/                # Mongoose schemas
routes/
├── admin/             # JWT-guarded CRUD
└── public/            # Read-only + AI chat
scripts/
└── seed.js
server.js              # Entry point
```

Request flow: Helmet → CORS allowlist → JSON/cookie parsing → route → `notFound` → `errorHandler`. Every response is JSON shaped as `{ success, ... }`; errors carry `{ success: false, message }` plus a `errors[]` array on validation failures.

`errorHandler` maps Mongoose `ValidationError` to 400, bad ObjectIds to 400, duplicate keys to 409, and rejected origins to 403, so controllers can just throw.

## Authentication

`POST /api/admin/auth/login` returns a JWT and sets it as an httpOnly cookie. Every `/api/admin/*` route runs through [`middleware/auth.js`](middleware/auth.js), which reads the token from that cookie first and falls back to an `Authorization: Bearer <token>` header for API clients like Postman. Invalid or expired tokens get a 401 with a distinguishing message.

Passwords are bcrypt-hashed (cost 12) and the hash is stripped from every serialized user. Users carry a role of `admin` or `superadmin`; user management endpoints check for `superadmin` in the controller.

Auth endpoints are rate limited to 20 requests per 15 minutes per IP.

## Endpoints

Base URL `<API>/api`.

### Public — no auth

| Method | Path                    | Purpose                                |
| ------ | ----------------------- | -------------------------------------- |
| GET    | `/health`               | Health check                            |
| GET    | `/public/excom`         | Executive committee                     |
| GET    | `/public/committees`    | All committees                          |
| GET    | `/public/committees/:slug` | One committee by slug                |
| GET    | `/public/members`       | Members                                 |
| GET    | `/public/events`        | Events                                  |
| GET    | `/public/events/:id`    | One event                               |
| GET    | `/public/partners`      | Partners                                |
| GET    | `/public/website-team`  | Website team                            |
| GET    | `/public/gallery`       | Gallery items                           |
| GET    | `/public/pages/:key`    | CMS page content by key                 |
| GET    | `/public/recruitment`   | Whether recruitment is open             |
| POST   | `/public/mailing-list`  | Subscribe an email                      |
| POST   | `/public/ai/chat`       | AI assistant — `{ message, history }`   |

### Admin — JWT required

| Method | Path                        | Purpose                              |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/admin/auth/login`         | Log in (unauthenticated)              |
| POST   | `/admin/auth/logout`        | Clear the session cookie              |
| POST   | `/admin/auth/register`      | Create an admin user                  |
| GET    | `/admin/auth/me`            | Current user                          |
| PATCH  | `/admin/auth/me`            | Update own profile                    |
| GET    | `/admin/auth/users`         | List users — superadmin only          |
| DELETE | `/admin/auth/users/:id`     | Delete a user — superadmin only       |
| GET    | `/admin/recruitment`        | Recruitment status                    |
| PUT    | `/admin/recruitment`        | Open or close recruitment             |
| GET    | `/admin/mailing-list`       | List subscribers                      |
| DELETE | `/admin/mailing-list/:id`   | Remove a subscriber                   |

The remaining admin resources — `excom`, `committees`, `members`, `events`, `pages`, `partners`, `website-team`, `gallery` — each expose standard CRUD:

| Method | Path                  |
| ------ | --------------------- |
| GET    | `/admin/<resource>`     |
| GET    | `/admin/<resource>/:id` |
| POST   | `/admin/<resource>`     |
| PUT    | `/admin/<resource>/:id` |
| DELETE | `/admin/<resource>/:id` |

Admin list endpoints return unpublished and inactive records too; the public equivalents filter to active content only.

## The AI assistant

`POST /api/public/ai/chat` backs the "Ask AI" feature on the website. On each request it pulls the current ExCom and committee heads from MongoDB and injects them into the system prompt, so answers reflect live data rather than anything baked in at build time. Completions run on Groq's `llama-3.1-8b-instant`.

## Images

Media is stored on Cloudinary, not in MongoDB. The dashboard uploads directly from the browser with an unsigned preset and sends the resulting URL here, so image bytes never pass through this API. [`scripts/migrate-to-cloudinary.js`](scripts/migrate-to-cloudinary.js) is a one-off for moving legacy base64 documents out of the database; it needs `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the environment.

## Contributing

Branch off `backend` and open pull requests against it. Add new resources by following the existing shape — a model, a controller, and a pair of route files under `routes/public/` and `routes/admin/` — and let `errorHandler` deal with the error responses.

Never commit a `.env` or paste a key, connection string, or password into source.
