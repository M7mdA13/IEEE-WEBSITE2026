# IEEE MUST Student Branch — Website Project Plan

**Competition Deadline:** April 25, 2026
**Stack:** React 19 + Vite 8 + plain CSS (no Tailwind/Bootstrap)
**Goal:** Implement Figma designs page by page in React, then improve directly in code.
**Deployment:** Vercel (free tier, for testing/review by leads) — real domain to be configured later.

---

## Environment

- **Node:** v24.14.1 ✅
- **npm:** v11.11.0 ✅
- **React:** 19 | **Vite:** 8

> Run `npm install` inside the root app folder, then `npm run dev`.

---

## Architecture — Single Unified React App

The project was originally split into 4 separate Vite apps (home-page/, AI-ASSISTANT/, EVENT-PAGE/, Membership-page/).
**This is being consolidated into one single React app** with React Router. Reasons:
- Dark mode and other state persist across navigation
- Navbar/Footer/shared components defined once, not duplicated
- Single `npm install` and `npm run build`
- Clean single-project Vercel deployment
- React Router enables proper `<Link>` navigation (no full page reloads)

### Target Folder Structure

```
IEEE-WEBSITE/
├── public/
│   └── images/                  ← all assets (consolidated from all sub-apps)
├── src/
│   ├── main.jsx
│   ├── App.jsx                  ← BrowserRouter + route definitions
│   ├── styles/
│   │   └── globals.css          ← CSS vars, resets, font imports, shared utilities
│   ├── components/              ← shared across every page
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── AskAIFAB.jsx
│   │   └── Icons.jsx
│   └── pages/                   ← one folder per route
│       ├── Home/
│       │   ├── index.jsx
│       │   ├── SparklesHero.jsx
│       │   └── Home.css
│       ├── About/
│       │   ├── index.jsx
│       │   └── About.css
│       ├── Committees/
│       │   ├── index.jsx
│       │   └── Committees.css
│       ├── Committee/           ← /committees/:slug (ai, cyber, embedded, etc.)
│       │   ├── index.jsx
│       │   └── Committee.css
│       ├── Events/
│       │   ├── index.jsx
│       │   └── Events.css
│       ├── Membership/
│       │   ├── index.jsx
│       │   └── Membership.css
│       └── AIAssistant/
│           ├── index.jsx
│           └── AIAssistant.css
├── vercel.json                  ← rewrites all paths to index.html (SPA routing)
├── index.html
└── package.json
```

### Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About Us |
| `/committees` | Committees overview |
| `/committees/:slug` | Individual committee page |
| `/events` | Events |
| `/membership` | Membership |
| `/ai-assistant` | AI Chatbot |

---

## Pages — Status & Scope

| Page | Status | Notes |
|------|--------|-------|
| Home | 🔄 Hero done, rest needed | SparklesHero exists, need remaining sections |
| About Us | ❌ Not started | |
| Committees (overview) | ❌ Not started | |
| Committee (individual) | ❌ Not started | ~10 committees: AI, Cyber, Embedded, EMBS, Branding, HR, Marketing, Multimedia, PR, Web |
| Events | 🔄 Stub exists | EventsPage.jsx in EVENT-PAGE/ sub-app |
| Membership | 🔄 Stub exists | MembershipPage.jsx in Membership-page/ sub-app (currently shows "recruitment closed") |
| AI Assistant | 🔄 Stub exists | AiAssistantPage.jsx in AI-ASSISTANT/ sub-app |

---

## What Exists (Pre-Consolidation)

### Shared Components (each duplicated across 4 apps — will be unified)

**Navbar.jsx**
- Sticky with scroll detection (`slidedown` class)
- Mobile hamburger menu with animation
- Dark/light mode toggle (desktop + mobile)
- Links currently use `<a href>` — will be converted to React Router `<Link>`

**Footer.jsx**
- Logo, nav links, contact info
- Social icons: Facebook, Instagram, LinkedIn, TikTok
- Real contact: must@ieee.org.eg / +20 120 654 7195
- Social links still `#` placeholders

**AskAIFAB.jsx**
- Floating robot button (bottom-right)
- Will navigate to `/ai-assistant`

