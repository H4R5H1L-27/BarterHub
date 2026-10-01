-- ==============================================================================
-- BarterHub PostgreSQL Database Schema (Pure DDL)
-- Standard PostgreSQL Relational Table Definitions for Java JDBC Connectivity
-- ==============================================================================

-- 1. Create Enums / Types
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ListingType" AS ENUM ('BOOK', 'PRODUCT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ExchangeType" AS ENUM ('CASH_ONLY', 'BARTER_ONLY', 'HYBRID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ItemCondition" AS ENUM ('BRAND_NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'RESERVED', 'PENDING_EXCHANGE', 'SOLD', 'TRADED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "BarterStatus" AS ENUM ('PROPOSED', 'COUNTERED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. User Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" VARCHAR(64) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "phone" VARCHAR(50),
    "city" VARCHAR(100) DEFAULT 'New York',
    "state" VARCHAR(50) DEFAULT 'NY',
    "country" VARCHAR(50) DEFAULT 'USA',
    "postalCode" VARCHAR(20),
    "role" "Role" DEFAULT 'USER',
    "isVerified" BOOLEAN DEFAULT false,
    "reputationScore" DOUBLE PRECISION DEFAULT 5.0,
    "totalReviews" INTEGER DEFAULT 0,
    "totalTrades" INTEGER DEFAULT 0,
    "totalSales" INTEGER DEFAULT 0,
    "responseRate" INTEGER DEFAULT 100,
    "avgResponseTime" VARCHAR(50) DEFAULT 'Within 1 hour',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Listing Table
CREATE TABLE IF NOT EXISTS "Listing" (
    "id" VARCHAR(64) PRIMARY KEY,
    "userId" VARCHAR(64) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "listingType" "ListingType" NOT NULL,
    "exchangeType" "ExchangeType" NOT NULL,
    "price" DOUBLE PRECISION,
    "currency" VARCHAR(10) DEFAULT 'USD',
    "isNegotiable" BOOLEAN DEFAULT true,
    "condition" "ItemCondition" NOT NULL,
    "status" "ListingStatus" DEFAULT 'ACTIVE',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "pickupAvailable" BOOLEAN DEFAULT true,
    "shippingAvailable" BOOLEAN DEFAULT false,
    "shippingCost" DOUBLE PRECISION,
    "barterWishlist" TEXT,
    "viewsCount" INTEGER DEFAULT 0,
    "sharesCount" INTEGER DEFAULT 0,
    "previousPrice" DOUBLE PRECISION,
    "isFeatured" BOOLEAN DEFAULT false,
    "isUrgent" BOOLEAN DEFAULT false,
    "isTopAd" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Book Details (1:1 with Listing)
CREATE TABLE IF NOT EXISTS "BookDetails" (
    "id" VARCHAR(64) PRIMARY KEY,
    "listingId" VARCHAR(64) UNIQUE NOT NULL REFERENCES "Listing"("id") ON DELETE CASCADE,
    "isbn" VARCHAR(50),
    "isbn13" VARCHAR(50),
    "author" VARCHAR(255) NOT NULL,
    "publisher" VARCHAR(255),
    "publicationYear" INTEGER,
    "edition" VARCHAR(100),
    "genre" VARCHAR(100),
    "academicSubject" VARCHAR(100),
    "courseCode" VARCHAR(50),
    "hasAnnotations" BOOLEAN DEFAULT false
);

-- 5. Product Details (1:1 with Listing)
CREATE TABLE IF NOT EXISTS "ProductDetails" (
    "id" VARCHAR(64) PRIMARY KEY,
    "listingId" VARCHAR(64) UNIQUE NOT NULL REFERENCES "Listing"("id") ON DELETE CASCADE,
    "category" VARCHAR(100) NOT NULL,
    "subCategory" VARCHAR(100),
    "brand" VARCHAR(100),
    "model" VARCHAR(100),
    "includesOriginalBox" BOOLEAN DEFAULT false,
    "includesAccessories" BOOLEAN DEFAULT false,
    "warrantyStatus" VARCHAR(100)
);

-- 6. Barter Proposal Table
CREATE TABLE IF NOT EXISTS "BarterProposal" (
    "id" VARCHAR(64) PRIMARY KEY,
    "initiatorId" VARCHAR(64) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "recipientId" VARCHAR(64) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "targetListingId" VARCHAR(64) NOT NULL REFERENCES "Listing"("id") ON DELETE CASCADE,
    "cashTopUp" DOUBLE PRECISION DEFAULT 0.0,
    "status" "BarterStatus" DEFAULT 'PROPOSED',
    "exchangeCode" VARCHAR(20),
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Barter Items (Offered in proposal, M:N join table)
CREATE TABLE IF NOT EXISTS "BarterItem" (
    "id" VARCHAR(64) PRIMARY KEY,
    "proposalId" VARCHAR(64) NOT NULL REFERENCES "BarterProposal"("id") ON DELETE CASCADE,
    "listingId" VARCHAR(64) NOT NULL REFERENCES "Listing"("id") ON DELETE CASCADE,
    CONSTRAINT "unique_proposal_listing" UNIQUE ("proposalId", "listingId")
);

-- 8. Reviews Table
CREATE TABLE IF NOT EXISTS "Review" (
    "id" VARCHAR(64) PRIMARY KEY,
    "reviewerId" VARCHAR(64) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "revieweeId" VARCHAR(64) NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "proposalId" VARCHAR(64) REFERENCES "BarterProposal"("id") ON DELETE SET NULL,
    "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
    "comment" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Performance Indexes for JDBC Queries
CREATE INDEX IF NOT EXISTS "idx_listing_status_created" ON "Listing"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_listing_userid" ON "Listing"("userId");
CREATE INDEX IF NOT EXISTS "idx_proposal_initiator" ON "BarterProposal"("initiatorId");
CREATE INDEX IF NOT EXISTS "idx_proposal_recipient" ON "BarterProposal"("recipientId");
CREATE INDEX IF NOT EXISTS "idx_proposal_target" ON "BarterProposal"("targetListingId");
