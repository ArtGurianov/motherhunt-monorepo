# Product Requirements Document (PRD)

## Motherhunt Platform

Document Version: 2.0
Last Updated: October 18, 2025
Status: Living Document

---

## Product overview

Motherhunt is a web3 fashion street scouting marketplace connecting scouts who list potential talent (models) with agencies that evaluate and acquire those listings through an on-chain, incentives-aligned process.

The platform operates as a pnpm monorepo with a Next.js 15 application for authenticated workflows (mhnt) and a marketing site (motherhunt), integrating blockchain-based identity management, role-based organizations, and dividends distribution via the MyDAOgs ecosystem.

---

## Product identity

- Name: Motherhunt
- Type: Web3 Fashion-Tech Platform
- Primary Domain: motherhunt.com
- Web Application: mhnt.app
- Chain: Configurable via NEXT_PUBLIC_NETWORK environment variable; Sepolia used for development/testing

---

## Core value proposition

- Problem: Fashion scouting suffers from unclear compensation, lack of trust in talent confirmation, cross-border friction, and weak attribution for talent discovery.
- Solution: A dual-sided platform where scouts create model profiles (lots) that require model confirmation, agencies can whitelist and manage bookers, and blockchain provides transparent identity mapping and administrative controls with karma-based incentives.

---

## User roles and permissions

### Role Architecture

Motherhunt implements a sophisticated multi-layer role system:

1. **App-level roles** (stored in User.role field)
2. **Organization-level roles** (stored in Member.role field)
3. **Custom member roles** (derived from org type + org role combination)

### App-level Roles

Defined in `APP_ROLES` constant:

- `MYDAOGS_ADMIN_ROLE` - MyDAOGs ecosystem administrator with full control over project superadmins
- `PROJECT_SUPERADMIN_ROLE` - Motherhunt project superadmin with control over admins, scouters, models, and agencies
- `PROJECT_ADMIN_ROLE` - Motherhunt project admin with control over scouters, models, and agencies (but not other admins)
- `USER_ROLE` - Default authenticated user with ability to create organizations

### Organization-level Roles

Defined in `ORG_ROLES` constant:

- `OWNER_ROLE` - Organization owner with full control over members, invitations, and organization settings
- `MEMBER_ROLE` - Organization member with limited permissions based on org type

### Custom Member Roles (Product-facing)

These are derived roles combining org type and org role:

**For SCOUTING organizations:**
- `SCOUTER_ROLE` - OWNER_ROLE in SCOUTING org; can create and manage draft lots, send model confirmation requests
- `MODEL_ROLE` - MEMBER_ROLE in SCOUTING org; can sign lot confirmations, view their profile

**For AGENCY organizations:**
- `HEADBOOKER_ROLE` - OWNER_ROLE in AGENCY org; can manage bookers, invite/remove members, transfer ownership
- `BOOKER_ROLE` - MEMBER_ROLE in AGENCY org; can view selections, participate in agency workflows

### Role Permissions Matrix

**App Entities and Actions:**

| Entity | Actions | Allowed Roles |
|--------|---------|---------------|
| SUPERADMIN | create, update, revoke | MYDAOGS_ADMIN_ROLE |
| ADMIN | update | MYDAOGS_ADMIN_ROLE, PROJECT_SUPERADMIN_ROLE |
| SCOUTER | update, ban | PROJECT_SUPERADMIN_ROLE, PROJECT_ADMIN_ROLE |
| MODEL | update, ban | PROJECT_SUPERADMIN_ROLE, PROJECT_ADMIN_ROLE |
| ORGANIZATION | create | USER_ROLE (all authenticated users) |
| ORGANIZATION | process | PROJECT_SUPERADMIN_ROLE, PROJECT_ADMIN_ROLE |

**Organization Entities and Actions:**

| Entity | Actions | OWNER_ROLE | MEMBER_ROLE |
|--------|---------|------------|-------------|
| OWNER | update, transferRole | Yes | No |
| MEMBER | update, delete | Yes | delete only (self) |
| ORGANIZATION | update | Yes | No |
| LOT | create, update, cancel | Yes | update only |
| BID | create, update | Yes | No |
| SELECTION | create, update | Yes | Yes |
| invitation | view, create, cancel | Yes | No |

### Key User Workflows by Role

**MYDAOGS_ADMIN:**
- Sign in via Web3 wallet signature verification
- Manage project superadmins via smart contract
- Full ecosystem governance

**PROJECT_SUPERADMIN/ADMIN:**
- Sign in via Web3 wallet signature verification
- Whitelist agency organizations (on-chain)
- Review and process agency applications
- Ban/unban scouters and models
- Manage project admins (superadmin only)

**SCOUTER:**
- Sign in via magic link email authentication
- Create draft lots (max 3 drafts at a time)
- Fill in model details (name, measurements, location, photos via Cloudinary)
- Send confirmation email to model
- Cancel confirmation requests
- Submit confirmed lots to blockchain (IMPLEMENTATION PENDING)

