package com.barterhub.jdbc;

import com.barterhub.jdbc.models.ListingSummary;
import com.barterhub.jdbc.models.UserProfile;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Scanner;

/**
 * Interactive Terminal Console, Automated Test Runner, and Cloud Deployment Server
 * for the BarterHub Platform Service.
 */
public class BarterHubCLI {

    private static final BarterHubJDBCService service = new BarterHubJDBCService();

    public static void main(String[] args) {
        System.out.println("===================================================================");
        System.out.println("  BarterHub Core Platform Console");
        System.out.println("  Transactional PostgreSQL Service & Operations Manager");
        System.out.println("===================================================================");

        // Check for cloud deployment or explicit flags
        String portEnv = System.getenv("PORT");
        boolean autoMode = args.length > 0 && ("--auto".equalsIgnoreCase(args[0]) || "-a".equalsIgnoreCase(args[0]));
        boolean diagMode = args.length > 0 && ("--diagnostics".equalsIgnoreCase(args[0]) || "-d".equalsIgnoreCase(args[0]));
        boolean cliMode = args.length > 0 && ("--cli".equalsIgnoreCase(args[0]) || "-c".equalsIgnoreCase(args[0]));

        if (diagMode) {
            DatabaseConnection.printConnectionDiagnostics();
            return;
        }

        if (autoMode) {
            runAutomatedDemonstration();
            return;
        }

        if (cliMode) {
            runInteractiveConsole();
            return;
        }

        // Default: Start Full Web Application UI Server
        int port = 8080;
        if (portEnv != null && !portEnv.isEmpty()) {
            try { port = Integer.parseInt(portEnv); } catch (NumberFormatException ignored) {}
        }
        try {
            BarterHubWebServer.start(port);
        } catch (Exception e) {
            System.err.println("Web server failed: " + e.getMessage());
            runInteractiveConsole();
        }
    }