**Icons.jsx**
- CalendarIcon, LocationIcon (SVG components)

### Page Components (stubs — to be redone per Figma)

**SparklesHero.jsx** (Home)
- TSParticles (1200 particles, click-to-push, color adapts to dark/light)
- Animated IEEE MUST logo + title

**AiAssistantPage.jsx**
- Robot icon, greeting, search input, suggestion pills
- Will connect to an AI endpoint (backend TBD)

**EventsPage.jsx**
- "Upcoming Events" + "Past Events" sections
- EventCard component with date, location, description, image

**MembershipPage.jsx**
- "Recruitment is currently closed" status
- Email notification form ("Notify me")

---

## Styling Approach

- **No CSS framework** — plain CSS only
- **Per-page CSS files** colocated in each page folder (e.g. `Home.css`)
- **`globals.css`** for shared: CSS variables (colors, fonts, spacing), resets, typography
- **Fonts:** Krona One, Raleway, Montserrat (Google Fonts via index.html)
- **Icons:** FontAwesome 6.4 (CDN via index.html)
- **Dark mode:** `document.body.classList` toggle + `.dark-mode` CSS overrides, persisted in localStorage

### Color Palette (from existing code — verify against Figma)
- Primary blue: `#054377`
- Accent cyan: `#00d2ff` / `#3fd7f6`
- Background light: `#F9F8F6`
- Background dark: (TBD from Figma)

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `react`, `react-dom` | UI framework |
| `react-router-dom` | Client-side routing (to be added) |
| `@tsparticles/react`, `tsparticles` | Particle effects in hero |

**No Tailwind, no Redux, no external UI library.**

---

## Figma

- **Link:** https://www.figma.com/design/Q4MoDns9q5UVhlWHjZCbj1/ieee-website-2026
- **Note:** Only designs near the bottom of the Figma file are the new ones — upper frames are old site or inspiration.
- Workflow: share screenshot / export specs for each section as we implement it.

---

## Deployment

- **Platform:** Vercel (free tier)
- **Purpose:** Testing & lead review before going live
- **Real domain:** Already owned, configured later
- **SPA routing:** Requires `vercel.json` with rewrite rule so React Router works on direct URL access

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Backend / API

- No database planned for now
- AI Assistant will call an external AI endpoint (details TBD)
- Membership form may POST to a simple endpoint (TBD)
- Everything else is static

---

## Implementation Order (suggested)

1. **Consolidate** — merge 4 sub-apps into single app, install react-router-dom, wire up routes
2. **Home page** — implement all sections top-to-bottom per Figma
3. **Events page** — implement per Figma
4. **Committees overview** — implement per Figma
5. **Individual committee pages** — implement template + populate data
6. **About page** — implement per Figma
7. **Membership page** — implement per Figma
8. **AI Assistant page** — implement UI + wire to endpoint
9. **Polish** — animations, responsiveness, dark mode, cross-browser
10. **Deploy to Vercel** — test, share with leads

---

## Legacy Pages (Reference Only)

`/ieee` directory = old static HTML + PHP pages. Use these as **content reference** (copy, images, team info, committee descriptions). Do not migrate the code.

Committees in legacy: AI, Cybersecurity, Embedded Systems, EMBS, Branding, HR, Marketing, Multimedia, PR, Web Dev.

---

## Open Questions

1. ~~Figma link~~ ✅ Provided
2. ~~Pages scope~~ ✅ Building full site
3. ~~Routing type~~ ✅ Separate pages (React Router)
4. ~~Backend~~ ✅ Mostly static, AI endpoint TBD, no DB
5. ~~AI button~~ ✅ Opens AI chatbot at /ai-assistant
6. ~~Deployment~~ ✅ Vercel free tier for testing
7. **Real social media URLs** — need Facebook, Instagram, LinkedIn, TikTok links for Footer
8. **Committee list** — confirm exact list of committees and their slugs
9. **Figma mobile designs** — are there mobile/responsive designs in Figma?
10. **AI endpoint** — what API will the chatbot call? (OpenAI, Claude, custom?)
