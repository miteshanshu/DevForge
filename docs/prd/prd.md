# DevForge: Product Requirements Document (V1)

## Overview
This PRD outlines the revised V1 scope for **DevForge**. It focuses on Developer Identity, Project Showcasing, "Build in Public" loops, and community interaction.

---

## 1. Authentication
**Goals:** Provide frictionless onboarding while maintaining security.
* **User Stories:**
  * As a developer, I can sign up/login using GitHub or Google so my profile info is automatically imported.
  * As a user, I can sign up using my email and password.
* **Acceptance Criteria:**
  * GitHub/Google OAuth pulls `username` (or name), `avatar_url`, and `email`.
  * JWT-based authentication stored in `HttpOnly` cookies.
  * Unified login/signup modal.
* **Validation Rules:**
  * Passwords must be at least 8 characters.
  * Emails must be unique.
* **Edge Cases:** User signs up with email, then later clicks "Login with GitHub" using the same email. The system must seamlessly link the accounts.
* **Permissions:** Publicly accessible.
* **Dependencies:** GitHub/Google OAuth Applications, `Users` table.

## 2. Developer Profiles
**Goals:** Serve as the central hub for a developer's identity, skills, and platform activity.
* **User Stories:**
  * As a user, I can edit my bio, location, technical skills, and external social links.
  * As a visitor, I can view a developer's Projects, Build Logs, and Contribution Score.
* **Acceptance Criteria:**
  * Profile URL structure: `/u/[username]`.
  * Displays the calculated Contribution Score prominently.
  * Displays a chronologically sorted activity feed.
* **Validation Rules:**
  * Username must be unique, alphanumeric, no spaces, max 20 chars.
  * Bio limited to 255 characters.
* **Edge Cases:** Fetching a profile that doesn't exist returns a custom 404 "Developer Not Found" page.
* **Permissions:** Viewing is public. Editing restricted to the profile owner.
* **Dependencies:** Projects, Posts, Contribution Score logic.

## 3. Projects
**Goals:** Allow developers to showcase their portfolio and tech stack.
* **User Stories:**
  * As a developer, I can create a new project listing.
  * As a visitor, I can browse projects and filter them by tech stack.
* **Acceptance Criteria:**
  * Project creation requires: Title, Description, and at least one Tag.
  * Optional fields: Repository URL, Live URL, Cover Image.
  * Dedicated project page (`/project/[slug]`) showcasing details and associated Build Logs.
* **Validation Rules:**
  * Title max 60 characters.
  * URLs must pass basic format validation.
  * Image uploads limited to 5MB (Azure Blob).
* **Edge Cases:** Two projects with the same name. (System must auto-append a unique hash to the URL slug).
* **Permissions:** Viewing is public. Editing/Deleting restricted to the project owner.
* **Dependencies:** Tags, Azure Blob Storage.

## 4. Build Logs (Project Updates)
**Goals:** Enable "build in public" as the primary engagement loop.
* **User Stories:**
  * As a project owner, I can post a build log update to document my progress.
  * As a visitor, I can view a chronological timeline of updates on a project page.
  * As a user, I can see recent build log updates in the platform's global feed.
* **Acceptance Criteria:**
  * Build Logs belong to a specific Project.
  * Supports rich text (Markdown) and up to 4 image attachments.
  * Features a "Milestone" flag (e.g., "v1.0", "Beta Released") to highlight major updates.
  * Rendered as a vertical timeline on the Project page.
* **Validation Rules:**
  * Content must not be empty.
* **Edge Cases:** Deleting a project cascades to delete all associated build logs and images.
* **Permissions:** Only the project owner can create/edit logs. Viewing and commenting is public/registered respectively.
* **Dependencies:** Projects, Azure Blob Storage.

## 5. Posts
**Goals:** Facilitate community discussions, questions, and knowledge sharing.
* **User Stories:**
  * As a user, I can create a post categorized as a Discussion, Question, or Showcase.
  * As a user, I can browse a feed of recent posts.
* **Acceptance Criteria:**
  * Supports Markdown formatting (rendered safely).
  * Post `Type` is a required enum (`DISCUSSION`, `QUESTION`, `SHOWCASE`).
  * Displayed in the global feed alongside Build Logs.
* **Validation Rules:**
  * Title max 100 characters. Content min 20 characters.
  * Max 5 tags per post.