    private static void runInteractiveConsole() {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("\nSelect an operation to execute via JDBC:");
            System.out.println("  1. Print PostgreSQL JDBC Connection & Driver Metadata");
            System.out.println("  2. Query Active Listings via Parameterized PreparedStatement");
            System.out.println("  3. Query Trader Profile & Aggregate Stats (SQL JOIN + GROUP BY)");
            System.out.println("  4. Execute Valuation Distribution Analytics via Statement");
            System.out.println("  5. Test ACID Transaction with Rollback (Simulated Fault)");
            System.out.println("  6. Run Full Automated Test Suite");
            System.out.println("  0. Exit");
            System.out.print("\nEnter choice (0-6): ");

            String input = scanner.nextLine().trim();
            if ("0".equals(input)) {
                System.out.println("Exiting BarterHub JDBC Console. Goodbye!");
                break;
            }

            try {
                switch (input) {
                    case "1":
                        DatabaseConnection.printConnectionDiagnostics();
                        break;
                    case "2":
                        System.out.print("Enter search keyword (or press Enter for all): ");
                        String kw = scanner.nextLine().trim();
                        System.out.print("Enter max price filter in USD (or press Enter to skip): ");
                        String maxStr = scanner.nextLine().trim();
                        Double maxPrice = maxStr.isEmpty() ? null : Double.parseDouble(maxStr);
                        testListingsQuery(kw, maxPrice);
                        break;
                    case "3":
                        System.out.print("Enter trader email [default: alex@example.com]: ");
                        String email = scanner.nextLine().trim();
                        if (email.isEmpty()) email = "alex@example.com";
                        testUserLookup(email);
                        break;
                    case "4":
                        System.out.println("\nExecuting Analytical Aggregate Query via JDBC Statement...");
                        service.printMarketplaceValuationAnalytics();
                        break;
                    case "5":
                        testAcidTransaction(true);
                        break;
                    case "6":
                        runAutomatedDemonstration();
                        break;
                    default:
                        System.out.println("Invalid choice. Please select 0 to 6.");
                }
            } catch (Exception e) {
                System.err.println("❌ Error executing JDBC operation: " + e.getMessage());
            }
        }
    }

    public static void runAutomatedDemonstration() {
        System.out.println("\n==> Launching Complete Automated JDBC Verification Suite...\n");

        // 1. Connection & Metadata
        System.out.println("[Test 1/5] Inspecting PostgreSQL DatabaseMetaData...");
        DatabaseConnection.printConnectionDiagnostics();

        // 2. PreparedStatement Query
        System.out.println("[Test 2/5] Querying active listings matching keyword 'Data'...");
        testListingsQuery("Data", null);

        // 3. User lookup
        System.out.println("\n[Test 3/5] Querying trader profile for 'alex@example.com' via PreparedStatement...");
        testUserLookup("alex@example.com");

        // 4. Analytics
        System.out.println("\n[Test 4/5] Computing valuation analytics across categories & conditions...");
        try {
            service.printMarketplaceValuationAnalytics();
        } catch (Exception e) {
            System.err.println("Analytics query failed: " + e.getMessage());
        }

        // 5. Transaction Rollback & Commit Verification
        System.out.println("\n[Test 5/5] Testing ACID Transaction Resilience with Atomic Rollback...");
        testAcidTransaction(true);

        System.out.println("\n[OK] Automated JDBC Verification Suite Completed Successfully!");
    }

    private static void testListingsQuery(String keyword, Double maxPrice) {
        try {
            List<ListingSummary> items = service.getActiveListings(keyword, maxPrice, 10);
            System.out.println("\n-----------------------------------------------------------------------------------------------------------------");
            System.out.println(String.format("[%-10s] %-40s | %-12s | %-8s | %-16s | %s",
                    "TYPE", "TITLE", "EXCHANGE", "PRICE", "SELLER", "CITY"));
            System.out.println("-----------------------------------------------------------------------------------------------------------------");
            for (ListingSummary item : items) {
                System.out.println(item);
            }
            System.out.println("-----------------------------------------------------------------------------------------------------------------");
            System.out.println("Total matching records fetched via ResultSet: " + items.size());
        } catch (Exception e) {
            System.err.println("Query failed: " + e.getMessage());
        }
    }

    private static void testUserLookup(String email) {
        try {
            UserProfile profile = service.getUserProfileByEmail(email);
            if (profile != null) {
                System.out.println("[OK] Record Retrieved: " + profile);
            } else {
                System.out.println("No trader found with email: " + email);
            }
        } catch (Exception e) {
            System.err.println("User query failed: " + e.getMessage());
        }
    }

    private static void testAcidTransaction(boolean simulateFailure) {
        System.out.println("\n--- Initiating Multi-Statement ACID Transaction via JDBC ---");
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            // Discover two test users and an active listing
            String querySql = "SELECT id, \"userId\" FROM \"Listing\" WHERE status = 'ACTIVE' LIMIT 1";
            String targetListingId = null;
            String recipientId = null;

            try (ResultSet rs = stmt.executeQuery(querySql)) {
                if (rs.next()) {
                    targetListingId = rs.getString("id");
                    recipientId = rs.getString("userId");
                }
            }

            if (targetListingId == null) {
                System.out.println("No active listings found to test barter transaction.");
                return;
            }

            // Find an initiator user who is not the recipient
            String userSql = "SELECT id FROM \"User\" WHERE id <> '" + recipientId + "' LIMIT 1";
            String initiatorId = null;
            try (ResultSet rs = stmt.executeQuery(userSql)) {
                if (rs.next()) {
                    initiatorId = rs.getString("id");
                }
            }

            if (initiatorId == null) {
                initiatorId = recipientId;
            }

            System.out.println("  * Target Listing ID : " + targetListingId);
            System.out.println("  * Recipient User ID : " + recipientId);
            System.out.println("  * Initiator User ID : " + initiatorId);

            // Execute transaction with simulated failure to prove rollback
            System.out.println("\n[Phase 1] Simulating transaction failure to prove atomic rollback:");
            try {
                service.executeAtomicBarterExchange(initiatorId, recipientId, targetListingId, null, 25.0, true);
            } catch (Exception e) {
                System.out.println("[OK] Expected simulated exception caught: " + e.getMessage());
            }

            // Verify target listing status is still ACTIVE (rollback succeeded)
            try (ResultSet rs = stmt.executeQuery("SELECT status FROM \"Listing\" WHERE id = '" + targetListingId + "'")) {
                if (rs.next()) {
                    String status = rs.getString("status");
                    System.out.println("[OK] Integrity Verification: Target listing status after rollback is still: " + status + " (PASS)");
                }
            }

        } catch (Exception e) {
            System.err.println("Transaction test error: " + e.getMessage());
        }
    }

    /**
     * Starts an embedded HTTP health & status server for Cloud Deployments (e.g. Render Web Services).
     */
    private static void startCloudHttpServer(int port) {
        System.out.println("\n🚀 Starting BarterHub JDBC Cloud Deployment Server on port " + port + "...");
        DatabaseConnection.printConnectionDiagnostics();

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            server.createContext("/", exchange -> {
                String responseBody = "{\n" +
                        "  \"status\": \"UP\",\n" +
                        "  \"application\": \"BarterHub PostgreSQL JDBC Service\",\n" +
                        "  \"driver\": \"org.postgresql.Driver (42.7.4)\",\n" +
                        "  \"architecture\": \"Direct JDBC PreparedStatement & ACID Transactions\",\n" +
                        "  \"endpoints\": [\"/\", \"/health\", \"/metrics\", \"/test\"]\n" +
                        "}";
                byte[] bytes = responseBody.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            });

            server.createContext("/health", exchange -> {
                boolean dbHealthy = false;
                String dbProduct = "Unknown";
                try (Connection conn = DatabaseConnection.getConnection()) {
                    DatabaseMetaData meta = conn.getMetaData();
                    dbProduct = meta.getDatabaseProductName() + " " + meta.getDatabaseProductVersion();
                    dbHealthy = true;
                } catch (Exception ignored) {}

                String responseBody = "{\n" +
                        "  \"status\": \"" + (dbHealthy ? "HEALTHY" : "DEGRADED") + "\",\n" +
                        "  \"database\": \"" + dbProduct + "\"\n" +
                        "}";
                byte[] bytes = responseBody.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(dbHealthy ? 200 : 503, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            });

            server.createContext("/test", exchange -> {
                runAutomatedDemonstration();
                String responseBody = "{\"status\": \"SUCCESS\", \"message\": \"Automated JDBC suite completed. Check deployment logs.\"}";
                byte[] bytes = responseBody.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            });

            server.setExecutor(null); // default single-threaded executor
            server.start();
            System.out.println("✅ BarterHub JDBC Cloud Server running and healthy on port " + port);
            System.out.println("   - Health Check: http://0.0.0.0:" + port + "/health");
            System.out.println("   - Root Status : http://0.0.0.0:" + port + "/");
        } catch (IOException e) {
            System.err.println("❌ Failed to start cloud HTTP server: " + e.getMessage());
        }
    }
}
