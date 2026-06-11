# ADR 0002: Modular Monolith

## Status
Accepted

## Context
DevForge has a wide scope (Auth, Users, Projects, Posts, Build Logs, Reactions, Notifications). I need an architectural pattern that supports this complexity without overwhelming a single developer.

## Decision
I will use a **Modular Monolith** pattern housed within an **npm workspaces + Turborepo** monorepo.
- Next.js 15 (App Router) for the frontend (`apps/web`).
- Express + Node.js for the backend API (`apps/api`).
- Shared Prisma schema and logic (`packages/db`, `packages/shared`).

## Consequences
- **Positive:** Single deployment pipeline for the backend (Railway) and frontend (Vercel).
- **Positive:** Type safety boundaries are preserved between frontend and backend via shared Zod schemas.
- **Negative:** Harder to scale individual backend processes independently, but perfectly acceptable for V1 traffic loads.

## Architecture Diagram

The following diagram illustrates the boundaries of the Modular Monolith within the Turborepo workspace. It highlights how the independent applications share business logic, types, and database access packages without requiring distributed microservices.

```mermaid
graph TD
    subgraph Monorepo ["Turborepo Monorepo"]
        
        subgraph Apps ["apps/"]
            Web["Web Frontend<br/>(Next.js 15)"]
            API["Backend API<br/>(Express.js)"]
        end

        subgraph Packages ["packages/"]
            DB["db<br/>(Prisma Client & Schema)"]
            Shared["shared<br/>(Zod Schemas & Utils)"]
            Types["types<br/>(Shared TS Types)"]
            Config["config<br/>(ESLint & TSConfig)"]
        end
        
    end

    Client(["User Browser"]) -->|"Renders UI"| Web
    Client -->|"REST /auth, /users"| API
    Web -->|"Server-Side Fetches"| API

    API -->|"Queries"| DB
    
    Web -.->|"Imports"| Shared
    API -.->|"Imports"| Shared
    
    Web -.->|"Imports"| Types
    API -.->|"Imports"| Types
    
    Web -.->|"Uses"| Config
    API -.->|"Uses"| Config
    DB -.->|"Uses"| Config
    
    DB -->|"TCP / pgBouncer"| Neon[(Neon PostgreSQL)]

    classDef app fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#fff;
    classDef pkg fill:#3f3f46,stroke:#27272a,stroke-width:2px,color:#fff;
    classDef ext fill:#0ea5e9,stroke:#0369a1,stroke-width:2px,color:#fff;

    class Web,API app;
    class DB,Shared,Types,Config pkg;
    class Neon ext;
```

