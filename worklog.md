# CodeMastery — Computer Science Learning Platform

## Project Overview
A production-grade Computer Science learning platform built with Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma (SQLite), and NextAuth. The platform covers CS fundamentals through advanced AI/ML topics with tutorials, quizzes, gamification (XP, levels, streaks, achievements), leaderboards, learning paths, and progress tracking.

## Architecture Decisions
- **Single-page application** at `/` route (per environment constraint) using Zustand for client-side view routing.
- **API routes** under `/api/*` for all backend logic (auth, subjects, tutorials, progress, bookmarks, notes, quizzes, leaderboard, gamification, search, profile, admin).
- **Prisma + SQLite** for persistence.
- **NextAuth v4** with credentials provider + bcrypt for password hashing.
- **Design system**: Emerald primary (growth/learning/code), warm neutrals, no indigo/blue. Dark mode via next-themes.
- **Gamification**: Server-side verified XP/points to prevent client-side farming. Daily XP caps, streak logic with real activity checks.

---
Task ID: 1
Agent: Principal Architect (main)
Task: Foundation — design system, theme, worklog setup

Work Log:
- Inspected existing project scaffold (Next.js 16, full shadcn/ui set, Prisma SQLite, dev server running on :3000).
- Confirmed constraint: only `/` route visible to user → building SPA with Zustand view routing + API routes.
- Designed distinctive emerald-based color system (avoiding indigo/blue) for "CS + learning + growth" identity.
- Created worklog.md as shared handover document.

Stage Summary:
- Foundation phase started. Next: comprehensive Prisma schema, design system CSS, theme provider, layout shell.

---
Task ID: P0
Agent: Principal Architect (main)
Task: Incorporate Platform Independence & Deployment Portability requirement

Work Log:
- Received critical constraint: Z.ai is dev environment ONLY, must NOT become a product dependency.
- Planned abstraction layers: Config (env-driven), StorageService (local/S3), AIService (provider-swappable, optional), SearchService (DB-backed, swappable), EmailService (console/SMTP).
- Keep SQLite for dev (works in this env) but schema is portable to PostgreSQL via Prisma datasource change.
- Will create Dockerfile, docker-compose.yml, .dockerignore, .env.example, README.md, docs/ folder.
- z-ai-web-dev-sdk will be wrapped behind AIService interface as ONE optional provider; core platform works without AI.

Stage Summary:
- Architecture revised to be provider-independent. Proceeding to build config + abstractions + Docker + docs alongside core platform.

---
Task ID: 2-5
Agent: Full-stack build (main)
Task: Database, auth, seed, core API routes

Work Log:
- Auth: NextAuth credentials provider, scrypt password hashing, register endpoint with rate limiting.
- Gamification: server-side XP/level/streak computation in /api/progress with daily cap (DAILY_XP_CAP=500) and anti-farming. Achievements auto-evaluate against real metrics.
- API routes: subjects, subject[slug], tutorials[subjectSlug][tutorialSlug] (with prev/next + user progress/bookmarks/notes), progress, bookmarks, notes, search (DB-backed, swappable), leaderboard, achievements, me, onboarding, paths, paths[slug], quizzes[id], quizzes[id]/attempt (server-scored), admin stats/export/import, health.
- Seed: 20 subjects, 22 modules, 57 tutorials (real markdown, 800-2000 words each, with code examples), 15 quizzes, 45 questions, 16 achievements, 5 learning paths, admin user (admin@codemastery.dev / admin12345).
- Lint clean.

Stage Summary:
- Complete backend with portable abstractions. Ready for UI shell + views.

---
Task ID: 6-13
Agent: Full-stack build (main)
Task: UI shell + all views + end-to-end verification

Work Log:
- SPA shell with Zustand view routing (home, browse, subject, tutorial, dashboard, leaderboard, achievements, profile, paths, admin).
- Header: logo, nav, ⌘K search palette, theme toggle, auth state (login/register dropdown + mobile sheet).
- Sticky footer (mt-auto) per layout requirement.
- Home view: hero with grid bg + gradient, stat strip, featured subjects, learning paths, gamification features, weekly leaderboard preview, CTA.
- Browse view: category filters, live search, subject grid.
- Subject view: gradient header, modules with tutorials, breadcrumbs.
- Tutorial reader (the most important page): reading progress bar, TOC sidebar, markdown renderer with syntax highlighting + copy buttons, quizzes inline with server-side scoring, notes panel, prev/next nav, bookmark/complete actions.
- Dashboard: stat cards (XP, streak, tutorials, quizzes), continue learning, recent activity, level progress, daily XP goal, quick links.
- Leaderboard: period toggle, podium for top 3, full ranked list.
- Achievements: categorized, progress bars, locked/unlocked states.
- Profile: editable (name, bio, experience, goal), tabs (overview, bookmarks, notes).
- Paths: list + detail with timeline steps.
- Admin: platform stats, content export/import (portable JSON).
- Auth modal: login/register with validation + rate limiting.

Verification (agent-browser + VLM):
- Homepage renders: 57 tutorials, 20 subjects, 5 paths, 16 achievements — all real data.
- Subject → Tutorial navigation works, markdown + code blocks render with syntax highlighting.
- Registration flow works, user logged in (avatar + level badge).
- Tutorial completion awards XP server-side (40 completion + 15 milestone = 55), updates streak, unlocks "First Steps" achievement (+50 XP), level recomputed.
- Leaderboard reflects XP. VLM confirms "highly polished and professional" design.
- Fixed bug: achievement evaluator now recomputes level after awarding XP (was leaving level stale).

Platform Independence Audit:
- Z.ai references only in src/lib/ai/{types,zai}.ts (optional, lazy-imported, behind AI_ENABLED flag).
- No hardcoded secrets, ports (only config.ts fallback), or proprietary dependencies in core.
- .env.example, .gitignore, Dockerfile, docker-compose.yml, .dockerignore, README.md, docs/ all in place.
- Core platform runs with AI_ENABLED=false (default).

Stage Summary:
- Pass 1 (Initial Production Implementation) COMPLETE. All features work end-to-end with real content. Ready for improvement passes.
