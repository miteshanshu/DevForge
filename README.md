# DevForge

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
│   ├── api/            # Express REST API
│   └── web/            # Next.js 15 Frontend
├── packages/
│   ├── config/         # Shared configuration (ESLint, TSConfig)
│   ├── db/             # Prisma schema, migrations, and database client
│   ├── shared/         # Shared utilities and constants
│   └── types/          # Shared TypeScript definitions
└── docs/               # Architecture Decision Records (ADRs) and PRD
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

