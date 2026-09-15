# BarterHub — Modern Circular Peer-to-Peer Product & Book Exchange Platform

<p align="center">
  <img src="public/screenshots/barterhub-logo.png" alt="BarterHub Brand Logo" width="300" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Design_System-Stitch_Soft_Modernism-4648D4" alt="Design System" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

**BarterHub** is an enterprise-grade circular classifieds and exchange platform engineered for swapping, buying, and selling second-hand books, academic course materials, and high-performance tech gear. It delivers a sustainable, zero-cash peer economy through direct item-for-item bartering, hybrid cash top-up settlements, in-thread deal negotiation cards, and physical 6-digit PIN handshake verification tokens.

---

## 📑 Table of Contents

- [Visual Showcase & Screen Walkthrough](#-visual-showcase--screen-walkthrough)
- [Platform Architecture & Site Map](#-platform-architecture--site-map)
- [Core Platform Capabilities](#-core-platform-capabilities)
- [Interactive Database Hub & SQL Studio (`/database`)](#-interactive-database-hub--sql-studio-database)
- [Database Schema & Relational Models](#-database-schema--relational-models)
- [REST API Reference](#-rest-api-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Pre-Configured Test Personas](#-pre-configured-test-personas)
- [Step-by-Step Feature Testing Guide](#-step-by-step-feature-testing-guide)
- [Available Scripts](#-available-scripts)
- [Docker Deployment](#-docker-deployment)
- [License](#-license)

---

## 📸 Visual Showcase & Screen Walkthrough

BarterHub is crafted with the **Stitch Soft Modernism** design language — blending silky light surfaces, friendly rounded corner radii (24px panels, full pill triggers), electric indigo (`#4648D4`) and vivid violet (`#712AE2`) accents, warm amber valuation badges, and tactile drop shadows.

### 1. 🔍 Catalog & Faceted Search (`/listings`)
Faceted discovery rail featuring an interactive valuation histogram distribution slider, exchange mode filter pills (**True Barter**, **Hybrid Swap**, **Cash Direct**), curriculum tags, condition rubrics, verified campus spot badges, and soft-modern item cards.

![Explore Catalog & Faceted Search](public/screenshots/explore-catalog.png)

---

### 2. 📦 Listing Detail & Interactive Barter Proposal Modal (`/listings/:id`)
Comprehensive item dossier displaying owner trade wishlists, academic and hardware specifications, verified safety badges, and an interactive proposal modal for selecting items from posted inventory + calculating recommended cash top-up offsets.

![Listing Detail & Barter Modal](public/screenshots/listing-detail.png)

---

### 3. ➕ Publish Barter Ad Wizard & Live Preview (`/listings/new`)
4-step progressive listing wizard with adaptive form schemas for tech gear and books, algorithmic valuation spectrum slider, target wishlist tags, safe handover spot picker, and a sticky live marketplace feed card preview.

![Post New Barter Listing Wizard](public/screenshots/post-listing.png)

---

### 4. 🤝 Offers & Swaps Hub with Real Handshake PIN Settlement (`/offers`)
End-to-end deal management with inbound and outbound negotiation cards, counter-offer rounds, Union Square Safe Kiosk indicator, and the physical in-person 6-digit handshake verification settlement interface (`TRD-XXXX`) with 1-click `Auto-Fill` buttons for friction-free trade completions.

![Offers Hub & Handshake Settlement](public/screenshots/offers-handshake.png)

---

### 5. 💬 Trade Negotiation Chat with In-Thread Deal Cards (`/messages`)
Real-time polling chat engine featuring contextual active exchange agreements, quick-adjustment action chips (*Offer +$10 Cash*, *Suggest Meetup Zone*, *Swap Different Item*, *Request Condition Video*), and verified counter-offer states. Protected by authentication checks to ensure guest privacy.

![Trade Chat & Deal Cards](public/screenshots/chat-negotiation.png)

---

### 6. 📊 Item Management Desk / Dashboard (`/dashboard`)
Comprehensive seller operations center featuring 4 Bento metric cards, 7-day listing view trends sparkline, Verified Trader Badge progression bar, and inventory status toggle desk.

![Listing Management Desk](public/screenshots/management-desk.png)

---

### 7. ❤️ Saved Watchlist & Mutual Match Alerts (`/favorites`)
Bookmark management with real-time valuation drop indicators, comparison tray launcher, and automated Mutual Match recommendation banners connecting wishlist items with user inventory.

![Saved Listings & Bookmarks](public/screenshots/saved-favorites.png)

---

### 8. 👤 Public Trader Reputation & Trust Dossier (`/profile/:id`)
Comprehensive trust scorecard displaying Level 4 Pioneer status, verified campus credentials (Student ID, 2FA, Meetup points), 3-axis reputation dimensions (*Condition*, *Punctuality*, *Fairness*), safe handshake monthly velocity chart, and dual-sided peer reviews.

![Trader Reputation Dossier](public/screenshots/trader-reputation.png)

---

### 9. 🔐 Authentication & 1-Click Rapid Persona Switcher (`/login` & `/register`)
Dual authentication hub featuring Barter Guarantee Standards with an instant 1-Click Rapid Persona Switcher enabling friction-free testing of both trade sides without manual credential entry.

![Authentication & Persona Switcher](public/screenshots/auth-persona-switcher.png)

---

### 10. 🗄️ Database & Interactive SQL Studio (`/database`)
Interactive PostgreSQL 16 schema explorer, SVG vector entity-relationship diagram with zoom/pan controls and live Mermaid diagram rendering, 13 domain enums, and a live custom SQL studio with 15 editable query templates.

---

## 🗺️ Platform Architecture & Site Map

```mermaid
graph TD
  Home["🏠 Homepage (/)<br/>• Hero & Value Proposition<br/>• Trending Search Pills<br/>• Featured Barters & Circular Bento"]
  Browse["🔍 Catalog & Filters (/listings)<br/>• Faceted Filter Rail<br/>• Valuation Histogram<br/>• Search & Active Chips<br/>• Soft Modern Cards"]
  NewListing["➕ Post Barter Ad (/listings/new)<br/>• Step 1-4 Wizard<br/>• Adaptable Category Specs<br/>• Valuation Slider & Wishlist Tags<br/>• Sticky Live Marketplace Preview"]
  ListingDetail["📦 Item Detail (/listings/:id)<br/>• Concentric Media Gallery<br/>• Barter / Cash CTAs<br/>• Trader Trust Dossier<br/>• Barter Modal / Offer Modal"]
  Offers["🤝 Offers & Swaps (/offers)<br/>• Inbound & Outbound Tabs<br/>• 6-Digit Handshake PIN Banner<br/>• Real PIN Verification & Auto-Fill<br/>• Counter-Offer Actions"]
  Messages["💬 Trade Chat (/messages)<br/>• Auth-Gated Polling Chat<br/>• In-Thread Cash Offer Cards<br/>• In-Thread Barter Proposal Cards<br/>• Conversation Rail"]
  Dashboard["📊 Management Desk (/dashboard)<br/>• 4 Bento Analytics Cards<br/>• Views Sparkline Graph<br/>• Inventory Manager & Status Toggles<br/>• Quick Actions"]
  Favorites["❤️ Saved Watchlist (/favorites)<br/>• Mutual Match Recommendation Alert<br/>• Saved Listing Grid<br/>• Quick Propose Actions"]
  Compare["⚖️ Comparison Matrix (/compare)<br/>• Side-by-Side Analysis Table<br/>• Valuation & Condition Alignment<br/>• Safe Meetup & Direct CTAs"]
  Profile["👤 Trader Reputation (/profile/:id)<br/>• Trust Scorecard (100% Meets)<br/>• Verified Campus Badges<br/>• Completed Trades & Reviews"]
  Auth["🔐 Auth & Persona Sandbox (/login & /register)<br/>• 1-Click Rapid Persona Switcher<br/>• Barter Guarantee Standards<br/>• Secure Email / Password"]
  DB["🗄️ Database & ER Workbench (/database)<br/>• 16 Model Inspector & Fields<br/>• Interactive ER & Mermaid Diagram<br/>• 13 Enums & Types Catalog<br/>• Custom SQL Studio & 15 Templates"]

  Home --> Browse
  Home --> NewListing
  Home --> Auth
  Home --> DB
  Browse --> ListingDetail
  Browse --> Compare
  ListingDetail --> Offers
  ListingDetail --> Messages
  Offers --> Messages
  Offers --> Dashboard
  Dashboard --> NewListing
  Browse --> Favorites
  ListingDetail --> Profile
```

---

## ✨ Core Platform Capabilities

| Feature | Description |
|---|---|
| **Triple Exchange Engine** | Complete transaction flexibility supporting **Cash Direct Sales**, **True Barter** (Item-for-Item), and **Hybrid Deals** (Item + Cash Top-Up offset). |
| **In-Thread Deal Cards** | Interactive bargaining directly inside conversation threads with real-time actionable cards to accept, counter, or decline offers without page hopping. |
| **Academic & Tech Schemas** | Rich domain-specific schemas: ISBN-10/13, course codes (e.g., CS 440), academic subjects, annotations, edition, warranty status, battery health, and box/cable checklist. |
| **Handshake PIN Settlement** | In-person delivery security via 6-digit tokens (`TRD-XXXX`). Mutual entry marks the deal as `COMPLETED`, transitions item statuses to `TRADED`, increments trader transaction counts, and posts chat receipts. |
| **Valuation Histogram Slider** | Interactive pricing curve visualization in the catalog rail allowing granular value bounds filtering. |
| **Side-by-Side Comparison** | Multi-item comparison tray and `/compare` matrix aligning condition, estimated value, specifications, and trade terms side by side. |
| **1-Click Persona Switcher** | Instant demo identity toggle on `/login` to simulate multi-party negotiations across buyers and sellers with zero password friction. |
| **Guest Privacy Protection** | Sensitive user data, private chat threads, proposals, and handshake PINs are strictly gated behind authenticated sessions. |

---

## 🗄️ Interactive Database Hub & SQL Studio (`/database`)

The `/database` screen provides developers, evaluators, and administrators with an interactive view into BarterHub's relational architecture:

### 1. Relational Schema & Fields (16 Models)
- Searchable model navigator with field-by-field definitions, TypeScript/Prisma data types, primary keys, foreign keys, and optionality indicators.
- Direct visualization of model relations and cardinality mappings.

### 2. Interactive ER & Mermaid Architecture (Merged View)
- **Vector SVG ER Diagram**: Interactive canvas with draggable nodes, zoom/pan navigation, relation curves (Crow's foot notation), and domain filters (*All Models*, *Core Users & Trust*, *Catalog & Specs*, *Deals & Handshake*, *Chat & System*).
- **Live Mermaid Schema Visualizer**: High-fidelity Mermaid ER diagram rendering live SVG vector nodes, relationships, and code exporter.

### 3. Custom SQL Studio & Workbench (Live PostgreSQL Engine)
- **Query Safety Whitelist**: Only read-only `SELECT` and `WITH` statements are permitted. Write operations (`DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`) are blocked by the safety analyzer.
- **Ready-to-Execute State**: Results are executed on demand upon clicking **Execute SQL**, avoiding pre-computed table clutter.
- **15 Editable Production SQL Templates**:
  - **Simple (Single-Table)**:
    - *Product Listings by Price (Ascending)*
    - *Recent Active Users*
    - *Available Academic Textbooks*
    - *Recent Notifications Log*
    - *All Bookmarks / Saved Listings*
  - **Relational Joins & Swaps**:
    - *All Active Listings with Owner Details*
    - *Pending Barter Proposals with Target & Cash Top-Up*
    - *Detailed Book Specifications & Conditions*
    - *Cash Offers with Buyer & Listing Context*
    - *Verified Reviews with Peer Breakdown*
  - **Complex Analytics & Aggregations**:
    - *Listing Breakdown by Exchange Type & Average Value*
    - *Top Traders by Completed Trades & Reputation*
    - *High-Activity Conversations with Message Counts*
    - *Average Rating Score by User*
    - *City-Level Supply & Demand Distribution*

### 4. Enums & Custom PostgreSQL Types (13 Enums)
- Detailed breakdown of all PostgreSQL enumerated types including `ListingType`, `ExchangeType`, `ItemCondition`, `AcademicSubject`, `BookFormat`, `BarterStatus`, `OfferStatus`, `MessageType`, `NotificationType`, and `UserRole`.

### 5. SQL Creation DDL & Migration Scripts (Tab 5)
- Fully segregated, production-grade PostgreSQL 16 SQL commands used to build the database from scratch in exact dependency order.
- **Properly Segregated Sections**:
  1. *Extensions & Prerequisites* (`uuid-ossp`, `pgcrypto`, UTF-8 client settings)
  2. *Custom Domain Enums* (All 13 `CREATE TYPE ... AS ENUM` statements)
  3. *Core Table Definitions* (All 16 tables segregated across 5 functional domains: User Identity & Trust, Catalog & Specs, Barter & Swaps, Real-time Chat, Trust & Safety)
  4. *Unique Constraints & Performance Indexes* (Primary keys, compound uniques, B-Tree indexes)
  5. *Foreign Key Constraints & Referential Actions* (`ALTER TABLE ... ADD CONSTRAINT` with `ON DELETE CASCADE` and `SET NULL`)
  6. *Initial Seed & Demo Personas Bootstrap* (Executable `INSERT INTO` statements for test personas)
- **Developer Features**: 1-Click "Copy Section", 1-Click "Copy All DDL (48 Statements)", and browser-based "Download .sql Script" (`barterhub-postgresql-schema.sql`).

---

## 🏗️ Database Schema & Relational Models

BarterHub runs on **PostgreSQL 16** managed via **Prisma ORM (5.22)**.

```mermaid
erDiagram
    User ||--o{ Listing : "owns"
    User ||--o{ CashOffer : "sends/receives"
    User ||--o{ BarterProposal : "initiates/receives"
    User ||--o{ Message : "sends/receives"
    User ||--o{ Review : "writes/receives"
    User ||--o{ SavedListing : "bookmarks"
    User ||--o{ Notification : "receives"
    
    Listing ||--o| BookDetails : "has optional"
    Listing ||--o| ProductDetails : "has optional"
    Listing ||--o{ CashOffer : "receives"
    Listing ||--o{ BarterProposal : "target of"
    Listing ||--o{ BarterItem : "offered in"
    Listing ||--o{ SavedListing : "saved by"
    
    BarterProposal ||--o{ BarterItem : "contains items offered"
    
    Conversation ||--o{ Message : "contains"
    User ||--o{ Conversation : "participant A"
    User ||--o{ Conversation : "participant B"
```

### Complete Model Inventory

| # | Model | Description | Key Attributes & Relations |
|---|---|---|---|
| 1 | **`User`** | Platform user profiles, trust stats, location | `id`, `email`, `passwordHash`, `name`, `avatarUrl`, `city`, `state`, `reputationScore`, `totalTrades`, `role`, `badgeLevel` |
| 2 | **`Listing`** | Classified items for swap or sale | `id`, `title`, `description`, `price`, `estimatedValue`, `condition`, `listingType`, `exchangeType`, `status`, `userId` |
| 3 | **`BookDetails`** | Academic textbook & book metadata | `id`, `listingId`, `isbn`, `author`, `publisher`, `edition`, `format`, `academicSubject`, `courseCode`, `hasAnnotations` |
| 4 | **`ProductDetails`** | Electronics, audio, hardware specs | `id`, `listingId`, `category`, `brand`, `model`, `warrantyStatus`, `includesOriginalBox`, `includesAccessories` |
| 5 | **`BarterProposal`** | Multi-item and hybrid barter proposals | `id`, `initiatorId`, `targetListingId`, `cashTopUp`, `status`, `exchangeCode`, `handshakePin`, `message` |
| 6 | **`BarterItem`** | Many-to-many link of offered items | `id`, `proposalId`, `listingId` |
| 7 | **`CashOffer`** | Price negotiation and counter offers | `id`, `listingId`, `buyerId`, `offerAmount`, `counterAmount`, `status`, `message` |
| 8 | **`Conversation`** | Secure chat thread between two traders | `id`, `participantAId`, `participantBId`, `listingId`, `lastMessageAt` |
| 9 | **`Message`** | In-thread text or actionable deal card | `id`, `conversationId`, `senderId`, `content`, `messageType`, `metadata` |
| 10 | **`Review`** | Dual-sided verified peer review | `id`, `reviewerId`, `revieweeId`, `listingId`, `overallRating`, `communicationRating`, `punctualityRating`, `isVerified` |
| 11 | **`SavedListing`** | Saved listings / bookmarks | `id`, `userId`, `listingId` (Compound unique `[userId, listingId]`) |
| 12 | **`Notification`** | Activity alerts & notifications | `id`, `userId`, `type`, `title`, `body`, `linkUrl`, `isRead` |
| 13 | **`SavedSearch`** | Saved filter query subscriptions | `id`, `userId`, `query`, `filters`, `notifyOnMatch` |
| 14 | **`Report`** | Trust & safety dispute reports | `id`, `reporterId`, `reportedUserId`, `listingId`, `reason`, `status` |
| 15 | **`SafetyKiosk`** | Verified physical meetup locations | `id`, `name`, `address`, `city`, `coordinates`, `hasSurveillance`, `operatingHours` |
| 16 | **`TradeEvent`** | Audit trail of barter state changes | `id`, `proposalId`, `eventType`, `actorId`, `timestamp`, `details` |

---

## 🔌 REST API Reference

All API routes are located under `/api/` and utilize standard JSON request/response formats.

### Authentication & User
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account with hashed password | Public |
| `POST` | `/api/auth/login` | Authenticate with email and password, sets JWT cookie | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session | Authenticated |
| `POST` | `/api/auth/logout` | Clear session token and log out | Public |

### Listings & Catalog
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/listings` | Search and filter listings (query, type, exchange, price range) | Public |
| `POST` | `/api/listings` | Create a new listing with book or product details | Authenticated |
| `GET` | `/api/listings/:id` | Get comprehensive item details, owner profile, specs | Public |
| `PUT` | `/api/listings/:id` | Update listing title, price, specs, status | Owner |
| `DELETE` | `/api/listings/:id` | Archive or delete listing | Owner |
| `GET` | `/api/listings/my` | Get current user's active, pending, and traded items | Authenticated |
| `POST` | `/api/listings/:id/promote` | Boost listing visibility with featured badge | Owner |

### Barters, Offers & PIN Settlement
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/barters` | List inbound and outbound barter proposals | Authenticated |
| `POST` | `/api/barters` | Submit item-for-item or hybrid barter proposal | Authenticated |
| `GET` | `/api/barters/:id` | Get barter proposal details and status | Participant |
| `PATCH` | `/api/barters/:id` | Accept, counter, or decline barter proposal | Participant |
| `POST` | `/api/barters/verify-pin` | **Verify 6-digit Handshake PIN (`TRD-XXXX`) and complete deal** | Participant |
| `GET` | `/api/offers` | List cash offers for user listings | Authenticated |
| `POST` | `/api/offers` | Submit a cash offer on an item | Authenticated |
| `PATCH` | `/api/offers/:id` | Counter or accept a cash offer | Listing Owner |

### Messaging & Negotiation
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/conversations` | List active user conversations with latest messages | Authenticated |
| `POST` | `/api/conversations` | Start or retrieve conversation thread for a listing | Authenticated |
| `GET` | `/api/messages?conversationId=:id` | Fetch messages for a thread (participation verified) | Participant |
| `POST` | `/api/messages` | Send message or in-thread actionable deal card | Participant |

### Database & Developer Tools
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/database/query` | **Execute read-only SQL queries against PostgreSQL 16** | Public / Dev |
| `GET` | `/api/health` | Health check endpoint returning database connectivity | Public |
| `POST` | `/api/seed` | Trigger database re-seed with test data | Dev |

### User Activity & Social
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/favorites` | List user bookmarked listings | Authenticated |
| `POST` | `/api/favorites` | Toggle bookmark status for a listing | Authenticated |
| `GET` | `/api/notifications` | Get user notifications and unread badges | Authenticated |
| `POST` | `/api/reviews` | Submit post-trade review and ratings | Verified Trader |
| `POST` | `/api/reports` | Submit trust and safety report on listing/user | Authenticated |

---

## 📁 Project Directory Structure

```
productexchangeplat/
├── prisma/
│   ├── schema.prisma          # Comprehensive 16-model PostgreSQL schema
│   └── seed.ts                # Realistic seed script with 5 demo personas & items
├── public/
│   └── screenshots/           # High-resolution screenshots and brand assets
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # Login & 1-Click Persona Switcher
│   │   │   └── register/page.tsx    # User registration
│   │   ├── api/                     # Next.js App Router API endpoints
│   │   │   ├── auth/                # Login, register, me, logout
│   │   │   ├── barters/             # Proposals & verify-pin endpoint
│   │   │   ├── conversations/       # Thread management
│   │   │   ├── database/query/      # Safe read-only SQL executor
│   │   │   ├── listings/            # CRUD & promote endpoints
│   │   │   ├── messages/            # Real-time chat & deal cards
│   │   │   ├── offers/              # Cash offer management
│   │   │   └── ...                  # Favorites, reviews, notifications
│   │   ├── compare/page.tsx         # Side-by-side comparison matrix
│   │   ├── dashboard/page.tsx       # Seller management desk & stats
│   │   ├── database/page.tsx        # 4-tab Database Hub & SQL Studio
│   │   ├── favorites/page.tsx       # Bookmarks & mutual match alerts
│   │   ├── listings/
│   │   │   ├── page.tsx             # Faceted catalog & histogram slider
│   │   │   ├── new/page.tsx         # 4-step listing wizard
│   │   │   └── [id]/page.tsx        # Item dossier & proposal launcher
│   │   ├── messages/page.tsx        # Trade chat & deal cards
│   │   ├── offers/page.tsx          # Swaps hub & handshake verification
│   │   ├── profile/[id]/page.tsx    # Trader reputation scorecard
│   │   ├── layout.tsx               # Root layout & navigation shell
│   │   └── page.tsx                 # Homepage with hero & circular bento
│   ├── components/
│   │   ├── barter-modal.tsx         # Interactive swap proposal modal
│   │   ├── category-rail.tsx        # Dynamic category & filter rail
│   │   ├── compare-tray.tsx         # Floating sticky comparison launcher
│   │   ├── custom-sql-workbench.tsx # Custom SQL query editor & 15 templates
│   │   ├── database-er-diagram.tsx  # SVG vector interactive ER & Mermaid viewer
│   │   ├── listing-card.tsx         # Soft-modern item presentation card
│   │   ├── marketplace-provider.tsx # React context for user session
│   │   ├── navbar.tsx               # Top navigation with unread badges
│   │   └── offer-modal.tsx          # Cash offer modal with counter options
│   └── lib/
│       ├── auth.ts                  # Password hashing & JWT token handling
│       ├── catalog.ts               # Static catalog taxonomy & constants
│       ├── prisma.ts                # Prisma client singleton
│       ├── session.ts               # Session verification & auth guards
│       └── utils.ts                 # Formatting helpers & CSS class merges
├── docker-compose.yml         # Containerized PostgreSQL 16 & app
├── Dockerfile                 # Multi-stage production container build
├── package.json               # Node.js project manifest & dependencies
└── tailwind.config.ts         # Stitch design system tokens & colors
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or v20.x+
- **Docker Desktop** (Recommended) or **PostgreSQL 16+**
- **Git**

---

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/H4R5H1L-27/BaterHub.git
cd BaterHub
npm install
```

---

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Your default `.env` is pre-configured to run PostgreSQL on port `5433` (to avoid collisions with any native PostgreSQL running on `5432`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/productexchange?schema=public"
JWT_SECRET="dev-super-secret-jwt-key-replace-in-production-random-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
UPLOAD_STORAGE_PROVIDER="local"
```

---

### 3. Start PostgreSQL Database
Using Docker (Recommended):
```bash
docker compose up -d db
```
> The database will boot on port `localhost:5433` with database `productexchange` and credentials `postgres:postgres`.

Push the Prisma schema to create the tables:
```bash
npx prisma db push
```

---

### 4. Start Development Server
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser!

> 💡 **Instant Demo Auto-Load**: The application automatically detects if the database is fresh and auto-loads **36 real-photo items** (18 books + 18 tech products), **10 trader personas**, active barter proposals with handshake PIN tokens, cash offers, and chat messages on first load! No manual seed required for demo evaluations.

---

### 🔄 Optional: Manual Re-Seed Database
To reset and re-populate the rich dataset at any time:
```bash
npm run seed
```
Or via REST API:
```bash
curl -X POST http://localhost:3000/api/seed
```

---

### 🛑 How to Stop the Servers
To cleanly stop the running development environment:

1. **Stop the Next.js Web Server**:
   Press `Ctrl + C` in the terminal running `npm run dev`.

2. **Stop the PostgreSQL Container**:
   ```bash
   docker compose stop db
   ```

3. **To completely shut down and remove containers**:
   ```bash
   docker compose down
   ```
   *(To wipe all database volumes and start completely fresh: `docker compose down -v`)*

---

## 🎭 Pre-Configured Test Personas

All pre-configured demo personas use the shared password: **`password123`**

You can switch between any of these accounts with **1-click** directly on the **[/login](http://localhost:3000/login)** screen:

| Persona | Role & Focus | Location | Completed Swaps | 1-Click Login |
|---|---|---|:---:|:---:|
| **Marcus Chen** | Hardware Geek, Keyboards & Audiophile | San Francisco, CA | 18 Swaps | `marcus@example.com` |
| **Alex Turner** | Senior Software Engineer & Distributed Systems | New York, NY | 22 Swaps | `alex@example.com` |
| **Sarah Jenkins** | Literature PhD Candidate & Book Preservationist | Boston, MA | 38 Swaps | `sarah@example.com` |
| **Chloe Zhao** | Staff Product Designer & Apple Silicon Specialist | Seattle, WA | 15 Swaps | `chloe@example.com` |
| **Julian Vance** | Vintage Camera Restorer & Analog Synth Artisan | Portland, OR | 27 Swaps | `julian@example.com` |
| **Elena Rostova** | UT Austin Senior Biology / STEM Scholar | Austin, TX | 14 Swaps | `elena@example.com` |
| **David Miller** | Audio Engineer & Strategy Board Game Collector | Seattle, WA | 29 Swaps | `david@example.com` |

---

## 🧪 Step-by-Step Feature Testing Guide

### 1. Testing the In-Person Handshake PIN Settlement (`/offers`)
1. Log in as **Marcus Chen** using the 1-Click Persona Switcher.
2. Navigate to **Swaps & Offers** (`/offers`).
3. Notice the top banner: *"In-Person Handshake PIN Verification"*.
4. On any proposal card marked `ACCEPTED`, look for the code pill (e.g. `TRD-8492`).
5. Click the **"Auto-Fill"** button next to the PIN code. The code will automatically populate the input field.
6. Click **"Verify & Settle Deal"**.
7. The database will process the verification:
   - Barter proposal transitions from `ACCEPTED` to `COMPLETED`.
   - Associated listings transition to `TRADED`.
   - The user's `totalTrades` counter increments.
   - An in-thread completion message and notification are generated.

### 2. Testing the Custom SQL Studio (`/database`)
1. Navigate to **Database Hub** (`/database`) via the header link or footer.
2. Click the **"3. Custom SQL Studio & Workbench"** tab.
3. Notice the query editor starts with: *"Ready to Execute - Select a template or write SQL above..."*
4. Click on any template from the left rail (e.g., *"Product Listings by Price (Asc)"* under **Simple Queries**).
5. Click **"Execute SQL (PostgreSQL)"**.
6. The query executes live against PostgreSQL 16, displaying elapsed milliseconds, row count, and a formatted data grid.
7. Try modifying the query (e.g. add `LIMIT 3`) and click **Execute SQL** again to verify live execution.

### 3. Testing Real-Time Trade Chat & Deal Cards (`/messages`)
1. Open `/listings` and select an item owned by another trader.
2. Click **"Message Trader"** or **"Propose Barter"**.
3. In `/messages`, send an offer adjustment chip (*Offer +$10 Cash*).
4. The system posts an interactive deal card into the conversation thread.

---

## 📋 Available Scripts

```bash
npm run dev           # Start Next.js local development server (port 3000)
npm run build         # Compile production Next.js bundle and type-check
npm run start         # Start Next.js production server
npm run seed          # Seed PostgreSQL database with test personas & listings
npm run lint          # Run ESLint check
npx prisma studio     # Open Prisma visual database inspector (port 5555)
npx prisma db push    # Synchronize Prisma schema with PostgreSQL database
```

---

## 🐳 Docker Deployment

To launch BarterHub along with a containerized PostgreSQL 16 database in a single command:

```bash
# Build and launch containers in background
docker-compose up --build -d

# Run Prisma schema push and database seed inside the container
docker-compose exec app npx prisma db push
docker-compose exec app npm run seed
```

The application will be accessible at **http://localhost:3000**.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
