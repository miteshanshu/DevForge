# DevForge: Prisma Schema & Database Design

## 1. Complete Prisma Schema

Below is the production-ready Prisma schema incorporating all requirements, including explicit relations, JSONB support for notifications, views for the unified feed, and future-proofing tables (Bookmarks, Mentions).

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["views", "fullTextSearchPostgres"]
}

// -----------------------------------------------------------------------------
// 2. ENUM DEFINITIONS
// -----------------------------------------------------------------------------

enum Role {
  USER
  MODERATOR
  ADMIN
}

enum ContributorRole {
  OWNER
  MAINTAINER
  CONTRIBUTOR
}

enum BuildLogStatus {
  UPDATE
  MILESTONE
  RELEASE
}

enum ProjectStatus {
  IDEA
  BUILDING
  BETA
  PRODUCTION
  ARCHIVED
}

enum PostType {
  DISCUSSION
  QUESTION
  SHOWCASE
}

enum ReactionType {
  LIKE
  CELEBRATE
  ROCKET
}

enum NotificationType {
  NEW_COMMENT
  NEW_FOLLOWER
  REACTION
  MENTION
  SYSTEM
}

enum EntityType {
  POST
  PROJECT
  BUILD_LOG
  USER
  COMMENT
  MILESTONE
  COMMUNITY_POST
  ANNOUNCEMENT
}

// -----------------------------------------------------------------------------
// 3. CORE MODELS & RELATIONS
// -----------------------------------------------------------------------------

model User {
  id              String         @id @default(uuid()) @db.Uuid
  email           String         @unique
  username        String         @unique
  passwordHash    String?
  githubId        String?        @unique
  name            String?
  bio             String?        @db.VarChar(255)
  score           Int            @default(0)
  
  settings        UserSettings?
  avatar          Media?         @relation("UserAvatar")
  
  projects        Project[]
  contributions   ProjectContributor[]
  buildLogs       BuildLog[]
  posts           Post[]
  comments        Comment[]
  reactions       Reaction[]
  
  followers       Follows[]      @relation("Following")
  following       Follows[]      @relation("Followers")
  
  notificationsReceived Notification[] @relation("NotificationRecipient")
  notificationsTriggered Notification[] @relation("NotificationActor")
  
  mediaUploaded   Media[]        @relation("UploadedMedia")
  bookmarks       Bookmark[]
  mentions        Mention[]
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  deletedAt       DateTime?

  @@index([username])
  @@index([email])
}

model UserSettings {
  id                  String   @id @default(uuid()) @db.Uuid
  userId              String   @unique @db.Uuid
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  emailNotifications  Boolean  @default(true)
  theme               String   @default("system")
  onboardingCompleted Boolean  @default(false)
  profileVisibility   String   @default("public") // e.g., "public", "private"
}

