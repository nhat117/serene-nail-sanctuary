# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estique — a luxury nail salon website. Single-page application with smooth-scroll navigation between sections and a dedicated `/services` route. Built with Vite + React + TypeScript, styled with Tailwind CSS and shadcn/ui.

## Commands

- `npm run dev` — Start dev server on port 8080
- `npm run build` — Production build (output: `dist/`)
- `npm run build:dev` — Development build
- `npm run lint` — ESLint
- `npm run test` — Run tests once (Vitest)
- `npm run test:watch` — Run tests in watch mode

## Architecture

**Routing** (`src/App.tsx`): React Router v6 with BrowserRouter. Two routes: `/` (Index) and `*` (NotFound). New routes go above the catch-all. In-page navigation uses smooth scroll to element IDs (e.g., `#about`, `#services`, `#contact`), while the "Services" link navigates to `/services` via React Router `<Link>`.

**Page composition** (`src/pages/Index.tsx`): The homepage assembles layout and section components in order: TopBar → Navbar → HeroSection → AboutSection → ServicesSection → Footer. Each section is a standalone component in `src/components/`.

**UI components** (`src/components/ui/`): shadcn/ui components (Radix UI primitives + Tailwind). Configured via `components.json` with `rsc: false`. Add new components with `npx shadcn-ui@latest add <component>`.

**Styling**: Tailwind CSS with HSL CSS custom properties defined in `src/index.css`. Colors are referenced as `hsl(var(--primary))` etc. in `tailwind.config.ts`. Dark mode is class-based (`.dark` on root).

- Typography: `Noto Serif` for headings, `Manrope` for body (loaded via Google Fonts in `index.css`)
- Custom animations: `fadeUp`, `float` variants defined in `src/index.css` (`animate-fade-up`, `animate-float`, etc.)

**Path alias**: `@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

**State management**: React Query (`@tanstack/react-query`) for server state, local `useState` for UI state. Toast notifications via Sonner and Radix Toast (both mounted in `App.tsx`).

**Testing**: Vitest with jsdom environment and React Testing Library. Setup file at `src/test/setup.ts`. Test files use pattern `src/**/*.{test,spec}.{ts,tsx}`.

**Icons**: `lucide-react` for icon components.
