# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Project Structure

```text
IEEE-WEBSITE-main/
├── public/                 # Static assets (images, icons, etc.)
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   ├── AskAIFAB.jsx    # Floating Action Button for AI
│   │   ├── Footer.jsx      # Footer component
│   │   ├── Icons.jsx       # Icon definitions
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── SheryCursor.jsx # Custom cursor component
│   │   └── SparklesHero.jsx# Hero section animation
│   ├── data/               # Project data files
│   │   ├── committees.js   # Committee information
│   │   └── events.js       # Event descriptions
│   ├── pages/              # Page components
│   │   ├── AIAssistant/    # AI Assistant interface
│   │   ├── About/          # About section
│   │   ├── Committee/      # Specific committee details
│   │   ├── Committees/     # List of committees
│   │   ├── Events/         # Events listing
│   │   ├── Home/           # Landing page
│   │   └── Membership/     # Membership information
│   ├── App.jsx             # Main application component & routing
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── vercel.json             # Vercel deployment config
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

