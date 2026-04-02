# IEEE MUST Student Branch - Admin Dashboard

A modern React admin dashboard for IEEE MUST Student Branch management.

## Project Structure

```
ieee_dashboard/
├── public/
│   └── images/              # Logo and image assets
├── src/
│   ├── components/
│   │   ├── auth/            # Authentication components (future use)
│   │   ├── dashboard/       # Dashboard section components
│   │   │   ├── DashboardOverview.jsx   # Main dashboard with stats & recent events
│   │   │   ├── EventsSection.jsx       # Events management section
│   │   │   ├── MembersSection.jsx      # Members management section
│   │   │   ├── PartnersSection.jsx     # Partners management section
│   │   │   ├── AnalyticsSection.jsx    # Analytics & charts section
│   │   │   └── SettingsSection.jsx     # User settings section
│   │   └── layout/          # Layout components
│   │       ├── Sidebar.jsx              # Navigation sidebar
│   │       └── Navbar.jsx               # Top navigation bar
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Signup page
│   │   └── Dashboard.jsx     # Main dashboard layout
│   ├── styles/
│   │   ├── styles.css        # Main dashboard styles
│   │   ├── auth.css          # Authentication pages styles
│   │   └── AnalyticsSection.css # Standalone analytics styling
│   ├── App.jsx               # Main app with routing
│   └── main.jsx              # React entry point
├── index.html               # Vite entry HTML
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

## Features

- **Dashboard Overview** - Real-time stats cards and recent activity tracking
- **Events Management** - Full CRUD with local poster uploads, date/location tracking, and status management
- **Members Management** - Full CRUD member directory with local profile photo uploads and role/chapter separation
- **Partners Management** - Full CRUD for partner organizations with local logo upload support
- **Interactive Analytics** - Dynamic charts powered by Recharts (Member Growth, Event Participation, Chapter Distribution)
- **Local Upload System** - Seamless client-side image processing using FileReader (no backend storage required for demo)
- **Theme Engine** - Advanced light/dark mode with OKLCH color space for accessibility and visual excellence
- **Responsive Layout** - Collapsible sidebar and fluid grid system for all device sizes

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies (includes Recharts)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 18** - Core UI library
- **React Router DOM** - Application routing
- **Recharts** - Modern charting library for data visualization
- **Vite** - High-speed build tool
- **Vanilla CSS** - Theme-aware styling with custom properties (CSS Variables)
- **Font Awesome** - Comprehensive icon system

## Design System

- **Color Palette** - OKLCH color space for perceptually uniform colors
- **Typography Scale** - Fluid sizing with `clamp()` for responsive text
- **Spacing Scale** - Consistent spacing using CSS custom properties
- **Shadow System** - Layered shadows for realistic depth
- **Animations** - Purposeful transitions with spring easing

## Routes

| Route | Description |
|-------|-------------|
| `/login` | Login page |
| `/signup` | Signup page |
| `/dashboard` | Dashboard overview (default) |
| `/dashboard/events` | Events management |
| `/dashboard/members` | Members management |
| `/dashboard/partners` | Partners section |
| `/dashboard/analytics` | Analytics section |
| `/dashboard/settings` | Settings section |

## License

MIT License - IEEE MUST Student Branch