**MODEL:**
- Sign in via VK OAuth or magic link
- Receive confirmation email from scouter
- Review and sign lot confirmation
- Become member of default scouting organization
- View profile status

**HEADBOOKER:**
- Sign in via magic link
- Create new agency organization (requires admin whitelist approval)
- Invite bookers to agency
- Manage booker membership (remove, transfer ownership)
- Review agency application status
- Set agency wallet address for on-chain operations (IMPLEMENTATION PENDING)

**BOOKER:**
- Sign in via magic link
- Accept agency invitations
- Access agency dashboard
- View selection page (IMPLEMENTATION INCOMPLETE)
- Participate in lot evaluation (IMPLEMENTATION PENDING)

**USER (Default):**
- Sign in via magic link with hCaptcha verification
- Create scouting or agency organizations
- Accept invitations to organizations
- Switch between organizations via session management
- Update email preferences (newsletter, system emails)
- Change account locale (internationalization)

---

## System architecture

### Monorepo Structure

**Build System:**
- Turborepo with pnpm workspace v8.15.6+
- Node.js >=18 required
- Framework inference disabled (`--framework-inference=false`)

**Applications:**
- `apps/mhnt` - Main application (Next.js 15.6.0-canary.6, runs on port 443 with HTTPS in dev)
- `apps/motherhunt` - Marketing/landing site (Next.js 15, runs on port 3000)

**Shared Packages:**
- `packages/db` - Prisma 6.10.1 database schema and client (MongoDB)
- `packages/ui` - Shared UI components (shadcn/ui)
- `packages/eslint-config` - Shared ESLint configuration
- `packages/typescript-config` - Shared TypeScript configuration

### Technology Stack

**Frontend:**
- Next.js 15.6.0-canary.6 with App Router
- React 19.0.0 with React DOM 19.0.0
- TypeScript 5 (strict mode)
- Tailwind CSS 4 with PostCSS
- shadcn/ui component library
- Framer Motion 12.17.3 for animations
- Lucide React 0.475.0 for icons

**State Management:**
- TanStack Query (React Query) 5.80.7
- localStorage persistence via query-async-storage-persister and persist-client
- SSR-safe configuration with client-side only persistence

**Forms and Validation:**
- react-hook-form 7.57.0
- @hookform/resolvers 5.1.1
- zod 3.25.64 for schema validation

**Authentication:**
- better-auth 1.2.9 with custom plugins:
  - admin plugin (app-level RBAC)
  - organization plugin (org-level RBAC)
  - magic link plugin (email authentication)
  - captcha plugin (hCaptcha integration)
  - custom session plugin (org context)
  - trustedUserPlugin (Web3 admin sign-in)
- Session extensions: activeOrganizationId, activeMemberId, activeOrganizationName, activeOrganizationType, activeOrganizationRole
- Cross-subdomain cookies for mhnt.app domain
- Database hooks for session lifecycle management

**Email:**
- Nodemailer 7.0.3
- Email templates for: magic link, change email, organization setup, agency acceptance, model confirmation, lot confirmation

**File Upload:**
- Cloudinary 2.7.0
- Server-side signature generation for secure uploads
- Profile pictures and lot images stored in Cloudinary

**Web3 Integration:**
- wagmi 2.18.0
- @wagmi/core 2.22.0
- viem 2.38.0
- Reown AppKit 1.8.10 (formerly WalletConnect)
- Custom wagmi config with network selection
- Contract ABIs for: System, Karma, Auction, USD token

**Internationalization:**
- next-intl 4.1.0
- Locale stored in user preferences
- Supported locales configurable via NEXT_PUBLIC_APP_LOCALE

**Development:**
- tsx 4.20.3 for seed scripts
- @svgr/webpack 8.1.0 for SVG as React components
- Experimental HTTPS in development mode

**OAuth Providers:**
- VK OAuth (configured but optional)
- Facebook OAuth (UI button exists but integration incomplete)

### Infrastructure

**Hosting:** Vercel (assumed from Next.js deployment patterns)

**Database:** MongoDB via Prisma (connection string in DATABASE_URL)

**Build Pipeline:**
- Turbo tasks with dependency graph
- `db:generate` runs before all build tasks
- @prisma/nextjs-monorepo-workaround-plugin ensures correct client bundling

**Asset Handling:**
- SVG imports as React components (with ?url suffix for URL imports)
- Image optimization via Next.js Image component

---

## Blockchain layer

### Smart Contracts

**MotherhuntSystem:**
- Manages offchain ID mappings (bytes32 for scouters and agencies)
- Agency whitelist functionality
- Admin role management (superadmin, admin tiers)
- Scouter/agency address claiming and updating
- Inherits from MyDaogsAbstractProject for dividends integration
- Ban management (IMPLEMENTATION PENDING)

