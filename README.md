# Front-end Kanban Board

**Feature Sliced Design** built as a complete front solution

**Live Demo:** [https://kanban-mu-ten.vercel.app/]

## Tech Stack & Architecture

The project is built on a standard **3-Tier Architecture (Client-Server-Database)** using the latest tools in the React ecosystem:

- **Framework:** Next.js (App Router, Serverless API Routes)
- **Database (BaaS):** Supabase (relational database)
- **State Management & Data Fetching:** TanStack Query (React Query v5)
- **Drag and Drop Engine:** @dnd-kit (with custom optimistic updates)
- **Styling:** Tailwind CSS
- **Architecture Methodology:** **Feature Sliced Design**
- **Language:** TypeScript

## Architectural Concept (Feature Sliced Design)

1. `app/` — Global providers, layouts, and server-side API endpoints (`/api/boards`, `/api/cards`, `/api/lists`)
2. `widgets/` — Self-contained, high-level UI components (`BoardView`, `ListColumn`, `CardItem`)
3. `features/` — Interactive user actions. The core feature is `drag-card`
4. `entities/` — Core business entities (`board`, `list`, `card`). They are isolated, have no "peripheral vision" and contain only their own types, clean Axios requests, and React Query hooks
5. `shared/` — Reusable infrastructure code (Supabase client initialization, centralized `queryKeys` configuration)

## Key Engineering Solutions & Features

### 1. Optimistic Updates via React Query

When dragging and dropping cards, the UI reflects changes instantly without waiting for a server response. Using `queryClient.setQueryData`, the cache state updates immediately. If the server throws a `500` error, the hook automatically triggers a rollback to the last stable state

### 2. Centralized Cache Management (`queryKeys`)

All query keys are extracted into a single source of truth within the `shared` layer. This completely eliminates UI sync bugs caused by typos ("magic strings") during query invalidation across different modules

### 3. Secure Backend via Next.js API Routes

All critical business logic and data validation happen strictly on the server side

### 4. Bulletproof Data Security (Environment Variables)

All sensitive API keys and database URLs for Supabase are fully decoupled from the codebase using environment variables (`.env.local`) and secured via `.gitignore`. Only clean, production-ready code hits GitHub
