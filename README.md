# BarterHub — Modern Circular Peer-to-Peer Product & Book Exchange Platform

<p align="center">
  <img src="public/screenshots/barterhub-logo.png" alt="BarterHub Brand Logo" width="300" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16_/_18-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/PostgreSQL_JDBC-Driver_42.7.4-ED8B00?logo=java&logoColor=white" alt="PostgreSQL JDBC" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Design_System-Stitch_Soft_Modernism-4648D4" alt="Design System" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

<p align="center">
  <a href="https://barter-hub-eb6t-36e8czbcd-h4r5h1l-27s-projects.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_BarterHub_on_Vercel-4648D4?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

> 🚀 **Live Production Deployment:** [https://barter-hub-eb6t-36e8czbcd-h4r5h1l-27s-projects.vercel.app](https://barter-hub-eb6t-36e8czbcd-h4r5h1l-27s-projects.vercel.app/)

**BarterHub** is an enterprise-grade circular classifieds and exchange platform engineered for swapping, buying, and selling second-hand books, academic course materials, and high-performance tech gear. It delivers a sustainable peer economy through direct item-for-item bartering, hybrid cash top-up settlements, in-thread deal negotiation cards, and physical handover delivery safety codes.

### Database Architecture:
1. **PostgreSQL Relational Engine:** Primary transactional OLTP database handling user accounts, catalog listings, book details, hardware details, barter proposals, and reviews.
2. **Native PostgreSQL JDBC Module (`jdbc/`):** Standalone Java SE client utilizing `DriverManager.getConnection(...)`, parameterized `PreparedStatement` queries, structured `ResultSet` extraction, and multi-statement ACID transaction rollbacks with pessimistic row locking (`FOR UPDATE`).

---

## 📑 Table of Contents

- [Live Deployment & Production Access](#-live-deployment--production-access)
- [PostgreSQL Native JDBC Architecture (`jdbc/`)](#-postgresql-native-jdbc-architecture-jdbc)
- [Visual Showcase & Screen Walkthrough](#-visual-showcase--screen-walkthrough)
- [Platform Architecture & Site Map](#-platform-architecture--site-map)
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

## 🌐 Live Deployment & Production Access

| Component | Infrastructure | Link / Endpoint |
| :--- | :--- | :--- |
| **Live Web Application** | **Vercel** (Next.js 14 App Router) | [barter-hub-eb6t-36e8czbcd-h4r5h1l-27s-projects.vercel.app](https://barter-hub-eb6t-36e8czbcd-h4r5h1l-27s-projects.vercel.app/) |
| **Source Code Repository** | **GitHub** | [github.com/H4R5H1L-27/BarterHub](https://github.com/H4R5H1L-27/BarterHub) |
| **Primary Relational DB** | **PostgreSQL 16 / Neon** | Fully managed cloud PostgreSQL with connection pooling |
| **Relational JDBC Client** | **PostgreSQL JDBC 42.7.4** (Java SE) | Official Java Driver (`java.sql.*`) in `jdbc/` module |

---

## ☕ PostgreSQL Native JDBC Architecture (`jdbc/`)

In addition to web-tier bindings, BarterHub includes a standalone **Java Database Connectivity (JDBC)** module in [`jdbc/`](jdbc/). It connects directly to PostgreSQL using standard `java.sql.*` APIs.

### 1. Direct JDBC Connection Configuration
Located in [`jdbc/src/com/barterhub/jdbc/DatabaseConnection.java`](jdbc/src/com/barterhub/jdbc/DatabaseConnection.java):

```java
// =========================================================================
// POSTGRESQL JDBC CONNECTION PARAMETERS
// =========================================================================
String url      = "jdbc:postgresql://localhost:5432/productexchange";
String username = "postgres";
String password = "password";

// Step 1: Register the official PostgreSQL JDBC Driver
Class.forName("org.postgresql.Driver");

// Step 2: Establish the Connection
Connection connection = DriverManager.getConnection(url, username, password);
```

### 2. Enterprise JDBC Features Implemented
* **Driver Registration (`Class.forName`):** Loads the official `org.postgresql.Driver` (v42.7.4).
* **Direct Handshake (`DriverManager.getConnection`):** Establishes a direct socket connection to PostgreSQL with automatic SSL negotiation.
* **Parameterized Queries (`PreparedStatement`):** Eliminates SQL injection vulnerabilities across all catalog queries and filtering operations.
* **Pessimistic Concurrency (`SELECT ... FOR UPDATE`):** Locks target listing rows during barter proposal creation to prevent double-booking.
* **ACID Transaction Resilience (`conn.rollback()`):** Wraps multi-row modifications inside explicit transaction boundaries (`conn.setAutoCommit(false)`), reverting intermediate state upon any fault.

### 3. How to Run the JDBC Module
```bash
# Run interactive JDBC console with menu
npm run jdbc

# Run automated 5-phase verification suite
npm run jdbc:auto
```
*(Windows batch and PowerShell scripts are also provided: `jdbc/run.bat` and `jdbc/run.ps1`)*

---

## 📸 Visual Showcase & Screen Walkthrough

BarterHub is crafted with the **Stitch Soft Modernism** design language — blending silky light surfaces, friendly rounded corner radii (24px panels, full pill triggers), electric indigo (`#4648D4`) and vivid violet (`#712AE2`) accents, warm amber valuation badges, and tactile drop shadows.

### 1. 🔍 Catalog & Faceted Search (`/listings`)
Faceted discovery rail featuring an interactive valuation histogram distribution slider, exchange mode filter pills (**True Barter**, **Hybrid Swap**, **Cash Direct**), curriculum tags, condition rubrics, verified campus spot badges, and soft-modern item cards.

<p align="center">
  <img src="public/screenshots/explore-catalog.png" alt="Catalog Explorer" width="850" />
</p>

### 2. 📖 Comprehensive Listing Detail (`/listings/[id]`)
Detailed split-screen item showcase with high-resolution image galleries, technical item specification tables, interactive barter modal triggers, and direct chat cards.

<p align="center">
  <img src="public/screenshots/listing-detail.png" alt="Listing Detail View" width="850" />
</p>

### 3. ✍️ 4-Step Interactive Post Creation Wizard (`/listings/new`)
Step-by-step listing creation wizard:
* **Step 1:** Classification & item category.
* **Step 2:** Deep academic or hardware technical details.
* **Step 3:** Valuation, exchange rules, and trade wishlist.
* **Step 4:** Drag-and-drop local photo uploads with cover selection.

<p align="center">
  <img src="public/screenshots/post-listing.png" alt="Post Creation Wizard" width="850" />
</p>

### 4. 🤝 Deal Negotiation & Handshake Settlement (`/offers`)
Card-based in-thread deal negotiation cards where buyers and sellers can counter-offer cash adjustments and enter 6-digit physical handover security codes.

<p align="center">
  <img src="public/screenshots/offers-handshake.png" alt="Handshake Offers" width="850" />
</p>

### 5. 💬 Instant Messaging & Negotiation (`/messages`)
Real-time peer chat with contextual item preview cards, timestamped messages, and automated system alerts for offer proposals.

<p align="center">
  <img src="public/screenshots/chat-negotiation.png" alt="In-App Messaging" width="850" />
</p>

### 6. 🗄️ Interactive Database Hub & SQL Studio (`/database`)
Centralized database studio featuring an interactive ER diagram, relational model schemas, SQL Query Studio, DDL viewer, and the **PostgreSQL JDBC Architecture Explorer**.

<p align="center">
  <img src="public/screenshots/management-desk.png" alt="Database Studio" width="850" />
</p>

---

## 🗄 Database Schema & Relational Models

The relational schema implements 16 comprehensive models designed with strict referential integrity:

```
  +--------------+          1:N           +-----------------+
  |    "User"    | ---------------------> |    "Listing"    |
  +--------------+                        +-----------------+
         |                                         |
         | 1:N (proposals)                         +--------+--------+
         v                                         | 1:1    | 1:1    |
  +-----------------+                              v        v        |
  | "BarterProposal"|                       +-------------+ +---------------+
  +-----------------+                       |"BookDetails"| |"ProductDetails|
         |                                  +-------------+ +---------------+
         | 1:N                                     ^
         v                                         |
  +-----------------+                              |
  |  "BarterItem"   | -----------------------------+ (Items offered in trade)
  +-----------------+
```

---

## 📁 Project Directory Structure

```
productexchangeplat/
├── jdbc/                      # Standalone PostgreSQL Java JDBC module (JDBC 4.2 Driver & DAO)
│   ├── lib/
│   │   └── postgresql-42.7.4.jar # Official PostgreSQL JDBC Driver
│   ├── src/com/barterhub/jdbc/
│   │   ├── DatabaseConnection.java   # Connection Manager (URL, username, password)
│   │   ├── BarterHubJDBCService.java # JDBC DAO (PreparedStatement & ACID Transactions)
│   │   ├── BarterHubCLI.java         # Interactive Terminal UI & Auto-Test Suite
│   │   └── models/                   # POJO models (ListingSummary, UserProfile)
│   ├── run.bat / run.ps1      # 1-Click build & execution runners
│   └── README.md              # Dedicated JDBC technical documentation
├── prisma/
│   ├── schema.prisma          # Comprehensive 16-model PostgreSQL schema
│   └── seed.ts                # Realistic seed script with 10 demo personas & 36 items
├── public/
│   ├── items/                 # Real item cover & product photography
│   └── screenshots/           # Platform UI captures
├── sql/
│   ├── schema.sql             # Pure SQL DDL definitions for PostgreSQL
│   └── seed.sql               # Pure SQL seed records
├── src/
│   ├── app/                   # Next.js 14 App Router pages & API routes
│   ├── components/            # Soft-Modern UI design components
│   ├── data/                  # Static stores & activity logs
│   ├── lib/                   # Database client, auth, catalog, and utilities
│   └── types/                 # Shared TypeScript interfaces
├── Dockerfile                 # Production multi-stage Docker container definition
├── docker-compose.yml         # Containerized PostgreSQL service
├── package.json               # Node.js dependencies & custom npm scripts
└── README.md                  # Comprehensive documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js**: v18.x or v20.x+
* **Java Development Kit (JDK)**: 17+ or 21+ *(for running the standalone Java JDBC module via `npm run jdbc`)*
* **PostgreSQL 14+** (Local installation or cloud instance)
* **Git**

---

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/H4R5H1L-27/BarterHub.git
cd BarterHub
npm install
```

---

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/productexchange?schema=public"
JWT_SECRET="dev-super-secret-jwt-key-replace-in-production-random-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 3. Seed Database
```bash
npx prisma db push
npm run seed
```

---

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 5. Running the PostgreSQL JDBC Module
```bash
# Launch interactive JDBC console:
npm run jdbc

# Run automated 5-phase JDBC verification suite:
npm run jdbc:auto
```

---

## 📋 Available Scripts

```bash
npm run dev           # Start Next.js development server (port 3000)
npm run build         # Compile production Next.js bundle and type-check
npm run start         # Start Next.js production server
npm run seed          # Seed database with 10 test personas, 36 listings, barters & chat
npm run lint          # Run ESLint check
npm run jdbc          # Launch interactive PostgreSQL Java JDBC console CLI
npm run jdbc:auto     # Run automated 5-point PostgreSQL JDBC test suite
npx prisma studio     # Open Prisma visual database inspector (port 5555)
npx prisma db push    # Synchronize Prisma schema with PostgreSQL database
```

---

## 📄 License
This project is licensed under the **MIT License**.
