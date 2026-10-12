# BarterHub — Modern Circular Peer-to-Peer Product & Book Exchange Platform

<p align="center">
  <img src="public/screenshots/barterhub-logo.png" alt="BarterHub Brand Logo" width="300" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Neo4j-5.26_Graph_Database-008CC1?logo=neo4j&logoColor=white" alt="Neo4j" />
  <img src="https://img.shields.io/badge/Cypher-Graph_Queries-008CC1" alt="Cypher" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Design_System-Stitch_Soft_Modernism-4648D4" alt="Design System" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

**BarterHub** is an enterprise-grade circular classifieds and exchange platform engineered for swapping, buying, and selling second-hand books, academic course materials, and high-performance tech gear. It delivers a sustainable, zero-cash peer economy through direct item-for-item bartering, hybrid cash top-up settlements, in-thread deal negotiation cards, and physical handover delivery safety codes.

BarterHub implements a **Polyglot Persistence Architecture**:
1. **PostgreSQL 16 (Relational OLTP):** Manages user authentication, catalog items, transactional ACID integrity, chat threads, and peer reviews.
2. **Neo4j Graph Database (NoSQL Network OLAP):** Solves multi-party circular liquidity bottlenecks by discovering 3-party circular swap cycles ($A \rightarrow B \rightarrow C \rightarrow A$) via $\mathcal{O}(1)$ index-free adjacency graph traversal.

---

## 📑 Table of Contents

