-- ==============================================================================
-- BarterHub Sample Seed Data (Pure SQL)
-- Inserts realistic trader personas, listings, and proposals for testing JDBC queries
-- ==============================================================================

-- 1. Insert Sample Traders
INSERT INTO "User" ("id", "name", "email", "password", "city", "state", "reputationScore", "totalTrades", "totalReviews")
VALUES 
    ('u_alex', 'Alex Turner', 'alex@example.com', '$2a$10$wK1Vf0zD1rS3n5h6y7j8u9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4', 'New York', 'NY', 4.95, 22, 18),
    ('u_elena', 'Elena Rostova', 'elena@example.com', '$2a$10$wK1Vf0zD1rS3n5h6y7j8u9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4', 'Austin', 'TX', 4.88, 15, 12),
    ('u_david', 'David Miller', 'david@example.com', '$2a$10$wK1Vf0zD1rS3n5h6y7j8u9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4', 'Seattle', 'WA', 4.92, 19, 14),
    ('u_marcus', 'Marcus Chen', 'marcus@example.com', '$2a$10$wK1Vf0zD1rS3n5h6y7j8u9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4', 'San Francisco', 'CA', 4.82, 14, 10),
    ('u_sarah', 'Sarah Jenkins', 'sarah@example.com', '$2a$10$wK1Vf0zD1rS3n5h6y7j8u9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4', 'Boston', 'MA', 4.90, 16, 11)
ON CONFLICT ("email") DO NOTHING;