**MotherhuntKarma:**
- Non-transferable karma accounting by bytes32 ID
- Karma balance tracking
- Karma purchase functionality with USD price
- Minimum votable karma threshold

**MotherhuntAuction:**
- Lot lifecycle management with voting system
- Scouter lots number tracking
- Lot data retrieval (scouterId, votingDetails, status, pricing, appealability)
- Voting, bidding, and settlement (IMPLEMENTATION PENDING)

**USD Token (Fees Token):**
- Standard ERC20 interface
- Balance checking, approvals, allowances
- Used for on-chain payments

### Identity Model

**Offchain IDs:**
- Users identified by bytes32 hash of their database ObjectId
- Conversion via `stringToBytes32` utility
- Scouters and agencies must claim addresses on-chain
- Address updates allowed through contract calls

**Agency Whitelist:**
- Agencies must be whitelisted by admins before full access
- Whitelist events emit agencyId and whitelister address
- Application processed via `acceptAgencyApplication` action

### Web3 Integration Patterns

**Admin Sign-in:**
- Wallet signature verification ("sign-in" message)
- On-chain role lookup via System contract
- Automatic user creation/retrieval based on blockchain role
- Rate limited (10 requests per 60 seconds)

**Contract Interactions:**
- Read-only calls via viem client
- Write operations via wagmi hooks (useWriteContract)
- Transaction receipt parsing for event logs
- Approval flows for token spending

---

## System components

### Main Website (motherhunt.com)
Marketing, onboarding, and program information surface (separate Next.js app).

### Web Application (mhnt.app)

**Route Structure:**

The app uses Next.js App Router with nested route groups for role-based access:

```
(with-settings)/
  settings/
    - User settings page
    - Switch account flows
      - switch-account/ (account switcher)
      - switch-account/agency/ (agency list)
      - switch-account/agency/requests/ (pending applications)
      - switch-account/model/ (model profile)

  (main)/
    - Root auction page (/)

    (daog)/
      - /superadmins (manage superadmins)
      - MYDAOGS_ADMIN_ROLE only

    (superadmin)/
      - /admins (manage admins)
      - PROJECT_SUPERADMIN_ROLE only

    (admin)/
      - /review-cases/agencies (agency applications)
      - PROJECT_SUPERADMIN_ROLE, PROJECT_ADMIN_ROLE

    (scouter)/
      - /hunt (scout dashboard)
      - /hunt/drafts (draft lots list)
      - /hunt/drafts/[id] (edit draft lot)
      - SCOUTER_ROLE only

    (headbooker)/
      - /agency (agency management)
      - HEADBOOKER_ROLE only

    (booker)/
      - /selection (model selection page - INCOMPLETE)
      - HEADBOOKER_ROLE, BOOKER_ROLE

    (model)/
      - /confirmation/[id] (sign lot confirmation)
      - MODEL_ROLE only

    (custom)/(scouter-agency)/
      - /deals (shared between scouters and agencies - INCOMPLETE)

    (user)/
      - /apply-agency (create agency organization)
      - /join-agency (accept agency invitation)
      - /sign-in/vk (VK OAuth callback)
      - USER_ROLE (all authenticated)

sign-in/
  - /sign-in (magic link authentication)
  - /sign-in/admin (Web3 admin authentication)
  - UNAUTHENTICATED only
```

**Parallel Routes:**
- `@modal` - Intercepted modal routes for settings

**Guards:**
- SignedOutGuard - Redirects authenticated users
- SignedInGuardClient - Requires authentication
- RoleGuardClient - Enforces custom member role access
- AppLocaleGuard - Validates locale parameter

### Smart Contracts

On-chain registry, karma tracking, and auction lifecycle (see Blockchain layer section).

---

## Core features and workflows

### IMPLEMENTED FEATURES

#### 1. Authentication System

**Magic Link Email Auth:**
- Email-based passwordless authentication
- hCaptcha verification (skipped in dev mode with 0x0000... secret)
- 1-hour magic link expiration
- Email delivery via Nodemailer

**Web3 Admin Auth:**
- Wallet signature verification
- On-chain role retrieval from System contract
- Automatic role mapping to app roles
- Separate sign-in flow at /sign-in/admin

**VK OAuth:**
- VK ID integration for model onboarding
- Token exchange and user info retrieval
- Automatic scouting organization membership
- Social ID tracking (vk:userId format)

**Session Management:**
- Custom session fields for organization context
- Database hooks populate activeOrganization fields
- Session token stored in cookies
- Cross-subdomain cookie support

**User Management:**
- Email verification tracking
- Newsletter/system email preferences
- Banned status with reason and expiration
- Recent organization tracking for auto-switching

#### 2. Organization Management

