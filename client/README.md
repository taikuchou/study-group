# Study Group Platform Starter

A minimal Vite + React + TypeScript setup with Tailwind and `lucide-react`, wired to render your `StudyGroupPlatform.tsx`.

## Prereqs
- Node.js 18+ (recommend 20 LTS). Check with `node -v` and `npm -v`.
- A package manager: npm (bundled with Node), or `pnpm` / `yarn` if you prefer.

## Install
```bash
# unzip this project, then inside the folder:
npm install
# or: pnpm install
```

## Run
```bash
npm run dev
# open the printed http://localhost:5173
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- If you see errors about missing modules (e.g. `lucide-react`), run `npm install` again.
- If you use ESLint or CRA configs elsewhere, make sure they aren't interfering. This repo doesn't include ESLint by default.
- Tailwind is already wired via `src/index.css` and `tailwind.config.ts`.
- Your uploaded file was placed at `src/components/StudyGroupPlatform.tsx` and rendered by `src/App.tsx`.
```
