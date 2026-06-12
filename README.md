# DevForge

> 🚧 **Work in Progress**
> DevForge is currently under active development. Features, APIs, and UI may change as the platform evolves.

### Current Status
- ✅ **Phase 1 (Completed):** Architecture design, monorepo scaffolding (Turborepo, Next.js, Express), and Prisma database schema migration & seeding.
- ✅ **Phase 2 (Completed):** Authentication (Email/Password, JWT, GitHub OAuth, Google OAuth).
- ✅ **Phase 3 (Completed):** Developer Profiles (Bio, Skills, Social Links, Activity Feed).
- ✅ **Phase 3.5 (Completed):** Global Navigation UI, Zustand Auth Sync, and Landing Page Overhaul.
- 🔄 **Phase 4 (In Progress):** Project Showcases (Create/Edit Projects, List Projects).
- 📅 **Upcoming:** Build Logs and Social Features.

---

The **Unified Developer Ecosystem** where developers learn, build, share, collaborate, and grow without leaving the platform. 

DevForge brings together the best features of code hosting, Q&A, discussions, and developer networking into a single, cohesive experience.

---

## 🏗 Architecture (V1)

DevForge is built using a **Modular Monolith** architecture to optimize for speed, simplicity, and a seamless developer experience. The repository is managed as an npm workspace orchestrated by **Turborepo**.

### Tech Stack
- **Frontend:** Next.js 15 (App Router), React, TailwindCSS, Shadcn UI
- **Backend API:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma 7 (with `@prisma/adapter-pg`)
- **Storage:** Azure Blob Storage (for media and assets)

---

## 📁 Repository Structure

```text
e:\devForge\
├── apps/
│   ├── api/                  # Express REST API
│   │   ├── src/
│   │   │   ├── controllers/  # Route controllers
│   │   │   ├── middleware/   # Express middleware
│   │   │   ├── routes/       # API route definitions
│   │   │   ├── schemas/      # Zod validation schemas
│   │   │   └── utils/        # Utility functions
│   │   └── package.json
│   └── web/                  # Next.js 15 Frontend
│       ├── public/           # Static assets
│       ├── src/
│       │   ├── app/          # Next.js app router pages
│       │   ├── components/   # React components
│       │   ├── lib/          # Utilities and API client
│       │   └── stores/       # Zustand state stores
│       └── package.json
├── docs/                     # Documentation
│   ├── architecture/         # System architecture walkthroughs
│   ├── database/             # DB schema design
│   ├── decisions/            # Architecture Decision Records (ADRs)
│   ├── prd/                  # Product Requirements Document
│   └── roadmap/              # Project Roadmap
├── packages/                 # Shared Monorepo Packages
│   ├── config/               # Shared configuration (ESLint, TSConfig)
│   ├── db/                   # Prisma schema, migrations, and database client
│   ├── shared/               # Shared utilities and constants
│   └── types/                # Shared TypeScript definitions
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── turbo.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v22.x recommended)
- **npm** (v10.x or higher)
- **PostgreSQL Database** (A free [Neon.tech](https://neon.tech) database is highly recommended for serverless scaling)

### 1. Clone & Install
```bash
git clone https://github.com/miteshanshu/DevForge.git
cd DevForge
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env` at the root of the repository:
```bash
cp .env.example .env
```
Fill in the `DATABASE_URL` with your Neon PostgreSQL connection string (ensure it includes `&pgbouncer=true` if using the pooled connection).

### 3. Database Setup
Navigate to the database package to apply the migrations and seed the initial data:
```bash
cd packages/db
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
cd ../..
```

### 4. Start Development
Run the entire stack concurrently using Turborepo from the root directory:
```bash
npx turbo dev
```
- **Frontend** will be available at: `http://localhost:3000`
- **Backend API** will be available at: `http://localhost:5000`

---

## 📖 Documentation
For deeper dives into the architectural decisions and product requirements, check the `/docs` directory:
- [Product Requirements Document (PRD)](./docs/prd/prd.md)
- [Database Schema & Design](./docs/database/database_design.md)
- [Architecture Decision Records (ADRs)](./docs/decisions/)

---

*DevForge - Built for developers, by developers.*