**Organization Creation:**
- Users can create SCOUTING or AGENCY organizations
- Better-auth organization plugin integration
- Metadata stored as JSON (orgType, creatorUserId, reviewerAddress)
- Auto-ownership assignment to creator

**Agency Application Workflow:**
1. User creates agency via createNewAgencyOrg action
2. Validation: no pending applications for same user
3. Organization created with AGENCY type, no reviewerAddress
4. Admin receives notification (via getPendingOrganizations)
5. Admin whitelists on-chain via System.whitelistAgency
6. Admin calls acceptAgencyApplication with tx hash
7. Transaction log parsed for WhitelistedAgency event
8. Organization metadata updated with reviewerAddress
9. Creator receives acceptance email

**Member Management:**
- Invite bookers via email (organization plugin)
- Accept invitations (updates recentOrganization)
- Remove bookers (headbooker only)
- Transfer headbooker role (owner only)
- View active agency bookers

**Organization Switching:**
- Session tracks active organization context
- Switch via settings modal
- Session updates activeOrganization fields
- UI reflects current org context

#### 3. Lot (Model Profile) Management

**Draft Creation:**
- Scouters can create up to 3 draft lots
- Limit enforced by comparing offchain count vs onchain count
- Random nickname options generated on creation
- Draft stored in database, not on-chain

**Draft Editing:**
- Comprehensive lot form with validation
- Fields: name, nickname, email, sex, birth date
- Measurements: bust, waist, hips, feet (in millimeters)
- Location: country, city (city options fetched by country)
- Profile picture upload to Cloudinary
- Google Drive link for portfolio
- Travel availability, agency status flags
- Auto-save on update

**Model Confirmation Flow:**
1. Scouter completes draft lot
2. Scouter sends confirmation email to model (sendLotConfirmation)
3. Model receives email with confirmation link
4. Model signs in (or signs up) with same email
5. Model becomes MODEL_ROLE in default scouting org
6. Model accesses /confirmation/[id] page
7. Model signs confirmation (signLotConfirmation)
8. Lot updated with signedByUserId
9. Scouter receives confirmation email
10. Lot ready for blockchain submission (PENDING)

**Confirmation Management:**
- Cancel confirmation request (sets isConfirmationEmailSent = false)
- Validates model email matches invitation
- Validates no duplicate confirmation
- Checks on-chain registration status

**Draft Listing:**
- View all user's draft lots
- Filter by confirmation status
- Real-time updates via TanStack Query
- Cached with tag-based revalidation

#### 4. Admin Management

**Superadmin Management (MYDAOGS_ADMIN only):**
- Add project superadmins via smart contract
- Revoke superadmin privileges
- View list of current superadmins
- On-chain role assignment

**Admin Management (PROJECT_SUPERADMIN only):**
- View list of project admins
- On-chain admin role tracking
- Admin details pages

**Agency Application Review:**
- View pending agency applications
- Whitelist agencies on-chain
- Accept applications with tx verification
- Automated email notifications

#### 5. User Settings

**Account Settings:**
- Change email (with verification)
- Toggle newsletter emails
- Toggle system emails
- View authentication info
- Switch locale (i18n support)

