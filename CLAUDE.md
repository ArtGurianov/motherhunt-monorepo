# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a pnpm monorepo for the Motherhunt project, a web3 fashion street scouting marketplace. The repository contains two Next.js applications and several shared packages managed by Turborepo.

## Package Manager

**Required**: pnpm v8.15.6+

- The repository enforces pnpm usage via preinstall script
- Node.js >=18 is required

## Monorepo Structure

### Applications

- `apps/mhnt` - Main application (Next.js 15, runs on port 443 with HTTPS)
- `apps/motherhunt` - Marketing/landing site (Next.js 15, runs on port 3000)

### Shared Packages

- `packages/db` - Prisma database schema and client (MongoDB)
- `packages/ui` - Shared UI components (shadcn/ui)
- `packages/eslint-config` - Shared ESLint configuration
- `packages/typescript-config` - Shared TypeScript configuration

## Common Commands

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
cd apps/mhnt && pnpm dev
cd apps/motherhunt && pnpm dev

# Run build
pnpm build

# Run linter
pnpm lint
```

### Database (Prisma)

```bash
# Generate Prisma client (run from root)
pnpm db:generate

# Push schema to database
pnpm db:push

# Format Prisma schema
cd packages/db && pnpm db:format
```

### Code Formatting

```bash
# Check formatting
pnpm format

# Fix formatting issues
pnpm format:fix
```

### Working with shadcn/ui Components

```bash
# Add a new UI component to the shared package
pnpm dlx shadcn@latest add button -c apps/web
```

Components are placed in `packages/ui/src/components` and imported as:

```tsx
import { Button } from "@shared/ui/components/button";
```

## Main App (mhnt) Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: better-auth with custom plugins (admin, organization, magic link, captcha)
- **Database**: MongoDB via Prisma
- **State Management**: TanStack Query (React Query) with localStorage persistence
- **Web3**: Wagmi + Reown AppKit (formerly WalletConnect)
- **Internationalization**: next-intl
- **Styling**: Tailwind CSS 4
- **Email**: Nodemailer
- **Form Handling**: react-hook-form + zod
- **File Upload**: Cloudinary

### Directory Structure (`apps/mhnt/src`)

#### `/app` - Next.js App Router

- Route groups for role-based access:
  - `(with-settings)/(main)/(daog)` - MyDAOGs admin routes
  - `(with-settings)/(main)/(headbooker)` - Agency head booker routes
  - `(with-settings)/(main)/(booker)` - Regular booker routes
  - `(with-settings)/(main)/(user)` - Regular user routes
- Each route group has its own layout with authorization checks

#### `/actions` - Server Actions

Server actions for mutations and API calls (e.g., `acceptInvitation.ts`, `createDraft.ts`, `sendEmail.ts`)

#### `/data` - Data Fetching Layer

Server-side data fetching functions organized by domain:

- `session/` - Session management
- `drafts/` - Draft model lots
- `agencyBookers/` - Agency booker management
- `invitationDetails/` - Invitation handling

#### `/components` - React Components

Reusable UI components and widgets

#### `/lib` - Utilities and Configuration

- `auth/` - Authentication setup, permissions, roles
  - `auth.ts` - Main better-auth configuration
  - `authClient.ts` - Client-side auth utilities
  - `permissions/` - Access control definitions (app-level and org-level)
  - `dbHooks/` - Database hooks for session/user lifecycle
  - `plugins/` - Custom better-auth plugins
- `config/` - Environment configuration
- `db.ts` - Prisma client instance
- `hooks/` - React hooks (TanStack Query hooks)
- `schemas/` - Zod validation schemas
- `utils/` - Utility functions
- `web3/` - Web3/blockchain integration
- `routes/` - Route definitions and navigation

### Authentication & Authorization

The app uses better-auth with a complex multi-role system:

**App-level roles** (stored in User model):

- `MYDAOGS_ADMIN_ROLE` - MyDAOGs platform admin
- `PROJECT_SUPERADMIN_ROLE` - Project super admin
- `PROJECT_ADMIN_ROLE` - Project admin
- `USER_ROLE` - Default user

**Organization-level roles** (stored in Member model):

- `OWNER_ROLE` - Organization owner (head booker)
- `MEMBER_ROLE` - Organization member (booker)

**Organization types**:

- `SCOUTING` - Default scouting organization
- `AGENCY` - Model agency organization

Sessions are extended with custom fields:

- `activeOrganizationId`, `activeMemberId`, `activeOrganizationRole` - Current org context
- Session management handles organization switching

### Key Patterns

**Server-side data fetching**: Data is fetched using server components and server functions in `/data`, then exposed via API routes for client-side TanStack Query hooks in `/lib/hooks`.

**Authentication flow**:

1. Magic link authentication (email-based)
2. Session created with user role and recent organization context
3. Database hooks populate session fields on create/update
4. Access control enforced via better-auth AC system

**State persistence**: TanStack Query uses localStorage persister (`REACT_QUERY_OFFLINE_CACHE`) for offline-first experience.

**Internationalization**: The app supports multiple locales via next-intl. Locale is stored in user preferences.

**Web3 integration**: Wagmi config with custom chain, Reown AppKit for wallet connection, smart contract interactions for on-chain lot verification.

### Environment Variables

Required environment variables are documented in `apps/mhnt/.env.example`:

- Database: `DATABASE_URL`
- Auth: `BETTER_AUTH_SECRET`
- Email: `NODEMAILER_USER`, `NODEMAILER_APP_PASSWORD`
- Captcha: `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`, `HCAPTCHA_SECRET_KEY`
- Web3: `NEXT_PUBLIC_REOWN_PROJECT_ID`, contract addresses
- File uploads: Cloudinary credentials
- VK OAuth: `NEXT_PUBLIC_VK_CLIENT_ID`, `VK_CLIENT_SECRET`

### Database Schema (Prisma)

**Core models**:

- `User` - User accounts with app role, recent org context, model/agency associations
- `Session` - Sessions with active org context
- `Organization` - Agencies or scouting orgs
- `Member` - User-organization memberships with org roles
- `Invitation` - Pending invitations to join organizations
- `Lot` - Model/talent profiles (scouted individuals)
- `Account` - OAuth accounts for authentication

**Key relationships**:

- Users can be members of multiple organizations
- Users have a "recent organization" that becomes their active org on login
- Lots are created by scouts (users) and can be signed by agencies
- Organizations use the better-auth organization plugin system

### Testing & Seeding

Seed script available at `apps/mhnt/scripts/seed.ts`:

```bash
cd apps/mhnt && pnpm seed
```

## Important Notes

1. **Monorepo Plugin**: The mhnt app uses `@prisma/nextjs-monorepo-workaround-plugin` in `next.config.mjs` to ensure Prisma client works correctly in the monorepo.

2. **HTTPS in Development**: Both apps run with `--experimental-https` flag. The mhnt app runs on port 443.

3. **React Query SSR**: The query client is initialized with SSR-safe defaults (staleTime, no refetch on mount/reconnect). Persistence is client-side only.

4. **SVG Handling**: Custom webpack config uses @svgr/webpack to import SVGs as React components (with `?url` suffix for URL imports).

5. **Cross-subdomain Cookies**: Auth cookies are set with cross-subdomain support for `mhnt.app` domain in production.

6. **Turbo Framework Inference**: Turbo commands use `--framework-inference=false` flag.

7. **Server-only Code**: Data fetching functions use `"server-only"` directive to ensure they never run on client.

## Turborepo Task Dependencies

Build tasks depend on `^build` and `^db:generate` (Prisma client generation must happen before building).
Dev tasks depend on `^db:generate` only.