model Follows {
  followerId  String @db.Uuid
  followingId String @db.Uuid
  follower    User   @relation("Followers", fields: [followerId], references: [id], onDelete: Cascade)
  following   User   @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@id([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

model Project {
  id              String         @id @default(uuid()) @db.Uuid
  title           String         @db.VarChar(60)
  slug            String         @unique
  description     String
  repositoryUrl   String?
  liveUrl         String?
  projectStatus   ProjectStatus  @default(IDEA)
  
  ownerId         String         @db.Uuid
  owner           User           @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  
  coverImage      Media?         @relation("ProjectCover")
  
  contributors    ProjectContributor[]
  buildLogs       BuildLog[]
  tags            Tag[]
  bookmarks       Bookmark[]
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  deletedAt       DateTime?

  @@index([slug])
}

model ProjectContributor {
  id        String          @id @default(uuid()) @db.Uuid
  projectId String          @db.Uuid
  userId    String          @db.Uuid
  role      ContributorRole @default(CONTRIBUTOR)
  
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([projectId, userId])
}

model BuildLog {
  id          String         @id @default(uuid()) @db.Uuid
  projectId   String         @db.Uuid
  authorId    String         @db.Uuid
  content     String         @db.Text
  status      BuildLogStatus @default(UPDATE)
  
  project     Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)
  author      User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  images      Media[]        @relation("BuildLogMedia")
  comments    Comment[]
  reactions   Reaction[]
  tags        Tag[]
  bookmarks   Bookmark[]
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  deletedAt   DateTime?

  @@index([projectId])
  @@index([authorId])
  @@index([createdAt(sort: Desc)])
}

model Post {
  id          String   @id @default(uuid()) @db.Uuid
  title       String   @db.VarChar(100)
  slug        String   @unique
  content     String   @db.Text
  type        PostType @default(DISCUSSION)
  
  authorId    String   @db.Uuid
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  images      Media[]  @relation("PostMedia")
  comments    Comment[]
  reactions   Reaction[]
  tags        Tag[]
  bookmarks   Bookmark[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([slug])
  @@index([authorId])
  @@index([createdAt(sort: Desc)])
}

model Media {
  id             String   @id @default(uuid()) @db.Uuid
  url            String
  mimeType       String
  size           Int      // Size in bytes
  
  uploadedById   String   @db.Uuid
  uploadedBy     User     @relation("UploadedMedia", fields: [uploadedById], references: [id], onDelete: Cascade)
  
  // Explicit Nullable Relations for Entities
  postId         String?  @db.Uuid
  post           Post?    @relation("PostMedia", fields: [postId], references: [id], onDelete: SetNull)
  
  buildLogId     String?  @db.Uuid
  buildLog       BuildLog? @relation("BuildLogMedia", fields: [buildLogId], references: [id], onDelete: SetNull)
  
  userAvatarId   String?  @unique @db.Uuid
  userAvatar     User?    @relation("UserAvatar", fields: [userAvatarId], references: [id], onDelete: SetNull)
  
  projectCoverId String?  @unique @db.Uuid
  projectCover   Project? @relation("ProjectCover", fields: [projectCoverId], references: [id], onDelete: SetNull)

  createdAt      DateTime @default(now())
}

model Comment {
  id          String   @id @default(uuid()) @db.Uuid
  content     String   @db.Text
  
  authorId    String   @db.Uuid
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  postId      String?  @db.Uuid
  post        Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  buildLogId  String?  @db.Uuid
  buildLog    BuildLog? @relation(fields: [buildLogId], references: [id], onDelete: Cascade)
  
  reactions   Reaction[]
  mentions    Mention[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  // Note: No soft delete as per requirements (deleted comments are hard deleted)

  @@index([postId])
  @@index([buildLogId])
}

model Reaction {
  id          String       @id @default(uuid()) @db.Uuid
  type        ReactionType
  
  userId      String       @db.Uuid
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  postId      String?      @db.Uuid
  post        Post?        @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  buildLogId  String?      @db.Uuid
  buildLog    BuildLog?    @relation(fields: [buildLogId], references: [id], onDelete: Cascade)
  
  commentId   String?      @db.Uuid
  comment     Comment?     @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime     @default(now())
  // Note: No soft delete for reactions

  @@unique([userId, type, postId])
  @@unique([userId, type, buildLogId])
  @@unique([userId, type, commentId])
}

model Tag {
  id          String     @id @default(uuid()) @db.Uuid
  name        String     @unique
  slug        String     @unique
  description String?
  
  projects    Project[]
  posts       Post[]
  buildLogs   BuildLog[]
}

model Notification {
  id          String           @id @default(uuid()) @db.Uuid
  recipientId String           @db.Uuid
  actorId     String           @db.Uuid
  type        NotificationType
  
  entityType  EntityType
  entityId    String           @db.Uuid
  metadata    Json?            @db.JsonB       // JSON payload for future expansion
  
  isRead      Boolean          @default(false)
  
  recipient   User             @relation("NotificationRecipient", fields: [recipientId], references: [id], onDelete: Cascade)
  actor       User             @relation("NotificationActor", fields: [actorId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime         @default(now())

  @@index([recipientId, isRead])
}

// -----------------------------------------------------------------------------
// 4. FUTURE-PROOFING MODELS
// -----------------------------------------------------------------------------

model Bookmark {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @db.Uuid
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  postId      String?  @db.Uuid
  post        Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  projectId   String?  @db.Uuid
  project     Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)

  buildLogId  String?  @db.Uuid
  buildLog    BuildLog? @relation(fields: [buildLogId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@unique([userId, postId])
  @@unique([userId, projectId])
  @@unique([userId, buildLogId])
}

model Mention {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @db.Uuid
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  commentId   String?  @db.Uuid
  comment     Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
}

// -----------------------------------------------------------------------------
// 5. UNIFIED FEED VIEW
// -----------------------------------------------------------------------------

view UnifiedFeed {
  id          String     @unique @db.Uuid // Represents the underlying entity's ID
  entityType  EntityType
  entityId    String     @db.Uuid
  authorId    String     @db.Uuid
  createdAt   DateTime
}
```

---

## 4. Constraints (Raw SQL Migrations Required)

To guarantee data consistency beyond Prisma's capability, I will implement the following `CHECK` constraints using a raw SQL migration immediately after initializing the schema:

1. **Comment Entity Check:**
   Ensures a comment is attached to exactly one entity type.
   ```sql
   ALTER TABLE "Comment" ADD CONSTRAINT check_comment_target CHECK (num_nonnulls("postId", "buildLogId") = 1);
   ```

2. **Reaction Entity Check:**
   Ensures a reaction is attached to exactly one entity type.
   ```sql
   ALTER TABLE "Reaction" ADD CONSTRAINT check_reaction_target CHECK (num_nonnulls("postId", "buildLogId", "commentId") = 1);
   ```

3. **Bookmark Entity Check:**
   Ensures a bookmark targets exactly one entity type.
   ```sql
   ALTER TABLE "Bookmark" ADD CONSTRAINT check_bookmark_target CHECK (num_nonnulls("postId", "projectId", "buildLogId") = 1);
   ```

4. **Media Entity Check:**
   A media item can optionally belong to at most one target entity (it can belong to none temporarily while uploading).
   ```sql
   ALTER TABLE "Media" ADD CONSTRAINT check_media_target CHECK (num_nonnulls("postId", "buildLogId", "userAvatarId", "projectCoverId") <= 1);
   ```

---

## 5. Indexes (GIN & FTS Strategy)

For blazing-fast PostgreSQL Full Text Search without external infrastructure, I will use another raw SQL migration to build GIN indexes over generated `tsvector` data:

1. **Project FTS Index:**
   ```sql
   CREATE INDEX project_fts_idx ON "Project" USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
   ```

2. **Post FTS Index:**
   ```sql
   CREATE INDEX post_fts_idx ON "Post" USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
   ```

3. **Build Log FTS Index:**
   ```sql
   CREATE INDEX buildlog_fts_idx ON "BuildLog" USING GIN (to_tsvector('english', coalesce(content, '')));
   ```

---

## 6. Migration Strategy

To execute this architecture properly for a V1 launch:

1. **Step 1: Prisma Initialization**
   Run `npx prisma migrate dev --create-only --name init` to generate the standard relational schema.

2. **Step 2: Add Unified Feed View (Raw SQL)**
   Modify the generated migration file to construct the `UnifiedFeed` view before it's executed:
   ```sql
   CREATE VIEW "UnifiedFeed" AS
   SELECT id, 'POST'::"EntityType" AS "entityType", id AS "entityId", "authorId", "createdAt" 
   FROM "Post" WHERE "deletedAt" IS NULL
   UNION ALL
   SELECT id, 'BUILD_LOG'::"EntityType" AS "entityType", id AS "entityId", "authorId", "createdAt" 
   FROM "BuildLog" WHERE "deletedAt" IS NULL;
   ```

3. **Step 3: Add Check Constraints & FTS Indexes (Raw SQL)**
   Append the `ALTER TABLE` checks and `CREATE INDEX` queries defined above to the same initial migration.

4. **Step 4: Execute & Generate**
   Run `npx prisma migrate dev` to apply the migrations to Neon.
   Run `npx prisma generate` to build the TypeScript client containing the `UnifiedFeed` view and all explicit models.

---

## 7. Prisma Best Practices (For the Developer)

* **Soft Delete Handling:** When querying `User`, `Project`, `Post`, or `BuildLog`, use a Prisma Client Extension to automatically attach `where: { deletedAt: null }` so deleted entities never leak into the UI.
* **Pagination:** Utilize Prisma's cursor-based pagination (`cursor`, `take`, `skip: 1`) on the `UnifiedFeed` model to guarantee stable infinite scrolling across chronological feeds.
* **Transactions:** When creating a Project or Post, wrap the Entity Creation, Tag Attachment, and Media Linking inside a `$transaction` to ensure atomic consistency.
* **Notifications payload:** Storing data in `JSONB` allows inserting stringified React component props or dynamic links without modifying the schema later.

## User Review Required
Please review the Prisma schema above. It incorporates all your requested modifications: the standalone `Media` table, `UserSettings`, expanded `Notification` payload, `UnifiedFeed` view, and future-proofing structures. If everything is perfect, you now have the complete foundational architecture and database layer necessary to begin execution!

