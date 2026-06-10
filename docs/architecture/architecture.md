# DevForge: Execution Foundation Plan (Final)

## 1. Final Repository Structure
We will use an **npm workspaces** monorepo supercharged with **Turborepo** for caching and orchestration.
```text
e:\devForge\
  ├── apps/
  │   ├── web/            # Next.js 15, Tailwind, Shadcn, Zustand, React Query
  │   └── api/            # Express, Node.js, Zod, Controllers, Services
  ├── packages/
  │   ├── config/         # Shared ESLint, Prettier, TypeScript configs
  │   ├── db/             # Prisma schema, migrations, seed scripts, generated client
  │   ├── types/          # Shared interfaces, enum exports
  │   └── shared/         # Zod schemas, constants, generic utilities
  ├── docs/
  │   ├── architecture/
  │   ├── database/
  │   ├── prd/
  │   ├── roadmap/
  │   └── decisions/      # Architecture Decision Records (ADRs)
  ├── package.json        # npm workspaces config
  ├── turbo.json          # Turborepo configuration
  ├── tsconfig.base.json  # Root TS configuration
  ├── .prettierrc         # Global Prettier rules
  ├── .lintstagedrc       # lint-staged config
  ├── .husky/             # Git hooks
  └── .env                # Centralized environment variables
```

## 2. Development Workflow
* **Bootstrapping:** Run `npm install` at the root.
* **Local Development:** Run `npx turbo dev` at the root. Turborepo will orchestrate starting Next.js and Express while caching builds.
* **Database Management:** Run `npx turbo db:push` to sync Prisma schema changes across the workspace.

## 3. Branch Strategy
* `main`: Production-ready code. Auto-deploys.
* `dev`: Primary integration branch. Auto-deploys to staging.
* `feat/[module]`: Working branches.
* `fix/[issue]`: Bug fixes.

## 4. Commit Conventions
Following **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).

## 5. Implementation Roadmap (Days 0-7)

### **Day 0: Repository + Docs + GitHub**
* Initialize Git repo and `.gitignore`.
* Scaffold `docs/` folder structure (ADRs, PRD, Database, Architecture).
* Write `README.md`, `ROADMAP.md`, and initial ADRs (e.g., Modular Monolith).
* Initial Git commit.

### **Day 1: Monorepo + Turbo + Prisma + Neon**
* Scaffold monorepo via npm workspaces.
* Configure `turbo.json`.
* Initialize `packages/db` with Prisma. Write the finalized schema, verify Neon connection, run migration, and seed DB.

### **Day 2: Email Auth + JWT**
* Basic Express API initialization (`apps/api`).
* Implement Email + Password registration and login flows.
* Set up JWT creation and `HttpOnly` cookie validation.

### **Day 3: Profiles**
* Next.js 15 initialization (`apps/web`).
* Implement Developer Profile APIs and UI.

### **Day 4: Projects**
* Project CRUD APIs and creation wizard UI.

### **Day 5: Build Logs**
* Build Log creation and timeline rendering.

### **Day 6: Feed**
* Scaffold `UnifiedFeed` database view and global feed rendering.

### **Day 7: Search + Notifications**
* FTS search implementation and notification polling.
