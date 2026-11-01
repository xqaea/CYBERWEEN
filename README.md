# CYBERWEEN 2026 — The Haunted World of Computer Science

A responsive Halloween-themed Computer Science activity built with Next.js, React, TypeScript, Tailwind CSS and Lucide icons. Designed for deployment on Vercel.

## Included experiences

- **Haunted Home:** responsive landing page, animated portal, feature cards and event branding.
- **Cyber Escape Room:** three answer-based challenges (binary/ASCII, phishing identification, firewall concept), hints, XP and replay.
- **Spooky Quiz Arena:** five multiple-choice Computer Science and cybersecurity questions, feedback, progress and scoring.
- **AI Witch:** randomized, name-personalized fictional fortunes. This is a client-side entertainment feature, not a connected AI model.
- **Leaderboard:** demo entries plus scores saved in the current browser's local storage.

## Requirements

- Node.js 20.9 or newer
- npm
- GitHub account (for Git-based Vercel deployment)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Extract this project and push the folder contents to a new GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Keep the detected framework as **Next.js** and use the default build settings.
5. Select **Deploy**. No environment variables are required for the included features.
6. Every subsequent push to the connected branch triggers a new deployment.

## Important implementation notes

- The included leaderboard is browser-local. It is suitable for a demo or single-device activity, but it is **not a shared leaderboard** across students or devices.
- To make rankings shared, connect Supabase (or another database) and create a server-side API for validated score submissions. Never trust XP submitted directly by a browser.
- The AI Witch currently uses a deterministic/randomized fortune bank and does not call an AI provider. To add real AI, create a server-side Route Handler (for example `app/api/fortune/route.ts`) and keep the provider key in a server-only environment variable.
- For a public event, add moderation, rate limiting, anti-cheat validation and privacy notice before collecting student names or other personal data.
- Google Fonts are loaded remotely; system sans-serif fallbacks remain available if the font service is blocked.

## Project structure

```text
cyberween-2026/
├── app/
│   ├── globals.css       # Theme, responsive layout and animations
│   ├── layout.tsx        # Root layout and metadata
│   └── page.tsx          # Main application and interactive experiences
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Suggested next production upgrades

1. Supabase authentication and shared leaderboard.
2. Admin dashboard to edit missions, questions and event settings.
3. QR-code check-in and team mode.
4. Real AI fortune generation through a protected server endpoint.
5. Event analytics and downloadable results.