* **Edge Cases:** Rendering malicious markdown (must use `DOMPurify` or similar on the backend before saving).
* **Permissions:** Registered users can create. Viewing is public.
* **Dependencies:** Tags.

## 6. Comments
**Goals:** Enable asynchronous discussions on Posts and Build Logs.
* **User Stories:**
  * As a user, I can leave a comment on a Post or a Build Log.
  * As a user, I can delete my own comment.
* **Acceptance Criteria:**
  * Flat structure (single-level) for V1 to optimize development time.
  * Displays author information and timestamp.
* **Validation Rules:**
  * Comment text must not be empty and max 1000 characters.
* **Edge Cases:** User deletes an entity (Post/Build Log) while someone is typing a comment. (API should return a clear 404 error gracefully handled by the frontend).
* **Permissions:** Registered users can comment. Owners can delete.
* **Dependencies:** Posts, Build Logs.

## 7. Reactions
**Goals:** Provide lightweight, low-friction engagement.
* **User Stories:**
  * As a user, I can react to Posts, Build Logs, and Comments.
* **Acceptance Criteria:**
  * Implemented as a toggle (click to add, click to remove).
  * Supported types for V1: `LIKE`, `CELEBRATE`, `ROCKET`.
* **Validation Rules:**
  * A user can only have one reaction of a specific type per entity.
* **Edge Cases:** Rapid clicking of the reaction button (requires frontend debouncing and optimistic UI updates).
* **Permissions:** Registered users only.
* **Dependencies:** None.

## 8. Tags
**Goals:** Provide a structured taxonomy for content discovery.
* **User Stories:**
  * As a user, I can attach tags to my Projects and Posts.
* **Acceptance Criteria:**
  * Admin-managed predefined list for V1 (e.g., `React`, `System Design`, `Open Source`) to prevent fragmentation and duplicate tags.
* **Validation Rules:**
  * Maximum 5 tags per entity.
* **Edge Cases:** None.
* **Permissions:** System Admins can create tags. Users apply them.
* **Dependencies:** Projects, Posts.

## 9. Search
**Goals:** Allow users to discover specific content and people.
* **User Stories:**
  * As a user, I can search for developers, projects, and posts.
* **Acceptance Criteria:**
  * Unified global search bar.
  * Results are grouped into distinct categories (Users, Projects, Posts).
  * Uses PostgreSQL `ILIKE` pattern matching for V1.
* **Validation Rules:**
  * Minimum 3 characters to trigger an API search request.
* **Edge Cases:** Search query with special characters (must be properly escaped to prevent SQL syntax errors).
* **Permissions:** Public.
* **Dependencies:** PostgreSQL indexing on title and username columns.

## 10. Notifications
**Goals:** Drive user retention by highlighting relevant interactions.
* **User Stories:**
  * As a user, I want to know when someone interacts with my content.
* **Acceptance Criteria:**
  * In-app dropdown showing recent notifications.
  * Triggered by: Comments on owned entities, Reactions on owned entities.
  * Fetched asynchronously via polling (e.g., every 60s) or on page load (no WebSockets for V1).
* **Validation Rules:**
  * System must not generate a notification if a user reacts to their own post.
* **Edge Cases:** Large notification queues. (API must paginate or limit to top 50 unread).
* **Permissions:** Registered users only.
* **Dependencies:** Comments, Reactions.

## 11. Contribution Score
**Goals:** Incentivize high-value activity natively without complex gamification.
* **User Stories:**
  * As a user, I want my profile score to reflect my effort on the platform.
* **Acceptance Criteria:**
  * Score is a single integer value on the `User` table.
  * Automatically incremented/decremented within database transactions during actions.
  * Point values: 
    * Create Project: +20
    * Add Build Log: +10
    * Create Post: +10
    * Write Comment: +2
* **Validation Rules:**
  * Minimum score is 0.
  * If an entity is deleted (e.g., user deletes their post), the corresponding points must be deducted to prevent "spam-and-delete" farming.
* **Edge Cases:** Concurrent actions causing race conditions on score updates. (Must use atomic database increments `UPDATE Users SET score = score + 10`).
* **Permissions:** System managed.
* **Dependencies:** Core interaction modules.

## 12. Current Status
Phase 1 (Architecture), Phase 2 (Authentication), and Phase 3.5 (Landing Page & Global UI) are complete. The project is currently transitioning into Phase 4 (Projects & Showcases).