**Account Switching:**
- View all organizations user is member of
- Switch active organization
- View pending agency applications (for user's own agencies)
- Model profile access (if user is model)

#### 6. Web3 Features

**Wallet Connection:**
- Reown AppKit integration
- Network switching
- Balance display
- Account management

**Karma System:**
- View karma balance by scouterId
- Top-up karma (purchase with USD token)
- Karma price retrieval
- Minimum votable amount display

**Wallet Address Management:**
- Scouters can set their wallet address on-chain
- Agencies can set their wallet address on-chain
- Address claiming from offchain IDs

**Transaction Approval:**
- USD token approval flows
- Allowance checking
- Generic approve transaction button

#### 7. Data Fetching Layer

**Server-side Data Functions:**
- `getSession()` - Current user session
- `getMyDrafts()` - User's draft lots
- `getActiveAgencyBookers()` - Agency member list
- `getInvitationDetails()` - Invitation info by ID
- `getPendingOrganizations()` - Agencies awaiting approval

**TanStack Query Hooks:**
- `useSession()` - Client-side session access
- `useMyDrafts()` - Draft lots with auto-refetch
- `useActiveAgencyBookers()` - Agency members with caching
- `useInvitationDetails()` - Invitation data
- `useCityOptions()` - City list by country

**Caching Strategy:**
- Tag-based cache revalidation
- localStorage persistence (REACT_QUERY_OFFLINE_CACHE)
- SSR-safe configuration
- Automatic background refetch disabled

#### 8. Email System

**Email Templates:**
- Magic link authentication
- Email change verification
- Organization setup confirmation
- Agency acceptance notification
- Model confirmation request
- Lot signed confirmation
- Booker invitation

**Email Configuration:**
- Nodemailer with app password authentication
- Internationalized subject/description
- Deep links to specific app pages
- HTML email template (assumed from sendEmail usage)

#### 9. Internationalization

**Supported Features:**
- User locale preference storage
- next-intl integration
- Locale-aware URLs
- Email localization
- Language switcher component

#### 10. Security Features

**Rate Limiting:**
- Trusted user sign-in: 10 requests per 60 seconds
- Better-auth built-in rate limiting

**Access Control:**
- App-level RBAC via better-auth admin plugin
- Organization-level RBAC via organization plugin
- Custom access checkers (canAccessAppRole, canAccessCustomRole)
- Route guards at layout level

**Validation:**
- Zod schemas for all inputs
- Server-side validation for all actions
- Type-safe form handling

**Security Headers:**
- CSRF protection (better-auth)
- Secure cookies (httpOnly, sameSite)
- Server-only directive for data functions

---

### NOT IMPLEMENTED / INCOMPLETE FEATURES

#### 1. Auction & Bidding System
- Lot voting phase
- Community voting mechanism
- Karma rewards for voters
- Agency bidding on lots
- Bid step validation
- Auto-refund on outbid
- Deal immediately/by agency/by scouter flows
- Settlement process
- Appeal system
- Status transitions (VOTING → ACTIVE → SETTLING → FULFILLED)

**Evidence:**
- No Auction or Bid models in database schema
- Lot model exists but has no status field
- Selection page is empty placeholder
- Deals page exists but incomplete

#### 2. On-chain Lot Submission
- Submit confirmed lot to blockchain
- Lot status tracking
- Voting phase initiation
- On-chain ID assignment to lots

**Evidence:**
- Lot model has no onchainId field
- No actions for blockchain lot submission
- Confirmation flow stops at database update

#### 3. Analytics & Reporting
- Lot pipeline analytics
- Voting outcome tracking
- Appeal rate monitoring
- Organization performance dashboards
- Karma leaderboards

**Evidence:** No analytics routes or components found

#### 4. Ban Management
- UI for banning scouters/models
- Ban expiration enforcement
- Ban reason display
- Appeal process for bans

**Evidence:**
- Database fields exist (banned, banReason, banExpires)
- No UI or actions for ban management

#### 5. Facebook OAuth
- Facebook OAuth button exists in UI
- No Facebook OAuth configuration in auth setup
- Incomplete integration

#### 6. Selection/Voting UI
- Booker selection page is placeholder only
- No lot browsing for agencies
- No voting interface

#### 7. Deals Management
- Deals page route exists but no implementation
- No deal tracking or display

#### 8. Karma Purchase Flow
- Top-up karma button exists
- No complete purchase transaction flow
- No approval + purchase combination

#### 9. Mobile Optimization
- No mobile-specific layouts
- No PWA configuration
- Responsive design assumed but not verified

---

## Data models (application layer)

### User

```typescript
{
  id: string // ObjectId
  name: string
  email: string
  emailVerified: boolean
  isNewsletterEmailsEnabled: boolean // default: true
  isSystemEmailsEnabled: boolean // default: true
  image?: string
  role: 'MYDAOGS_ADMIN_ROLE' | 'PROJECT_SUPERADMIN_ROLE' | 'PROJECT_ADMIN_ROLE' | 'USER_ROLE'
  banned?: boolean
  banReason?: string
  banExpires?: string // ISO date string
  recentOrganizationId?: string // ObjectId
  recentOrganizationName?: string
  recentOrganizationType?: 'SCOUTING' | 'AGENCY'
  scoutingOrganizationId?: string // For scouters, their primary scouting org
  modelOrganizationId?: string // For models, their scouting org
  modelSocialId?: string // Format: "vk:12345678" or other OAuth provider
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- One-to-many with Session
- One-to-many with Account (OAuth accounts)
- One-to-many with Lot (as scouter)
- Many-to-many with Organization (via Member)

### Session

```typescript
{
  id: string // ObjectId
  expiresAt: Date
  token: string // unique
  impersonatedBy?: string // ObjectId (for admin impersonation)
  activeOrganizationId?: string // ObjectId
  activeMemberId?: string // ObjectId
  activeOrganizationName?: string
  activeOrganizationType?: 'SCOUTING' | 'AGENCY'
  activeOrganizationRole?: 'OWNER_ROLE' | 'MEMBER_ROLE'
  createdAt: Date
  updatedAt: Date
  ipAddress?: string
  userAgent?: string
  userId: string // ObjectId, foreign key to User
}
```

### Organization

```typescript
{
  id: string // ObjectId (also used as bytes32 on-chain after hashing)
  name: string
  slug: string // unique identifier
  logo?: string // URL
  metadata?: string // JSON string: { orgType: 'SCOUTING' | 'AGENCY', creatorUserId: string, reviewerAddress?: string }
  createdAt: Date
}
```

**Organization Types:**
- SCOUTING - For scouts and models
- AGENCY - For agencies and bookers

**Metadata Structure:**
```typescript
{
  orgType: 'SCOUTING' | 'AGENCY'
  creatorUserId: string // User who created the org
  reviewerAddress?: string // Admin who approved (for agencies only)
}
```

### Member

```typescript
{
  id: string // ObjectId
  userId: string // ObjectId, foreign key
  organizationId: string // ObjectId, foreign key
  role: 'OWNER_ROLE' | 'MEMBER_ROLE'
  createdAt: Date
}
```

### Invitation

```typescript
{
  id: string // ObjectId
  email: string
  inviterId: string // ObjectId, who sent the invitation
  organizationId: string // ObjectId
  role: string // 'OWNER_ROLE' | 'MEMBER_ROLE'
  status: string // 'pending' | 'accepted' | 'expired' | 'revoked'
  expiresAt: Date
  createdAt: Date
}
```

### Lot (Model/Talent Profile)

```typescript
{
  id: string // ObjectId
  scouterId: string // ObjectId, foreign key to User
  name?: string // Model's real name
  sex?: 'MALE' | 'FEMALE'
  nickname?: string // Selected from nicknameOptions
  nicknameOptionsJson: string // JSON array of 3 random nicknames
  email?: string // Model's email for confirmation
  birthDate?: Date
  bustSizeMM?: number // Bust measurement in millimeters
  waistSizeMM?: number
  hipsSizeMM?: number
  feetSizeMM?: number
  passportCitizenship?: string // Country code
  locationCountry?: string // Country code
  locationCity?: string // City name
  canTravel?: boolean
  hasAgency?: boolean
  googleDriveLink?: string // Portfolio link
  signedByUserId?: string // ObjectId of model who confirmed
  isConfirmationEmailSent: boolean // default: false
  isOnChain: boolean // default: false
  profilePictureUrl?: string // Cloudinary URL
  banned?: boolean
  banReason?: string
  banExpires?: string // ISO date string
  createdAt: Date
  updatedAt: Date
}
```

**Note:** No status field exists. Auction/voting status to be tracked differently (IMPLEMENTATION PENDING).

### Account (OAuth)

```typescript
{
  id: string // ObjectId
  accountId: string // Provider account ID
  providerId: string // 'vk', 'facebook', etc.
  userId: string // ObjectId, foreign key
  accessToken?: string
  refreshToken?: string
  idToken?: string
  accessTokenExpiresAt?: Date
  refreshTokenExpiresAt?: Date
  scope?: string
  password?: string // For password-based providers
  createdAt: Date
  updatedAt: Date
}
```

### Verification (Magic Link)

```typescript
{
  id: string // ObjectId
  identifier: string // Email address
  value: string // Token value
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}
```

---

## Smart contract data models (on-chain)

### Lot Data Structure

```solidity
struct Lot {
  bytes32 scouterId;
  VotingDetails votingDetails;
  LotStatus status; // enum: VOTING, ACTIVE, SETTLING, FULFILLED, CANCELED, APPEALED
  uint256 minimumPriceUSD;
  uint256 immediatePriceUSD;
  uint256 appealableTill; // timestamp
}

struct VotingDetails {
  bytes32[10] communityVotesPositive;
  bytes32[10] communityVotesNegative;
  address adminDecisionPositive;
  address adminDecisionNegative;
}
```

### Fees Token Details

```solidity
struct FeesTokenDetails {
  address tokenAddress;
  uint8 decimals;
  string symbol;
  string name;
  uint256 minClaimableUnitsAmount;
}
```

---

## Security and compliance

### Smart Contracts

- ReentrancyGuard on state-changing functions
- Whitelist enforcement for agency operations
- Identity modifiers for offchain ID validation
- Immutable parameters set in constructors
- Event logging for all critical operations

### Application Layer

**Authentication:**
- Signature verification for Web3 admin auth
- Magic link with single-use tokens
- Session token rotation
- Secure cookie settings (httpOnly, sameSite, secure in prod)

**Authorization:**
- Multi-level RBAC enforcement
- Route guards at layout level
- Server-side permission checks in actions
- Access control helpers (canAccessAppRole, canAccessCustomRole)

**Data Validation:**
- Zod schema validation on all inputs
- Type-safe API responses
- Server-side validation for all mutations
- Database constraint enforcement

**Rate Limiting:**
- Better-auth built-in rate limiting
- Custom rate limits on sensitive endpoints (Web3 admin sign-in)

**Data Protection:**
- Server-only directive for data fetching
- Encrypted database connections (MongoDB Atlas)
- No sensitive data in client state
- GDPR-compliant data handling patterns

**CSRF Protection:**
- Better-auth CSRF middleware
- Same-site cookie policy

**File Upload Security:**
- Cloudinary signature verification
- Server-side signature generation
- No direct client uploads to storage

---

## Performance requirements

### Frontend

**Rendering:**
- Server-side rendering for authenticated routes
- Static generation for public pages
- Client-side navigation via App Router

**State Management:**
- TanStack Query with staleTime optimization
- localStorage persistence for offline capability
- Selective refetch on mount/reconnect disabled
- Tag-based cache invalidation

**Assets:**
- Next.js Image component for optimization
- SVG as React components for smaller bundles
- Code splitting via dynamic imports

### Backend

**Database:**
- MongoDB indexes on frequently queried fields
- Prisma query optimization
- Connection pooling

**Caching:**
- React cache() for server-side deduplication
- unstable_cacheTag for granular revalidation
- Browser cache headers

**API Performance:**
- Server actions for mutations (colocated with UI)
- Streaming responses where applicable
- Parallel data fetching

### Blockchain

**Gas Optimization:**
- Foundry optimizer enabled
- Batch operations where possible
- Read-only calls cached client-side

**Network:**
- RPC provider failover (assumed from viem config)
- Transaction retry logic (via wagmi)

---

## Environment and configuration

### Required Environment Variables

```bash
# Network Configuration
NEXT_PUBLIC_NETWORK=sepolia # or mainnet, etc.
NEXT_PUBLIC_APP_LOCALE=en # default locale

# Database
DATABASE_URL=mongodb+srv://...

# Authentication
BETTER_AUTH_SECRET=... # Secret for session signing

# Email Service
NODEMAILER_USER=... # SMTP username
NODEMAILER_APP_PASSWORD=... # SMTP app password

# VK OAuth (optional)
NEXT_PUBLIC_VK_CLIENT_ID=...
VK_CLIENT_SECRET=...

# hCaptcha
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=...
HCAPTCHA_SECRET_KEY=... # or 0x0000... for dev

# Web3 Wallet
NEXT_PUBLIC_REOWN_PROJECT_ID=... # Reown AppKit project

# File Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_PUBLIC_KEY=...
CLOUDINARY_SECRET_KEY=...

# Smart Contracts
NEXT_PUBLIC_SYSTEM_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_KARMA_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS=0x...

# Default Organizations
NEXT_PUBLIC_DEFAULT_SCOUTING_ORG_ID=... # ObjectId of default scouting org
```

### Configuration Management

**Runtime Config:**
- Server-side config via getEnvConfigServer()
- Client-side config via NEXT_PUBLIC_ prefix
- Type-safe environment variable access

**Build Config:**
- Turbo task dependencies in turbo.json
- Prisma generation before build
- Next.js config with monorepo plugin

---

## Open questions and decisions

### Business Logic

- **Lot submission requirements:** What validates a lot is ready for blockchain submission?
- **Draft limit rationale:** Why 3 drafts maximum? Should this be configurable?
- **Model confirmation timeout:** How long should confirmation links remain valid?
- **Agency approval criteria:** What criteria determine agency whitelist approval?

### Blockchain Integration

- **Lot to auction transition:** How does a confirmed lot become an on-chain auction?
- **Voting threshold:** Minimum votes required to pass voting phase?
- **Karma economics:** How is karma earned beyond purchase? What's the discount formula?
- **Service fee structure:** Basis points for platform fees? Distribution to dividends?
- **Appeal process:** Who can appeal? What triggers appeal? Admin override process?

### Features

- **Selection page functionality:** What should bookers see/do on selection page?
- **Deals tracking:** What constitutes a deal? How are deals tracked?
- **Ban workflow:** UI for ban management? Appeal process?
- **Analytics:** What metrics are most valuable? Real-time vs. batch?

### Technical

- **Production chain:** Which mainnet for production deployment?
- **Fees token:** Which ERC20 token for production? USDC, USDT, DAI?
- **Mobile strategy:** Progressive Web App? Native apps? Mobile-first responsive?
- **Scaling:** Expected load? Database sharding? CDN strategy?

---

## Future considerations

### Phase 2 Features

- Complete auction and bidding system
- Real-time notifications (WebSocket or polling)
- Advanced search and filtering for lots
- Reputation system beyond karma
- Multi-language support expansion
- Mobile native applications

### Phase 3 Features

- Multi-chain deployment
- Cross-chain bridging for fees token
- DAO governance for platform parameters
- Advanced analytics and ML for talent matching
- Integration with fashion show platforms
- Talent portfolio builder

### Platform Evolution

- API for third-party integrations
- Webhook system for external services
- White-label solutions for agencies
- Educational content and certification
- Community forums and social features

---

## AI agent guidelines

### Source of Truth

- Treat this PRD as accurate reflection of current implementation
- Schema definitions match Prisma schema exactly
- Routes correspond to actual Next.js App Router structure
- Environment variables match .env.example

### Development Standards

**Next.js:**
- Use App Router conventions (app/ directory)
- Server components by default, "use client" when needed
- Server actions for mutations
- Parallel routes for modals

**TypeScript:**
- Strict mode enabled
- Use Prisma generated types
- Zod for runtime validation
- No any types without explicit reason

**Authentication:**
- Use getSession() for server-side auth
- Use useSession() for client-side auth
- Respect role guards and permissions
- Never bypass access control checks

**Database:**
- Use Prisma client from @/lib/db
- Tag cache keys for revalidation
- Use transactions for multi-step operations
- Always run db:generate before build

**Forms:**
- react-hook-form with zod resolver
- Server-side validation in actions
- Error handling with createActionResponse
- Loading states and optimistic updates

**Web3:**
- Use wagmi hooks for contract interactions
- Use viem for read-only calls
- Parse contract errors properly
- Handle transaction states (pending, success, error)

**Styling:**
- Tailwind CSS 4 utility classes
- shadcn/ui components
- Responsive design (mobile-first)
- Dark mode support (if implemented)

### Monorepo Constraints

- Run `pnpm db:generate` before building
- Respect package dependencies (db, ui, config)
- SVG imports with @svgr/webpack
- Prisma monorepo plugin required in next.config.mjs

### Testing

- Seed script available: `pnpm seed` from apps/mhnt
- Test with different role combinations
- Validate organization switching
- Check blockchain integration end-to-end

---

## Implementation status

### Completed (Production-ready)

- Authentication system (magic link, Web3, VK OAuth)
- Organization management (create, invite, switch)
- Draft lot creation and editing
- Model confirmation workflow
- Agency application and approval
- Admin management (superadmin, admin)
- User settings and preferences
- Email notification system
- File upload to Cloudinary
- Web3 wallet connection
- Karma balance display
- Session management with org context

### In Progress (Partially implemented)

- Agency whitelist address management (UI exists, integration incomplete)
- Scouter wallet address management (UI exists, integration incomplete)
- Karma purchase flow (button exists, no complete tx flow)
- Lot ban management (database fields exist, no UI)

### Not Started (Planned)

- Lot submission to blockchain
- Auction voting phase
- Bidding system
- Settlement and payout
- Appeal process
- Selection page for bookers
- Deals tracking and display
- Analytics and reporting
- Ban management UI
- Facebook OAuth completion

---

## Changelog

### Version 2.0 (October 18, 2025)
- Complete rewrite based on actual codebase analysis
- Added detailed role permission matrix
- Documented all implemented features with evidence
- Listed incomplete/missing features
- Updated data models to match Prisma schema exactly
- Added environment variables from .env.example
- Documented Web3 integration patterns
- Added route structure from actual App Router layout
- Clarified authentication flows for all roles
- Added custom member roles concept
- Documented organization metadata structure
- Added implementation status section
- Corrected blockchain integration status
- Added missing User fields (banned, social IDs, org tracking)
- Added Account and Verification models
- Removed non-existent Auction and Bid models from implementation
- Added Future Considerations section
- Enhanced AI agent guidelines with specific patterns

### Version 1.1 (Previous)
- Initial draft with aspirational features

---

## Notes for Product Team

### Critical Gaps Identified

1. **Auction System Missing:** The core value proposition (blockchain auctions) is not implemented. Lots stop at confirmation stage.

2. **Status Tracking:** Lot model has no status field. The VOTING → ACTIVE → SETTLING → FULFILLED flow exists only in contract design.

3. **Booker Functionality:** Selection page is empty. Bookers have no work to do after joining.

4. **Deals Page:** Route exists but no implementation. Unclear what "deals" means in current context.

5. **Ban System:** Database supports bans but no admin UI to manage them.

### Alignment Needed

1. **Product Roadmap:** Should auction/bidding be prioritized to deliver core value prop?

2. **MVP Definition:** Is current implementation (scout → model → confirmation) sufficient for MVP?

3. **Agency Value:** What value do agencies get without bidding system? Just profile browsing?

4. **Blockchain Justification:** Without on-chain lots/auctions, why use blockchain at all currently?

### Strengths

1. **Solid Foundation:** Auth, roles, org management are production-quality
2. **Type Safety:** Excellent TypeScript, Prisma, Zod coverage
3. **Developer Experience:** Well-structured monorepo, clear patterns
4. **Email System:** Comprehensive notification templates
5. **Model Confirmation:** Unique workflow adds trust to platform

### Recommendations

1. **Complete Auction MVP:** Prioritize lot submission, voting, and basic bidding
2. **Simplify Initial Scope:** Consider manual deals before full automation
3. **Add Analytics:** Even basic metrics would help validate product-market fit
4. **Document Business Rules:** Many edge cases have technical solutions but unclear business requirements
5. **Mobile Testing:** No evidence of mobile optimization testing
