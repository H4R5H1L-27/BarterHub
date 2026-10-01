package com.barterhub.jdbc;

import com.barterhub.jdbc.models.ListingSummary;
import com.barterhub.jdbc.models.UserProfile;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Enterprise Data Access Layer implementing standard JDBC APIs (Connection, Statement,
 * PreparedStatement, ResultSet, and manual Transaction Management) against PostgreSQL.
 */
public class BarterHubJDBCService {

    /**
     * Executes a parameterized SELECT query using PreparedStatement and iterates the ResultSet.
     */
    public List<ListingSummary> getActiveListings(String keywordFilter, Double maxPrice, int limit) throws SQLException {
        List<ListingSummary> results = new ArrayList<>();

        StringBuilder sql = new StringBuilder();
        sql.append("SELECT l.id, l.title, l.\"listingType\"::text, l.\"exchangeType\"::text, l.price, ");
        sql.append("       l.condition::text, l.status::text, u.name AS owner_name, l.city ");
        sql.append("FROM \"Listing\" l ");
        sql.append("JOIN \"User\" u ON l.\"userId\" = u.id ");
        sql.append("WHERE l.status = 'ACTIVE' ");

        if (keywordFilter != null && !keywordFilter.trim().isEmpty()) {
            sql.append("  AND (l.title ILIKE ? OR l.description ILIKE ?) ");
        }
        if (maxPrice != null && maxPrice > 0) {
            sql.append("  AND l.price <= ? ");
        }

        sql.append("ORDER BY l.\"createdAt\" DESC ");
        sql.append("LIMIT ?");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {

            int paramIndex = 1;
            if (keywordFilter != null && !keywordFilter.trim().isEmpty()) {
                String pattern = "%" + keywordFilter.trim() + "%";
                pstmt.setString(paramIndex++, pattern);
                pstmt.setString(paramIndex++, pattern);
            }
            if (maxPrice != null && maxPrice > 0) {
                pstmt.setDouble(paramIndex++, maxPrice);
            }
            pstmt.setInt(paramIndex, limit > 0 ? limit : 20);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String id = rs.getString("id");
                    String title = rs.getString("title");
                    String listingType = rs.getString("listingType");
                    String exchangeType = rs.getString("exchangeType");
                    double priceVal = rs.getDouble("price");
                    Double price = rs.wasNull() ? null : priceVal;
                    String condition = rs.getString("condition");
                    String status = rs.getString("status");
                    String ownerName = rs.getString("owner_name");
                    String city = rs.getString("city");

                    results.add(new ListingSummary(id, title, listingType, exchangeType, price, condition, status, ownerName, city));
                }
            }
        }

        return results;
    }

    /**
     * Retrieves trader profile and aggregates active listing count using an SQL JOIN.
     */
    public UserProfile getUserProfileByEmail(String email) throws SQLException {
        String sql = "SELECT u.id, u.name, u.email, u.city, u.state, u.\"reputationScore\", u.\"totalTrades\", "
                   + "       COUNT(l.id) AS active_listings "
                   + "FROM \"User\" u "
                   + "LEFT JOIN \"Listing\" l ON u.id = l.\"userId\" AND l.status = 'ACTIVE' "
                   + "WHERE u.email = ? "
                   + "GROUP BY u.id, u.name, u.email, u.city, u.state, u.\"reputationScore\", u.\"totalTrades\"";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new UserProfile(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("city"),
                        rs.getString("state"),
                        rs.getDouble("reputationScore"),
                        rs.getInt("totalTrades"),
                        rs.getInt("active_listings")
                    );
                }
            }
        }
        return null;
    }

    /**
     * Demonstrates an ACID Multi-Row Transaction with manual commit and rollback:
     * 1. Acquires row-level lock on target item: SELECT ... FOR UPDATE
     * 2. Inserts new BarterProposal record
     * 3. Inserts junction record into BarterItem
     * 4. Updates target listing status to 'PENDING_EXCHANGE'
     * 5. Commits atomically. If any step fails, performs rollback.
     */
    public String executeAtomicBarterExchange(
            String initiatorId,
            String recipientId,
            String targetListingId,
            String offeredListingId,
            double cashTopUp,
            boolean simulateFailure
    ) throws SQLException {

        String proposalId = "prop_jdbc_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String barterItemId = "bitem_jdbc_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String handshakePin = String.format("%06d", (int)(Math.random() * 900000) + 100000);

        String lockSql = "SELECT id, status, title FROM \"Listing\" WHERE id = ? FOR UPDATE";
        String insertProposalSql = "INSERT INTO \"BarterProposal\" "
                                 + "(id, \"initiatorId\", \"recipientId\", \"targetListingId\", \"cashTopUp\", \"exchangeCode\", status, \"updatedAt\") "
                                 + "VALUES (?, ?, ?, ?, ?, ?, 'PROPOSED'::\"BarterStatus\", NOW())";
        String insertItemSql = "INSERT INTO \"BarterItem\" (id, \"proposalId\", \"listingId\") VALUES (?, ?, ?)";
        String updateListingSql = "UPDATE \"Listing\" SET status = 'PENDING_EXCHANGE'::\"ListingStatus\", \"updatedAt\" = NOW() WHERE id = ?";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();

            // STEP 0: Disable Auto-Commit to initiate explicit ACID transaction block
            conn.setAutoCommit(false);
            System.out.println("  [JDBC Transaction] Auto-Commit disabled (BEGIN TRANSACTION)");

            // STEP 1: Row-level lock on target listing
            try (PreparedStatement lockStmt = conn.prepareStatement(lockSql)) {
                lockStmt.setString(1, targetListingId);
                try (ResultSet rs = lockStmt.executeQuery()) {
                    if (!rs.next()) {
                        throw new SQLException("Target listing not found: " + targetListingId);
                    }
                    String currentStatus = rs.getString("status");
                    if (!"ACTIVE".equals(currentStatus)) {
                        throw new SQLException("Cannot barter: Target listing is currently in status: " + currentStatus);
                    }
                    System.out.println("  [JDBC Transaction] Row lock acquired for target: " + rs.getString("title"));
                }
            }

            // STEP 2: Insert into BarterProposal
            try (PreparedStatement propStmt = conn.prepareStatement(insertProposalSql)) {
                propStmt.setString(1, proposalId);
                propStmt.setString(2, initiatorId);
                propStmt.setString(3, recipientId);
                propStmt.setString(4, targetListingId);
                propStmt.setDouble(5, cashTopUp);
                propStmt.setString(6, handshakePin);
                propStmt.executeUpdate();
                System.out.println("  [JDBC Transaction] Inserted BarterProposal record: " + proposalId);
            }

            // Simulated failure scenario for transaction rollback testing
            if (simulateFailure) {
                System.out.println("  [JDBC Transaction] [SIMULATION] Intentionally triggering simulated system crash before commit...");
                throw new SQLException("Simulated network/hardware fault triggered intentionally to test rollback!");
            }

            // STEP 3: Insert junction into BarterItem
            if (offeredListingId != null && !offeredListingId.isEmpty()) {
                try (PreparedStatement itemStmt = conn.prepareStatement(insertItemSql)) {
                    itemStmt.setString(1, barterItemId);
                    itemStmt.setString(2, proposalId);
                    itemStmt.setString(3, offeredListingId);
                    itemStmt.executeUpdate();
                    System.out.println("  [JDBC Transaction] Inserted BarterItem junction record");
                }
            }

            // STEP 4: Update target listing status
            try (PreparedStatement updateStmt = conn.prepareStatement(updateListingSql)) {
                updateStmt.setString(1, targetListingId);
                updateStmt.executeUpdate();
                System.out.println("  [JDBC Transaction] Updated target listing status to PENDING_EXCHANGE");
            }

            // STEP 5: Commit transaction
            conn.commit();
            System.out.println("  [JDBC Transaction] [OK] COMMIT TRANSACTION executed successfully.");
            return proposalId;

        } catch (SQLException ex) {
            if (conn != null) {
                try {
                    System.err.println("  [JDBC Transaction] [ROLLBACK] Initiated rollback due to error: " + ex.getMessage());
                    conn.rollback();
                    System.err.println("  [JDBC Transaction] [OK] ROLLBACK successful. All intermediate modifications revoked.");
                } catch (SQLException rollbackEx) {
                    System.err.println("  [JDBC Transaction] Failed to rollback: " + rollbackEx.getMessage());
                }
            }
            throw ex;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException ignored) {}
            }
        }
    }

    /**
     * Executes aggregate analytics using Statement.
     */
    public void printMarketplaceValuationAnalytics() throws SQLException {
        String sql = "SELECT l.\"listingType\"::text AS type, l.condition::text AS cond, "
                   + "       COUNT(l.id) AS total_items, "
                   + "       ROUND(AVG(COALESCE(l.price, 0))::numeric, 2) AS avg_price, "
                   + "       MIN(l.price) AS min_price, "
                   + "       MAX(l.price) AS max_price "
                   + "FROM \"Listing\" l "
                   + "WHERE l.status = 'ACTIVE' "
                   + "GROUP BY l.\"listingType\", l.condition "
                   + "ORDER BY l.\"listingType\", avg_price DESC";

        System.out.println("\n-----------------------------------------------------------------------------------------");
        System.out.println(String.format("%-12s | %-15s | %-11s | %-12s | %-12s | %-12s",
                "TYPE", "CONDITION", "TOTAL ITEMS", "AVG PRICE", "MIN PRICE", "MAX PRICE"));
        System.out.println("-----------------------------------------------------------------------------------------");

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                String type = rs.getString("type");
                String cond = rs.getString("cond");
                int total = rs.getInt("total_items");
                double avg = rs.getDouble("avg_price");
                double min = rs.getDouble("min_price");
                double max = rs.getDouble("max_price");

                System.out.println(String.format("%-12s | %-15s | %-11d | $%-11.2f | $%-11.2f | $%-11.2f",
                        type, cond, total, avg, min, max));
            }
        }
        System.out.println("-----------------------------------------------------------------------------------------\n");
    }
}