-- 2. Insert Sample Listings
INSERT INTO "Listing" ("id", "userId", "title", "description", "listingType", "exchangeType", "price", "condition", "status", "city", "state", "barterWishlist")
VALUES
    ('l_ddia', 'u_alex', 'Designing Data-Intensive Applications', 'Definitive guide to distributed systems and storage engines. Immaculate condition, no annotations.', 'BOOK', 'HYBRID', 35.00, 'LIKE_NEW', 'ACTIVE', 'New York', 'NY', 'Database Internals or Clean Architecture'),
    ('l_db_sys', 'u_alex', 'Database System Concepts (7th Edition)', 'Standard collegiate database systems textbook by Silberschatz, Korth, Sudarshan.', 'BOOK', 'HYBRID', 55.00, 'VERY_GOOD', 'ACTIVE', 'New York', 'NY', 'Distributed systems book or mechanical keyboard'),
    ('l_clean_code', 'u_sarah', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Classic programming manual by Robert C. Martin. Essential reading for junior to senior developers.', 'BOOK', 'HYBRID', 28.00, 'LIKE_NEW', 'ACTIVE', 'Boston', 'MA', 'Pragmatic Programmer or Python book'),
    ('l_clrs', 'u_marcus', 'Introduction to Algorithms (CLRS) 4th Edition', 'Comprehensive algorithmic theory textbook covering graph theory, dynamic programming, and data structures.', 'BOOK', 'BARTER_ONLY', 75.00, 'VERY_GOOD', 'ACTIVE', 'San Francisco', 'CA', 'Mechanical keyboard or Sony noise-canceling headphones'),
    ('l_calc', 'u_sarah', 'Calculus: Early Transcendentals (9th Edition)', 'Single and multivariable calculus by James Stewart. Essential STEM prerequisite textbook.', 'BOOK', 'CASH_ONLY', 85.00, 'VERY_GOOD', 'ACTIVE', 'Boston', 'MA', 'Graphing calculator or organic chem text'),
    ('l_sony_xm5', 'u_elena', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'Industry-leading noise cancellation, 30-hour battery, premium carrying case and cables included.', 'PRODUCT', 'BARTER_ONLY', 280.00, 'LIKE_NEW', 'ACTIVE', 'Austin', 'TX', 'Apple iPad Air or STEM textbooks'),
    ('l_keychron', 'u_david', 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard', '75% layout, CNC aluminum body, Banana tactile switches, hot-swappable PCB.', 'PRODUCT', 'HYBRID', 160.00, 'LIKE_NEW', 'ACTIVE', 'Seattle', 'WA', '4K monitor or high-end studio microphone'),
    ('l_ipad_air', 'u_alex', 'Apple iPad Air (11-inch, M2 Chip) Wi-Fi 128GB Space Gray', 'M2 chip, Liquid Retina display, Apple Pencil Pro support. Mint condition with original box.', 'PRODUCT', 'HYBRID', 480.00, 'LIKE_NEW', 'ACTIVE', 'New York', 'NY', 'Fujifilm camera body or high-end laptop'),
    ('l_fuji', 'u_david', 'Fujifilm X-T30 II Mirrorless Digital Camera Body', '26.1MP X-Trans CMOS 4 sensor, classic film simulation modes, 4K video recording.', 'PRODUCT', 'BARTER_ONLY', 680.00, 'BRAND_NEW', 'ACTIVE', 'Seattle', 'WA', 'Apple MacBook or iPad Pro bundle'),
    ('l_steam_deck', 'u_marcus', 'Valve Steam Deck OLED (512GB NVMe SSD)', 'Vibrant 7.4-inch 90Hz OLED display, original carrying case, 45W power supply.', 'PRODUCT', 'BARTER_ONLY', 460.00, 'LIKE_NEW', 'ACTIVE', 'San Francisco', 'CA', 'Gaming laptop or Nintendo Switch OLED + cash')
ON CONFLICT ("id") DO NOTHING;

-- 3. Insert Book Details
INSERT INTO "BookDetails" ("id", "listingId", "isbn", "author", "publisher", "academicSubject", "courseCode")
VALUES
    ('bd_ddia', 'l_ddia', '978-1449373320', 'Martin Kleppmann', 'O''Reilly Media', 'Computer Science', 'CS 452'),
    ('bd_db_sys', 'l_db_sys', '978-0078022159', 'Abraham Silberschatz', 'McGraw-Hill', 'Computer Science', 'CS 186'),
    ('bd_clean_code', 'l_clean_code', '978-0132350884', 'Robert C. Martin', 'Prentice Hall', 'Computer Science', 'CS 200'),
    ('bd_clrs', 'l_clrs', '978-0262046305', 'Thomas H. Cormen', 'MIT Press', 'Computer Science', 'CS 170'),
    ('bd_calc', 'l_calc', '978-1337613927', 'James Stewart', 'Cengage Learning', 'Mathematics', 'MATH 1A')
ON CONFLICT ("id") DO NOTHING;

-- 4. Insert Product Details
INSERT INTO "ProductDetails" ("id", "listingId", "category", "brand", "model", "includesOriginalBox", "warrantyStatus")
VALUES
    ('pd_sony', 'l_sony_xm5', 'Electronics & Audio', 'Sony', 'WH-1000XM5', true, 'Manufacturer Warranty active'),
    ('pd_keychron', 'l_keychron', 'Keyboards & Peripherals', 'Keychron', 'Q1 Pro', true, '90-Day Factory Warranty'),
    ('pd_ipad', 'l_ipad_air', 'Computers & Tablets', 'Apple', 'iPad Air 11" M2', true, 'AppleCare eligible'),
    ('pd_fuji', 'l_fuji', 'Cameras & Optics', 'Fujifilm', 'X-T30 II', true, 'Full 1-Year US Warranty'),
    ('pd_steam', 'l_steam_deck', 'Video Games & Consoles', 'Valve', 'Steam Deck OLED 512GB', true, 'Valve Factory Warranty')
ON CONFLICT ("id") DO NOTHING;

-- 5. Insert Sample Barter Proposal
INSERT INTO "BarterProposal" ("id", "initiatorId", "recipientId", "targetListingId", "cashTopUp", "status", "exchangeCode", "notes")
VALUES
    ('prop_sample_01', 'u_elena', 'u_alex', 'l_ddia', 10.00, 'PROPOSED', 'TRD-782104', 'Would love to trade for DDIA. Can add $10 cash on top if needed!')
ON CONFLICT ("id") DO NOTHING;