- [Visual Showcase & Screen Walkthrough](#-visual-showcase--screen-walkthrough)
- [Platform Architecture & Site Map](#-platform-architecture--site-map)
- [Polyglot Persistence & NoSQL Justification](#-polyglot-persistence--nosql-justification-neo4j)
- [Interactive Database Hub & SQL Studio (`/database`)](#-interactive-database-hub--sql-studio-database)
- [Smart Swap Chains: Multi-Party Circular Barter Engine](#-smart-swap-chains-multi-party-circular-barter-engine)
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
4-step progressive listing wizard with adaptive form schemas for tech gear and books, algorithmic valuation spectrum slider, target wishlist tags, drag-and-drop local image uploads with primary cover photo selection, simplified meetup location input with quick suggestions, and a sticky live marketplace feed card preview. Protected with stage arrival guards and DOM key isolation against accidental skips.

![Post New Barter Listing Wizard](public/screenshots/post-listing.png)

---

### 3b. ✏️ Owner Listing Editing & Real-Time Preview (`/listings/:id/edit`)
Dedicated listing management page enabling owners to modify active listings with pre-populated values, split-screen real-time card preview, category-specific detail editing (`BookDetails` / `ProductDetails`), price history tracking, local image upload/removal, wishlist tag management, and meetup location updates. Strict authorization guards reject unauthorized non-owner edits with `403 Forbidden`.

---

### 4. 🤝 Offers Hub & In-Person Handover Safety Codes (`/offers`)
End-to-end deal management with inbound and outbound negotiation cards, counter-offer rounds, and secure role-based delivery verification codes. In every physical exchange, the recipient holds the secret code and the deliverer must obtain and enter it upon inspection to complete the trade.

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

### 10. 🗄️ Relational Database Hub & SQL Studio (`/database`)
Interactive PostgreSQL 16 schema explorer, SVG vector entity-relationship diagram with zoom/pan controls, live Mermaid diagram rendering, 13 domain enums catalog, and a live custom SQL studio with 15 editable query templates.

---

### 11. 🕸️ NoSQL Graph Database Explorer & Cypher Workbench (`/database` Tab 6)
Dedicated workbench for the **Neo4j Graph Database** integration. Displays live graph topology, node degree centralities, 2-way direct swaps, 3-way circular loop detection, live Cypher query execution, and computational complexity benchmarks ($\mathcal{O}(k)$ vs recursive SQL joins).

![NoSQL Graph Database Explorer](public/screenshots/neo4j-graph-explorer.png)

---

## 🗺️ Platform Architecture & Site Map

```mermaid
graph TD
  Home["🏠 Homepage (/)<br/>• Hero & Value Proposition<br/>• Trending Search Pills<br/>• Featured Barters & Circular Bento"]
  Browse["🔍 Catalog & Filters (/listings)<br/>• Faceted Filter Rail<br/>• Valuation Histogram<br/>• Search & Active Chips<br/>• Soft Modern Cards"]
  NewListing["➕ Post Barter Ad (/listings/new)<br/>• Step 1-4 Wizard<br/>• Adaptable Category Specs<br/>• Valuation Slider & Wishlist Tags<br/>• Sticky Live Marketplace Preview"]
  ListingDetail["📦 Item Detail (/listings/:id)<br/>• Concentric Media Gallery<br/>• Barter / Cash CTAs<br/>• Trader Trust Dossier<br/>• Barter Modal / Offer Modal"]
  EditListing["✏️ Edit Listing (/listings/:id/edit)<br/>• Pre-Populated State<br/>• Real-Time Preview<br/>• Local Image Upload & Reorder<br/>• Owner Access Guards"]
  Offers["🤝 Offers Hub (/offers)<br/>• Inbound / Outbound Barters<br/>• Cash Offers Desk<br/>• Smart Swap Chains (Circular Loops)<br/>• In-Person Safety Code Verification"]
  Messages["💬 Trade Chat (/messages)<br/>• Auth-Gated Polling Chat<br/>• In-Thread Cash Offer Cards<br/>• In-Thread Barter Proposal Cards<br/>• Conversation Rail"]
  Dashboard["📊 Management Desk (/dashboard)<br/>• 4 Bento Analytics Cards<br/>• Views Sparkline Graph<br/>• Inventory Manager & Status Toggles<br/>• Quick Actions & Edit Triggers"]
  Favorites["❤️ Saved Watchlist (/favorites)<br/>• Mutual Match Recommendation Alert<br/>• Saved Listing Grid<br/>• Quick Propose Actions"]
  Compare["⚖️ Comparison Matrix (/compare)<br/>• Side-by-Side Analysis Table<br/>• Valuation & Condition Alignment<br/>• Safe Meetup & Direct CTAs"]
  Profile["👤 Trader Reputation (/profile/:id)<br/>• Trust Scorecard (100% Meets)<br/>• Verified Campus Badges<br/>• Completed Trades & Reviews"]
  Auth["🔐 Auth & Persona Sandbox (/login & /register)<br/>• 1-Click Rapid Persona Switcher<br/>• Barter Guarantee Standards<br/>• Secure Email / Password"]
  DB["🗄️ Database & Architecture Hub (/database)<br/>• Tab 1: 16 Relational Models<br/>• Tab 2: Interactive ER & Mermaid<br/>• Tab 3: Custom SQL Studio (15 Queries)<br/>• Tab 4: 13 Custom Enums<br/>• Tab 5: Production DDL Migration<br/>• Tab 6: Neo4j NoSQL Graph Explorer & Cypher"]

  Home --> Browse
  Home --> NewListing
  Home --> Auth
  Home --> DB
  Browse --> ListingDetail
  Browse --> Compare
  ListingDetail --> Offers
  ListingDetail --> Messages
  ListingDetail --> EditListing
  Offers --> Messages
  Offers --> Dashboard
  Dashboard --> NewListing
  Dashboard --> EditListing
  Browse --> Favorites
  ListingDetail --> Profile
```

---

## 🚀 Polyglot Persistence & NoSQL Justification (Neo4j)

For comprehensive technical analysis, algorithmic proofs, and benchmark tables, read the standalone documentation:  
👉 **[DATABASE_JUSTIFICATION.md](DATABASE_JUSTIFICATION.md)**

### University / Course Evaluation Requirement
* **Requirement:** Augment the relational database with a production-grade **NoSQL database** (other than MongoDB) solving a real, non-trivial engineering requirement native to the domain.
* **Selected Technology:** **Neo4j Graph Database (v5.26)** with Cypher Query Language and Bolt Protocol.

### The Problem: Multi-Party Circular Barter Deadlocks
In traditional 1-to-1 bartering, an exchange fails whenever two parties lack a **Double Coincidence of Wants**:
* **Marcus** owns *Neuromancer* and wants *Clean Code*.
* **Alex** owns *The Pragmatic Programmer* and wants *Neuromancer*.
* **Sarah** owns *Clean Code* and wants *The Pragmatic Programmer*.

None of these users can execute a direct 2-party trade. However, as a **closed circular barter chain**, 100% of desired items can be exchanged without any cash intermediation:
$$\text{Marcus} \xrightarrow{\text{gives}} \text{Alex} \xrightarrow{\text{gives}} \text{Sarah} \xrightarrow{\text{gives}} \text{Marcus}$$

### Why Relational SQL Fails at Cycle Detection
Finding $k$-hop circular loops in a relational database requires recursive Common Table Expressions (`WITH RECURSIVE`) or self-joining the `Listing` and `BarterProposal` tables $k$ times:
```sql
SELECT ... FROM "Listing" l1
JOIN "BarterProposal" b1 ON l1.id = b1."targetListingId"
JOIN "Listing" l2 ON b1."offeredListingId" = l2.id
JOIN "BarterProposal" b2 ON l2.id = b2."targetListingId"
JOIN "Listing" l3 ON b2."offeredListingId" = l3.id
JOIN "BarterProposal" b3 ON l3.id = b3."targetListingId"
WHERE b3."offeredListingId" = l1.id;
```
* **Computational Complexity in SQL:** $\mathcal{O}(|V|^k)$ where $|V|$ is the number of listings. Each join requires table scans or index lookups, creating quadratic disk I/O bottlenecks.
* **Computational Complexity in Neo4j:** $\mathcal{O}(k \cdot \bar{d})$ where $\bar{d}$ is the average degree of a node. Neo4j uses **Index-Free Adjacency** — each node directly stores physical memory pointers to its adjacent edges and neighboring nodes. Traversing relationships takes constant time $\mathcal{O}(1)$ per hop regardless of total database volume!

### Live Dual-Engine Implementation
* **Production Driver:** Implemented via official `neo4j-driver` connecting to Neo4j Bolt port `7687` (`neo4j://localhost:7687`).
* **Deterministic Fallback Engine:** Implemented in `src/lib/neo4j.ts` using Tarjan's strongly connected components and DFS cycle detection, guaranteeing that evaluations run with zero configuration even if Docker is not active.

---

## 🗄️ Interactive Database Hub & SQL Studio (`/database`)

The `/database` page (accessible from the top navigation bar as **Architecture**) provides an interactive technical workbench designed for database administrators and course examiners:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  /database Navigation Tabs                                                             │
├──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬─────────────┤
│ 1. Relational│ 2. ER &      │ 3. Custom    │ 4. Domain    │ 5. SQL DDL   │ 6. NoSQL    │
│    Models    │    Mermaid   │    SQL Studio│    Enums     │    Migration │    Graph Hub│
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

### Tab 1: Relational Schema & Fields (16 Models)
* Interactive model browser displaying every table, column, TypeScript type, primary key, foreign key, nullability constraint, and bidirectional Prisma relation.

### Tab 2: Interactive ER & Mermaid Architecture
* **Vector SVG Interactive Canvas:** Draggable nodes, zoom/pan controls, Crow's foot relation curves, and domain filters (*All Models*, *Core Users & Trust*, *Catalog & Specs*, *Deals & Handshake*, *Chat & System*).
* **Live Mermaid ER Visualizer:** Renders the live relational entity-relationship diagram with 1-click code copying.

### Tab 3: Custom SQL Studio & Workbench (Live PostgreSQL Engine)
* **Read-Only Safety Whitelist:** Only `SELECT` and `WITH` queries are permitted. Mutating statements (`DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`) are blocked by the security AST parser.
* **15 Production Query Templates:**
  * **Simple (Single-Table):** Product Listings by Price, Active Users, Textbooks Catalog, Notifications Log, Bookmarks.
  * **Relational Joins & Swaps:** Active Listings with Owners, Pending Barters with Cash Top-Up, Book Specifications, Cash Offers with Buyer Context, Peer Reviews Breakdown.
  * **Complex Analytics & Aggregations:** Supply Breakdown by Exchange Type, Top Traders by Volume, Chat Conversations by Message Volume, Average User Rating Breakdown, City-Level Barter Liquidity.

### Tab 4: Enums & Custom PostgreSQL Types (13 Domain Enums)
* Catalogues all PostgreSQL enumerated types including `ListingType`, `ExchangeType`, `ItemCondition`, `AcademicSubject`, `BookFormat`, `BarterStatus`, `OfferStatus`, `MessageType`, `NotificationType`, and `UserRole`.

### Tab 5: Production SQL Creation DDL & Migration Scripts
* Displays the complete, ordered 48-statement PostgreSQL DDL script used to provision BarterHub from scratch (Extensions, Enums, Tables, Indexes, Constraints, Seed Bootstrap).
* Features 1-click "Copy DDL" and direct `.sql` file download.

### Tab 6: NoSQL Graph Explorer & Cypher Workbench (Neo4j)
* **Live Graph Metrics:** Total Nodes, Directed Edges, Degree Centrality, and Detected Circular Cycles.
* **Cycle Inspector:** Real-time breakdown of **2-Way Direct Swaps** (100% Cashless) and **3-Way Circular Barter Loops** (Multi-Party Liquidity).
* **Interactive Cypher Workbench:** Execute live Cypher queries against the graph with 5 built-in Cypher templates:
  * *Find All 3-Party Circular Barter Loops*
  * *High-Degree Liquidity Hub Users*
  * *Direct 2-Way Mutually Desired Swaps*
  * *Cross-Category Barter Demand Matrix*
  * *Global Graph Neighborhood Traversal*
* **Benchmark Complexity Comparison Table:** Direct $\mathcal{O}(1)$ index-free adjacency vs $\mathcal{O}(V^k)$ recursive SQL joins matrix.

---

## 🔄 Smart Swap Chains: Multi-Party Circular Barter Engine

Accessible directly from the **`/offers`** screen under the **"Smart Swap Chains"** tab:

### 1. Automatic Detection Engine
* Multi-party trade proposals are **automatically detected** in the background based on algorithmic compatibility thresholds:
  * **Confidence Score Threshold:** $\ge 0.85$ (85% compatibility between items and wishlist keywords).
  * **Chain Size:** Exactly 3 distinct participants ($A \rightarrow B \rightarrow C \rightarrow A$).
  * **Direct Value Parity:** Items qualify within standard barter price tolerance and non-cash-only settings.
  * **Personalized Prioritization:** The engine specifically matches and populates swap chains involving the currently authenticated trader.

### 2. Multi-Party Consent Flow
* A circular trade cannot execute until **all 3 participants review and accept**:
  * Your card is tagged with a bold **"You"** badge and offers **Accept Swap** / **Decline** action buttons.
  * Other participants' cards display their real-time consent status (**Accepted**, **Pending**, **Declined**) without allowing you to act on their behalf.
  * If any participant declines, the trade chain transitions to `CANCELLED`.
  * When all 3 accept, the trade chain activates and generates in-person handover safety codes.

### 3. Realistic In-Person Handover Safety Codes (Zero Self-Verification Flaws)
To prevent fraudulent trade completion, the exchange verification follows real-world peer-to-peer delivery semantics:
* **Item You Receive (Incoming):** You are the **Receiver**. You hold the secret **Confirmation Code** (`PIN-XXXX`). You share this code with the deliverer *only after* you meet in person and inspect the item. (You have no input box — you cannot verify yourself!).
* **Item You Deliver (Outgoing):** You are the **Deliverer**. You do *not* know the recipient's code in advance (it is masked by the server as `••••••••`). You meet the recipient, hand over the item, ask them for their code, and type it into your verification box.
* **Third-Party Exchange:** The handover between the other two participants is read-only — you cannot see their codes or verify their step.
* **Completion Reward:** Once all 3 handovers are confirmed, the trade transitions to `COMPLETED` and awards transaction counts and reputation score points in PostgreSQL.

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

### Complete Model Inventory (16 Tables)

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

#### Listings & Catalog
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/listings` | Search and filter listings (query, type, exchange, price range) | Public |
| `POST` | `/api/listings` | Create a new listing with book or product details | Authenticated |
| `GET` | `/api/listings/:id` | Get comprehensive item details, owner profile, specs | Public |
| `PATCH` / `PUT` | `/api/listings/:id` | Update listing title, price, specs, status, location, and images | Owner |
| `DELETE` | `/api/listings/:id` | Archive or delete listing | Owner |
| `GET` | `/api/listings/my` | Get current user's active, pending, and traded items | Authenticated |

### 🖼️ Media & Uploads
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/upload` | Upload device image files (multipart/form-data, PNG/JPG/WEBP/GIF, up to 10MB) | Authenticated / Public |

### 1-on-1 Barters & Cash Offers
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/barters` | List inbound and outbound barter proposals | Authenticated |
| `POST` | `/api/barters` | Submit item-for-item or hybrid barter proposal | Authenticated |
| `GET` | `/api/barters/:id` | Get barter proposal details and status | Participant |
| `PATCH` | `/api/barters/:id` | Accept, counter, or decline barter proposal | Participant |
| `POST` | `/api/barters/verify-pin` | Verify 6-digit Handshake PIN (`TRD-XXXX`) and complete deal | Participant |
| `GET` | `/api/offers` | List cash offers for user listings | Authenticated |
| `POST` | `/api/offers` | Submit a cash offer on an item | Authenticated |
| `PATCH` | `/api/offers/:id` | Counter or accept a cash offer | Listing Owner |

### 🔄 Multi-Party Circular Swaps (Smart Swap Chains)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/trades/multi-party` | Fetch circular swap chains involving the authenticated user (PINs masked) | Authenticated |
| `POST` | `/api/trades/multi-party/:id/respond` | Record user's personal `ACCEPT` or `DECLINE` on circular swap | Participant |
| `POST` | `/api/trades/multi-party/:id/verify` | Submit recipient's safety code to confirm physical delivery step | Deliverer |

### 🕸️ NoSQL Graph Database & Cypher
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/graph/overview` | Fetch live graph topology, centrality metrics, and detected cycles | Public / Dev |
| `POST` | `/api/graph/cypher` | Execute read-only Cypher graph queries | Public / Dev |
| `POST` | `/api/graph/sync` | Trigger synchronization of PostgreSQL data into Neo4j graph | Dev / Admin |

### Database & Developer Tools
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/database/query` | **Execute read-only SQL queries against PostgreSQL 16** | Public / Dev |
| `GET` | `/api/health` | Health check endpoint returning database connectivity | Public |
| `POST` | `/api/seed` | Trigger database re-seed with test data | Dev |

---

## 📁 Project Directory Structure

```
productexchangeplat/
├── DATABASE_JUSTIFICATION.md  # Comprehensive NoSQL Neo4j academic justification report
├── prisma/
│   ├── schema.prisma          # Comprehensive 16-model PostgreSQL schema
│   └── seed.ts                # Realistic seed script with 10 demo personas & 36 items
├── public/
│   ├── screenshots/           # High-resolution screenshots & graph explorer captures
│   └── uploads/               # Dynamic local user-uploaded image directory
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # Login & 1-Click Persona Switcher
│   │   │   └── register/page.tsx    # User registration
│   │   ├── api/                     # Next.js App Router API endpoints
│   │   │   ├── auth/                # Login, register, me, logout
│   │   │   ├── barters/             # Proposals & verify-pin endpoint
│   │   │   ├── database/query/      # Safe read-only SQL executor
│   │   │   ├── graph/               # Neo4j overview, cypher runner & sync
│   │   │   │   ├── cypher/route.ts
│   │   │   │   ├── overview/route.ts
│   │   │   │   └── sync/route.ts
│   │   │   ├── listings/            # CRUD & promote endpoints
│   │   │   ├── messages/            # Real-time chat & deal cards
│   │   │   ├── offers/              # Cash offer management
│   │   │   ├── trades/multi-party/  # Circular barter creation, respond & verify
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/respond/route.ts
│   │   │   │   └── [id]/verify/route.ts
│   │   │   └── upload/route.ts      # Multi-part local image file upload
│   │   ├── compare/page.tsx         # Side-by-side comparison matrix
│   │   ├── dashboard/page.tsx       # Seller management desk & stats
│   │   ├── database/page.tsx        # 6-tab Database Hub, SQL Studio & Neo4j Explorer
│   │   ├── favorites/page.tsx       # Bookmarks & mutual match alerts
│   │   ├── listings/
│   │   │   ├── page.tsx             # Faceted catalog & histogram slider
│   │   │   ├── new/page.tsx         # 4-step listing wizard & image upload
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx         # Item dossier & proposal launcher
│   │   │   │   └── edit/page.tsx    # Owner listing editing & live preview
│   │   ├── messages/page.tsx        # Trade chat & deal cards
│   │   ├── offers/page.tsx          # Swaps hub, handshake & Smart Swap Chains
│   │   ├── profile/[id]/page.tsx    # Trader reputation scorecard
│   │   ├── layout.tsx               # Root layout & navigation shell
│   │   └── page.tsx                 # Homepage with hero & circular bento
│   ├── components/
│   │   ├── database/                # Interactive Database Studio tools
│   │   │   ├── custom-sql-workbench.tsx
│   │   │   ├── database-ddl-viewer.tsx
│   │   │   ├── database-er-diagram.tsx
│   │   │   └── neo4j-graph-explorer.tsx  # NoSQL Neo4j Explorer & Cypher Runner
│   │   ├── layout/                  # Shell & global navigation
│   │   │   ├── footer.tsx
│   │   │   └── navbar.tsx
│   │   ├── marketplace/             # Cards, feeds, and discovery
│   │   │   ├── category-rail.tsx
│   │   │   ├── compare-tray.tsx
│   │   │   ├── listing-card.tsx
│   │   │   └── multi-party-trades-view.tsx # Smart Swap Chains UI component
│   │   └── modals/                  # Swap proposals, cash offers & reviews
│   └── lib/
│       ├── auth.ts                  # Password hashing & JWT token handling
│       ├── multi-party-trade.ts     # Multi-party circular barter consensus engine
│       ├── neo4j.ts                 # Neo4j Bolt driver + embedded graph traversal engine
│       ├── prisma.ts                # Prisma client singleton
│       └── session.ts               # Session verification & auth guards
├── docker-compose.yml         # Containerized PostgreSQL 16 & Neo4j 5.26
├── Dockerfile                 # Multi-stage production container build
├── package.json               # Node.js project manifest & dependencies
└── tailwind.config.ts         # Stitch design system tokens & colors
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js**: v18.x or v20.x+
* **Docker Desktop** (Recommended) or local **PostgreSQL 16+** & **Neo4j 5+**
* **Git**

---

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/H4R5H1L-27/BaterHub.git
cd productexchanceplat
npm install
```

---

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Your default `.env` is configured for both databases:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/productexchange?schema=public"
JWT_SECRET="dev-super-secret-jwt-key-replace-in-production-random-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional Neo4j Connection (Embedded fallback runs automatically if unconfigured)
NEO4J_URI="neo4j://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="password"
```

---

### 3. Start Database Services via Docker
```bash
docker compose up -d
```
> Boots **PostgreSQL 16** on port `5432` and **Neo4j 5.26** on port `7474` (HTTP Browser) and `7687` (Bolt Protocol).

Push the Prisma schema to create the PostgreSQL tables:
```bash
npx prisma db push
```

Seed the database with 10 personas, 36 listings, active proposals, and chat history:
```bash
npm run seed
```

---

### 4. Start Development Server
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🎭 Pre-Configured Test Personas

All pre-configured demo personas use the shared password: **`password123`**

You can switch between any of these accounts with **1-click** directly on the **[/login](http://localhost:3000/login)** screen:

| Persona | Role & Focus | Location | Completed Swaps | 1-Click Login |
|---|---|---|:---:|:---:|
| **Sarah Jenkins** | Literature PhD Candidate & Book Preservationist | Boston, MA | 38 Swaps | `sarah@example.com` |
| **Alex Turner** | Senior Software Engineer & Distributed Systems | New York, NY | 22 Swaps | `alex@example.com` |
| **Marcus Chen** | Hardware Geek, Keyboards & Audiophile | San Francisco, CA | 18 Swaps | `marcus@example.com` |
| **Julian Vance** | Vintage Camera Restorer & Keyboards | Portland, OR | 27 Swaps | `julian@example.com` |
| **Chloe Zhao** | Staff Product Designer & Apple Silicon Specialist | Seattle, WA | 15 Swaps | `chloe@example.com` |
| **Elena Rostova** | UT Austin Senior Biology / STEM Scholar | Austin, TX | 14 Swaps | `elena@example.com` |
| **Liam O'Connor** | University of Chicago STEM Mathematics | Chicago, IL | 19 Swaps | `liam@example.com` |
| **Maya Patel** | Medical School Candidate & Organic Chemistry | Philadelphia, PA | 21 Swaps | `maya@example.com` |
| **David Miller** | Audio Engineer & Board Game Collector | Seattle, WA | 29 Swaps | `david@example.com` |
| **Sophia Ramirez** | Mechanical Keyboard Artisan & Switch Modder | Los Angeles, CA | 12 Swaps | `sophia@example.com` |

---

## 🧪 Step-by-Step Feature Testing Guide

### 1. Testing Smart Swap Chains (Circular 3-Way Swaps) (`/offers`)
1. Log in as **Sarah Jenkins** using the 1-Click Persona Switcher on `/login`.
2. Navigate to **Offers Hub** (`/offers`) and click the **"Smart Swap Chains (2)"** tab.
3. You will see auto-detected circular proposals where you give *Clean Code* to receive *HHKB Keyboard*.
4. On your participant card, notice the bold **"You"** badge and click **"Accept Swap"**.
5. Log in as the other pending participant (e.g. **Alex Turner**) and accept.
6. Once all 3 accept, the trade chain activates and presents **Step 2: Physical Meetup & Handover Verification**:
   * **Item You Receive:** Displays your secret confirmation code (`PIN-XXXX`) to share with the person delivering to you.
   * **Item You Deliver:** Displays an input field requiring the recipient's code.
   * **Third-Party Exchange:** Completely read-only with no leaked codes.
7. Enter the recipient's code to confirm handover. When all 3 handovers are completed, the trade finishes and credits trade history!

### 2. Testing the Architecture & Database Hub (`/database`)
1. In the top navbar, click **Architecture** (or navigate to `/database`).
2. **Test Tab 3 (SQL Studio):** Click a query template (e.g., *"Product Listings by Price"*) and click **"Execute SQL (PostgreSQL)"**. View the live execution time and results table.
3. **Test Tab 5 (SQL Migration DDL):** Inspect the full 48-statement PostgreSQL DDL creation script and test the **"Copy Section"** or **"Download .sql Script"** button.
4. **Test Tab 6 (NoSQL Graph Explorer & Neo4j):**
   * Inspect the **Graph Topology Metrics** (Nodes, Directed Edges, Degree Centrality).
   * Review the detected **2-Way Direct Swaps** and **3-Way Circular Barter Loops**.
   * Run a live Cypher query using the **Cypher Workbench** to query graph cycles in real time.
   * Review the **Complexity Comparison Table** detailing $\mathcal{O}(1)$ index-free adjacency vs recursive SQL joins.

### 3. Testing 1-on-1 Barter Handover Verification (`/offers`)
1. In `/offers`, open the **Received Barters** tab.
2. For an `ACCEPTED` barter, notice your private **Handover Confirmation Code** displayed clearly for in-person sharing.
3. Open the **Sent Barters** tab and observe that deliverers are instructed to request the code upon meetup and enter it into the verification input.

### 4. Testing Post Creation with Local Image Upload & Location (`/listings/new`)
1. Click **"Post Ad"** in the top navigation (or navigate to `/listings/new`).
2. **Step 1 (Category & Specs):** Fill in title, description, and specs (or leave defaults for testing). Click **"Continue to Step 2"**.
3. **Step 2 (Photos & Proof):**
   * Drag and drop an image file (PNG, JPG, WEBP) into the upload dropzone or click to browse files from your computer.
   * The image is uploaded directly via `/api/upload` to `public/uploads/` with immediate visual feedback.
   * Click any uploaded thumbnail in the gallery to mark it with the **Cover** photo badge.
   * Click **"Continue to Step 3"**.
4. **Step 3 (Valuation & Protocol):** Configure trade mode (**True Barter**, **Hybrid Swap**, or **Cash Direct**) and type wishlist tags. Click **"Continue to Step 4"**.
5. **Step 4 (Location & Handover):**
   * Enter your preferred meetup location/spot or select a quick suggestion pill (*Campus Student Union*, *Public Library*).
   * Review the **Listing Summary Ready to Publish** card summarizing all choices.
   * Click **"Publish Listing & Unlock Barter Matching"** to post your listing.

### 5. Testing Owner Listing Editing & Real-Time Preview (`/listings/:id/edit`)
1. Log in as **Julian Vance** (`julian@example.com`) via the 1-click persona switcher on `/login`.
2. Go to your **Management Desk** (`/dashboard`) or open one of Julian's active listings (`/listings/:id`).
3. Notice the **"Edit"** button on the dashboard toolbar and the **"Edit Posting"** controls banner on the listing page (visible strictly to the owner).
4. Click **"Edit"** to open the dedicated editor at `/listings/:id/edit`.
5. Observe all existing details pre-filled (hardware/book specs, price, condition, images, tags, city/state).
6. Edit the price or title, upload a new photo, and watch the **Live Marketplace Preview** card in the right column update simultaneously.
7. Click **"Save Listing Changes"** to commit the updates (with automatic price history logging) and return to the live listing.
8. Verify authorization: Switching to another user and attempting to edit Julian's listing will display access rejection (`403 Forbidden`).

---

## 📋 Available Scripts

```bash
npm run dev           # Start Next.js local development server (port 3000)
npm run build         # Compile production Next.js bundle and type-check
npm run start         # Start Next.js production server
npm run seed          # Seed database with 10 test personas, 36 listings, barters & chat
npm run lint          # Run ESLint check
npx prisma studio     # Open Prisma visual database inspector (port 5555)
npx prisma db push    # Synchronize Prisma schema with PostgreSQL database
```

---

## 🐳 Docker Deployment

To launch BarterHub along with containerized **PostgreSQL 16** and **Neo4j 5.26** databases:

```bash
# Build and launch all containers in background
docker-compose up --build -d

# Synchronize PostgreSQL schema and seed mock dataset
docker-compose exec app npx prisma db push
docker-compose exec app npm run seed
```

* **Web Application:** `http://localhost:3000`
* **PostgreSQL Database:** `localhost:5432`
* **Neo4j Web Browser:** `http://localhost:7474`
* **Neo4j Bolt Protocol:** `neo4j://localhost:7687`

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
