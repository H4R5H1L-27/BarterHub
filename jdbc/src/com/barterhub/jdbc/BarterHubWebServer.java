package com.barterhub.jdbc;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * High-Performance Embedded Web Server for BarterHub
 * Powered directly by Java SE HttpServer and PostgreSQL JDBC Driver.
 */
public class BarterHubWebServer {

    private static final BarterHubJDBCService service = new BarterHubJDBCService();

    public static void start(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // 1. Static Files & Root Single-Page Application (SPA)
        server.createContext("/", new StaticAndSpaHandler());

        // 2. REST API Endpoints
        server.createContext("/health", exchange -> {
            boolean healthy = false;
            String dbVersion = "Unavailable";
            try (Connection conn = DatabaseConnection.getConnection()) {
                DatabaseMetaData meta = conn.getMetaData();
                dbVersion = meta.getDatabaseProductName() + " " + meta.getDatabaseProductVersion();
                healthy = true;
            } catch (Exception ignored) {}
            String json = "{\"status\":\"" + (healthy ? "HEALTHY" : "DEGRADED") + "\",\"database\":\"" + escapeJson(dbVersion) + "\"}";
            sendJson(exchange, healthy ? 200 : 503, json);
        });

        server.createContext("/api/diagnostics", exchange -> {
            try (Connection conn = DatabaseConnection.getConnection()) {
                DatabaseMetaData meta = conn.getMetaData();
                StringBuilder json = new StringBuilder("{");
                json.append("\"connected\":true,");
                json.append("\"url\":\"").append(escapeJson(meta.getURL())).append("\",");
                json.append("\"user\":\"").append(escapeJson(meta.getUserName())).append("\",");
                json.append("\"driverName\":\"").append(escapeJson(meta.getDriverName())).append("\",");
                json.append("\"driverVersion\":\"").append(escapeJson(meta.getDriverVersion())).append("\",");
                json.append("\"databaseProduct\":\"").append(escapeJson(meta.getDatabaseProductName())).append("\",");
                json.append("\"databaseVersion\":\"").append(escapeJson(meta.getDatabaseProductVersion())).append("\",");
                json.append("\"autoCommit\":").append(conn.getAutoCommit()).append(",");
                json.append("\"transactionIsolation\":\"READ_COMMITTED\"");
                json.append("}");
                sendJson(exchange, 200, json.toString());
            } catch (Exception e) {
                sendJson(exchange, 500, "{\"connected\":false,\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        });

        server.createContext("/api/listings", exchange -> {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
                String q = params.get("q");
                String type = params.get("type");
                String condition = params.get("condition");
                Double maxPrice = null;
                if (params.containsKey("maxPrice")) {
                    try { maxPrice = Double.parseDouble(params.get("maxPrice")); } catch (Exception ignored) {}
                }
                String json = fetchListingsJson(q, type, condition, maxPrice);
                sendJson(exchange, 200, json);
            } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                String body = readBody(exchange);
                String result = handleCreateListing(body);
                sendJson(exchange, 201, result);
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        });

        server.createContext("/api/listing", exchange -> {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String id = params.get("id");
            if (id == null) {
                sendJson(exchange, 400, "{\"error\":\"Missing id parameter\"}");
                return;
            }
            String json = fetchListingDetailJson(id);
            if (json == null) {
                sendJson(exchange, 404, "{\"error\":\"Listing not found\"}");
            } else {
                sendJson(exchange, 200, json);
            }
        });

        server.createContext("/api/users", exchange -> {
            String json = fetchUsersJson();
            sendJson(exchange, 200, json);
        });

        server.createContext("/api/user-listings", exchange -> {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String userId = params.get("userId");
            if (userId == null) {
                sendJson(exchange, 400, "{\"error\":\"Missing userId\"}");
                return;
            }
            String json = fetchUserListingsJson(userId);
            sendJson(exchange, 200, json);
        });

        server.createContext("/api/analytics", exchange -> {
            String json = fetchValuationMetricsJson();
            sendJson(exchange, 200, json);
        });

        server.createContext("/api/barter", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }
            String body = readBody(exchange);
            String responseJson = handleBarterProposal(body);
            sendJson(exchange, 200, responseJson);
        });

        server.createContext("/api/sql", exchange -> {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }
            String sql = readBody(exchange);
            String json = executeSqlStudio(sql);
            sendJson(exchange, 200, json);
        });

        server.setExecutor(null); // default executor
        server.start();
        System.out.println("\n=======================================================");
        System.out.println("  BarterHub Web Application Running via PostgreSQL JDBC");
        System.out.println("=======================================================");
        System.out.println("  * Local Web UI  : http://localhost:" + port + "/");
        System.out.println("  * Database Hub  : http://localhost:" + port + "/#database");
        System.out.println("  * Health Check  : http://localhost:" + port + "/health");
        System.out.println("  * JDBC Driver   : org.postgresql.Driver (42.7.4)");
        System.out.println("=======================================================\n");
    }

    private static String fetchListingsJson(String keyword, String type, String condition, Double maxPrice) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT l.id, l.title, l.description, l.\"listingType\"::text, l.\"exchangeType\"::text, ");
        sql.append("       l.price, l.condition::text, l.status::text, l.city, l.state, l.\"barterWishlist\", ");
        sql.append("       l.images, u.id AS user_id, u.name AS owner_name, u.\"reputationScore\", ");
        sql.append("       bd.author, bd.isbn, pd.brand, pd.model ");
        sql.append("FROM \"Listing\" l ");
        sql.append("JOIN \"User\" u ON l.\"userId\" = u.id ");
        sql.append("LEFT JOIN \"BookDetails\" bd ON l.id = bd.\"listingId\" ");
        sql.append("LEFT JOIN \"ProductDetails\" pd ON l.id = pd.\"listingId\" ");
        sql.append("WHERE l.status = 'ACTIVE' ");

        List<Object> params = new ArrayList<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append("AND (l.title ILIKE ? OR l.description ILIKE ? OR u.name ILIKE ?) ");
            String pat = "%" + keyword.trim() + "%";
            params.add(pat);
            params.add(pat);
            params.add(pat);
        }
        if (type != null && !type.trim().isEmpty() && !"ALL".equalsIgnoreCase(type)) {
            sql.append("AND l.\"listingType\"::text = ? ");
            params.add(type.toUpperCase());
        }
        if (condition != null && !condition.trim().isEmpty() && !"ALL".equalsIgnoreCase(condition)) {
            sql.append("AND l.condition::text = ? ");
            params.add(condition.toUpperCase());
        }
        if (maxPrice != null && maxPrice > 0) {
            sql.append("AND (l.price IS NULL OR l.price <= ?) ");
            params.add(maxPrice);
        }
        sql.append("ORDER BY l.\"createdAt\" DESC LIMIT 100");

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                Object p = params.get(i);
                if (p instanceof String) pstmt.setString(i + 1, (String) p);
                else if (p instanceof Double) pstmt.setDouble(i + 1, (Double) p);
            }
            try (ResultSet rs = pstmt.executeQuery()) {
                StringBuilder sb = new StringBuilder("[");
                boolean first = true;
                while (rs.next()) {
                    if (!first) sb.append(",");
                    first = false;
                    appendListingJson(sb, rs);
                }
                sb.append("]");
                return sb.toString();
            }
        } catch (SQLException e) {
            return "[]";
        }
    }

    private static String fetchListingDetailJson(String id) {
        String sql = "SELECT l.*, u.id AS user_id, u.name AS owner_name, u.email AS owner_email, " +
                "u.\"reputationScore\", u.\"totalTrades\", u.city AS owner_city, " +
                "bd.author, bd.isbn, bd.publisher, bd.\"courseCode\", bd.\"academicSubject\", " +
                "pd.brand, pd.model, pd.category, pd.\"warrantyStatus\" " +
                "FROM \"Listing\" l " +
                "JOIN \"User\" u ON l.\"userId\" = u.id " +
                "LEFT JOIN \"BookDetails\" bd ON l.id = bd.\"listingId\" " +
                "LEFT JOIN \"ProductDetails\" pd ON l.id = pd.\"listingId\" " +
                "WHERE l.id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    StringBuilder sb = new StringBuilder();
                    appendListingJson(sb, rs);
                    return sb.toString();
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private static void appendListingJson(StringBuilder sb, ResultSet rs) throws SQLException {
        String id = rs.getString("id");
        String title = rs.getString("title");
        String desc = rs.getString("description");
        String type = rs.getString("listingType");
        String exType = rs.getString("exchangeType");
        Double price = rs.getObject("price") != null ? rs.getDouble("price") : null;
        String cond = rs.getString("condition");
        String status = rs.getString("status");
        String city = rs.getString("city");
        String wishlist = rs.getString("barterWishlist");
        String userId = rs.getString("user_id");
        String ownerName = rs.getString("owner_name");
        Double rep = rs.getObject("reputationScore") != null ? rs.getDouble("reputationScore") : 5.0;

        // Resolve Image URL
        String imageUrl = resolveImageUrl(id, title, type);

        sb.append("{");
        sb.append("\"id\":\"").append(escapeJson(id)).append("\",");
        sb.append("\"title\":\"").append(escapeJson(title)).append("\",");
        sb.append("\"description\":\"").append(escapeJson(desc != null ? desc : "")).append("\",");
        sb.append("\"listingType\":\"").append(escapeJson(type)).append("\",");
        sb.append("\"exchangeType\":\"").append(escapeJson(exType)).append("\",");
        sb.append("\"price\":").append(price != null ? price : "null").append(",");
        sb.append("\"condition\":\"").append(escapeJson(cond)).append("\",");
        sb.append("\"status\":\"").append(escapeJson(status)).append("\",");
        sb.append("\"city\":\"").append(escapeJson(city)).append("\",");
        sb.append("\"barterWishlist\":\"").append(escapeJson(wishlist != null ? wishlist : "")).append("\",");
        sb.append("\"imageUrl\":\"").append(escapeJson(imageUrl)).append("\",");
        sb.append("\"userId\":\"").append(escapeJson(userId)).append("\",");
        sb.append("\"ownerName\":\"").append(escapeJson(ownerName)).append("\",");
        sb.append("\"reputationScore\":").append(rep);

        try {
            String author = rs.getString("author");
            if (author != null) sb.append(",\"author\":\"").append(escapeJson(author)).append("\"");
            String brand = rs.getString("brand");
            if (brand != null) sb.append(",\"brand\":\"").append(escapeJson(brand)).append("\"");
            String model = rs.getString("model");
            if (model != null) sb.append(",\"model\":\"").append(escapeJson(model)).append("\"");
        } catch (Exception ignored) {}

        sb.append("}");
    }

    private static String resolveImageUrl(String id, String title, String type) {
        String t = title.toLowerCase();
        if (t.contains("data-intensive") || t.contains("ddia")) return "/items/books/ddia.jpg";
        if (t.contains("database system") || t.contains("silberschatz")) return "/items/books/database-system-concepts.jpg";
        if (t.contains("clean code")) return "/items/books/clean-code.jpg";
        if (t.contains("algorithms") || t.contains("clrs")) return "/items/books/clrs-algorithms.jpg";
        if (t.contains("calculus")) return "/items/books/stewart-calculus.jpg";
        if (t.contains("sony") || t.contains("xm5")) return "/items/products/sony-wh1000xm5.jpg";
        if (t.contains("keychron")) return "/items/products/keychron-q1-pro.jpg";
        if (t.contains("ipad")) return "/items/products/ipad-air-m2.jpg";
        if (t.contains("fujifilm") || t.contains("fuji")) return "/items/products/fujifilm-xt30-ii.jpg";
        if (t.contains("steam deck")) return "/items/products/steam-deck-oled.jpg";
        if (t.contains("atomic habits")) return "/items/books/atomic-habits.jpg";
        if (t.contains("biology")) return "/items/books/campbell-biology.jpg";
        if (t.contains("cracking")) return "/items/books/cracking-coding-interview.jpg";
        if (t.contains("dune")) return "/items/books/dune-deluxe.jpg";
        if (t.contains("physics")) return "/items/books/fundamentals-physics.jpg";
        if (t.contains("neuromancer")) return "/items/books/neuromancer.jpg";
        if (t.contains("chemistry")) return "/items/books/organic-chemistry-wade.jpg";
        if (t.contains("pragmatic")) return "/items/books/pragmatic-programmer.jpg";
        if (t.contains("sapiens")) return "/items/books/sapiens.jpg";
        if (t.contains("airpods")) return "/items/products/airpods-pro-2.jpg";
        if (t.contains("powerbank") || t.contains("anker")) return "/items/products/anker-737-powerbank.jpg";
        if (t.contains("catan")) return "/items/products/catan-game.jpg";
        if (t.contains("herman miller")) return "/items/products/herman-miller-chair.jpg";
        if (t.contains("kindle")) return "/items/products/kindle-paperwhite.jpg";
        if (t.contains("mx master")) return "/items/products/logitech-mx-master-3s.jpg";

        return "BOOK".equalsIgnoreCase(type) ? "/items/books/clean-code.jpg" : "/items/products/logitech-mx-master-3s.jpg";
    }

    private static String fetchUsersJson() {
        String sql = "SELECT id, name, email, city, state, \"reputationScore\", \"totalTrades\", \"totalReviews\" " +
                "FROM \"User\" ORDER BY \"reputationScore\" DESC LIMIT 20";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            while (rs.next()) {
                if (!first) sb.append(",");
                first = false;
                sb.append("{");
                sb.append("\"id\":\"").append(escapeJson(rs.getString("id"))).append("\",");
                sb.append("\"name\":\"").append(escapeJson(rs.getString("name"))).append("\",");
                sb.append("\"email\":\"").append(escapeJson(rs.getString("email"))).append("\",");
                sb.append("\"city\":\"").append(escapeJson(rs.getString("city"))).append("\",");
                sb.append("\"state\":\"").append(escapeJson(rs.getString("state"))).append("\",");
                sb.append("\"reputationScore\":").append(rs.getDouble("reputationScore")).append(",");
                sb.append("\"totalTrades\":").append(rs.getInt("totalTrades")).append(",");
                sb.append("\"totalReviews\":").append(rs.getInt("totalReviews"));
                sb.append("}");
            }
            sb.append("]");
            return sb.toString();
        } catch (Exception e) {
            return "[]";
        }
    }

    private static String fetchUserListingsJson(String userId) {
        String sql = "SELECT id, title, price, \"listingType\"::text, condition::text " +
                "FROM \"Listing\" WHERE \"userId\" = ? AND status = 'ACTIVE' ORDER BY \"createdAt\" DESC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                StringBuilder sb = new StringBuilder("[");
                boolean first = true;
                while (rs.next()) {
                    if (!first) sb.append(",");
                    first = false;
                    sb.append("{");
                    sb.append("\"id\":\"").append(escapeJson(rs.getString("id"))).append("\",");
                    sb.append("\"title\":\"").append(escapeJson(rs.getString("title"))).append("\",");
                    sb.append("\"price\":").append(rs.getObject("price") != null ? rs.getDouble("price") : "null").append(",");
                    sb.append("\"listingType\":\"").append(escapeJson(rs.getString("listingType"))).append("\",");
                    sb.append("\"condition\":\"").append(escapeJson(rs.getString("condition"))).append("\"");
                    sb.append("}");
                }
                sb.append("]");
                return sb.toString();
            }
        } catch (Exception e) {
            return "[]";
        }
    }

    private static String fetchValuationMetricsJson() {
        String sql = "SELECT \"listingType\"::text, condition::text, COUNT(*) AS count, " +
                "ROUND(AVG(price)::numeric, 2) AS avg_price, " +
                "MIN(price) AS min_price, MAX(price) AS max_price " +
                "FROM \"Listing\" WHERE price IS NOT NULL " +
                "GROUP BY \"listingType\", condition " +
                "ORDER BY \"listingType\", condition";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            while (rs.next()) {
                if (!first) sb.append(",");
                first = false;
                sb.append("{");
                sb.append("\"listingType\":\"").append(escapeJson(rs.getString("listingType"))).append("\",");
                sb.append("\"condition\":\"").append(escapeJson(rs.getString("condition"))).append("\",");
                sb.append("\"count\":").append(rs.getInt("count")).append(",");
                sb.append("\"avgPrice\":").append(rs.getDouble("avg_price")).append(",");
                sb.append("\"minPrice\":").append(rs.getDouble("min_price")).append(",");
                sb.append("\"maxPrice\":").append(rs.getDouble("max_price"));
                sb.append("}");
            }
            sb.append("]");
            return sb.toString();
        } catch (Exception e) {
            return "[]";
        }
    }

    private static String handleBarterProposal(String jsonBody) {
        try {
            Map<String, String> data = parseSimpleJson(jsonBody);
            String initiatorId = data.get("initiatorId");
            String recipientId = data.get("recipientId");
            String targetListingId = data.get("targetListingId");
            String offeredListingId = data.get("offeredListingId");
            double cashTopUp = 0.0;
            if (data.containsKey("cashTopUp")) {
                try { cashTopUp = Double.parseDouble(data.get("cashTopUp")); } catch (Exception ignored) {}
            }

            String pin = service.executeAtomicBarterExchange(initiatorId, recipientId, targetListingId, offeredListingId, cashTopUp, false);
            return "{\"success\":true,\"message\":\"Barter proposal submitted atomically via JDBC transaction!\",\"handshakePin\":\"" + pin + "\"}";
        } catch (Exception e) {
            return "{\"success\":false,\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
        }
    }

    private static String handleCreateListing(String jsonBody) {
        try {
            Map<String, String> data = parseSimpleJson(jsonBody);
            String userId = data.getOrDefault("userId", "u_alex");
            String title = data.get("title");
            String desc = data.getOrDefault("description", "Offered via BarterHub.");
            String type = data.getOrDefault("listingType", "BOOK");
            String exType = data.getOrDefault("exchangeType", "HYBRID");
            String condition = data.getOrDefault("condition", "LIKE_NEW");
            String city = data.getOrDefault("city", "New York");
            String wishlist = data.getOrDefault("barterWishlist", "Open to relevant trades");
            double price = 0.0;
            if (data.containsKey("price")) {
                try { price = Double.parseDouble(data.get("price")); } catch (Exception ignored) {}
            }

            String id = "l_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
            String sql = "INSERT INTO \"Listing\" (id, \"userId\", title, description, \"listingType\", " +
                    "\"exchangeType\", price, condition, status, city, state, \"barterWishlist\") " +
                    "VALUES (?, ?, ?, ?, ?::\"ListingType\", ?::\"ExchangeType\", ?, ?::\"ItemCondition\", 'ACTIVE', ?, 'NY', ?)";

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, id);
                pstmt.setString(2, userId);
                pstmt.setString(3, title);
                pstmt.setString(4, desc);
                pstmt.setString(5, type);
                pstmt.setString(6, exType);
                pstmt.setDouble(7, price);
                pstmt.setString(8, condition);
                pstmt.setString(9, city);
                pstmt.setString(10, wishlist);
                pstmt.executeUpdate();
            }

            return "{\"success\":true,\"id\":\"" + id + "\"}";
        } catch (Exception e) {
            return "{\"success\":false,\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
        }
    }

    private static String executeSqlStudio(String sql) {
        if (sql == null || sql.trim().isEmpty()) {
            return "{\"error\":\"Empty SQL statement.\"}";
        }
        sql = sql.trim();
        // Disallow dangerous multi-drop operations for safety
        String lower = sql.toLowerCase();
        if (lower.startsWith("drop database") || lower.startsWith("drop user")) {
            return "{\"error\":\"Destructive schema drop operations are disabled in web studio.\"}";
        }

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            if (lower.startsWith("select") || lower.startsWith("show") || lower.startsWith("explain") || lower.startsWith("with")) {
                try (ResultSet rs = stmt.executeQuery(sql)) {
                    ResultSetMetaData md = rs.getMetaData();
                    int cols = md.getColumnCount();
                    StringBuilder sb = new StringBuilder("{\"columns\":[");
                    for (int i = 1; i <= cols; i++) {
                        if (i > 1) sb.append(",");
                        sb.append("\"").append(escapeJson(md.getColumnLabel(i))).append("\"");
                    }
                    sb.append("],\"rows\":[");
                    boolean firstRow = true;
                    int rowCount = 0;
                    while (rs.next() && rowCount < 50) {
                        if (!firstRow) sb.append(",");
                        firstRow = false;
                        sb.append("[");
                        for (int i = 1; i <= cols; i++) {
                            if (i > 1) sb.append(",");
                            Object val = rs.getObject(i);
                            if (val == null) sb.append("null");
                            else sb.append("\"").append(escapeJson(val.toString())).append("\"");
                        }
                        sb.append("]");
                        rowCount++;
                    }
                    sb.append("],\"rowCount\":").append(rowCount).append("}");
                    return sb.toString();
                }
            } else {
                int affected = stmt.executeUpdate(sql);
                return "{\"affectedRows\":" + affected + ",\"message\":\"SQL executed successfully.\"}";
            }
        } catch (Exception e) {
            return "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
        }
    }

    /**
     * Serves static assets and fallback SPA index.html.
     */
    static class StaticAndSpaHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path == null || path.equals("/") || path.equals("/index.html") || path.startsWith("/listing/")) {
                File indexFile = new File("public/index.html");
                if (indexFile.exists()) {
                    serveFile(exchange, indexFile, "text/html; charset=utf-8");
                    return;
                }
            }

            if (path.startsWith("/")) {
                path = path.substring(1);
            }

            File file = new File("public/" + path);
            if (file.exists() && file.isFile()) {
                String mime = getMimeType(file.getName());
                serveFile(exchange, file, mime);
                return;
            }

            // Fallback to index.html for SPA client-side routing
            File indexFile = new File("public/index.html");
            if (indexFile.exists()) {
                serveFile(exchange, indexFile, "text/html; charset=utf-8");
            } else {
                exchange.sendResponseHeaders(404, -1);
            }
        }
    }

    private static void serveFile(HttpExchange exchange, File file, String mimeType) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", mimeType);
        exchange.getResponseHeaders().set("Cache-Control", "public, max-age=3600");
        exchange.sendResponseHeaders(200, file.length());
        try (InputStream in = new FileInputStream(file);
             OutputStream out = exchange.getResponseBody()) {
            byte[] buf = new byte[8192];
            int read;
            while ((read = in.read(buf)) != -1) {
                out.write(buf, 0, read);
            }
        }
    }

    private static String getMimeType(String name) {
        String lower = name.toLowerCase();
        if (lower.endsWith(".html")) return "text/html; charset=utf-8";
        if (lower.endsWith(".css")) return "text/css; charset=utf-8";
        if (lower.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (lower.endsWith(".json")) return "application/json; charset=utf-8";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".ico")) return "image/x-icon";
        return "application/octet-stream";
    }

    private static void sendJson(HttpExchange exchange, int code, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(code, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int n;
            while ((n = is.read(buffer)) != -1) {
                bos.write(buffer, 0, n);
            }
            return bos.toString(StandardCharsets.UTF_8);
        }
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.isEmpty()) return map;
        for (String pair : query.split("&")) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                try {
                    String k = URLDecoder.decode(pair.substring(0, idx), "UTF-8");
                    String v = URLDecoder.decode(pair.substring(idx + 1), "UTF-8");
                    map.put(k, v);
                } catch (Exception ignored) {}
            }
        }
        return map;
    }

    private static Map<String, String> parseSimpleJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null) return map;
        json = json.trim();
        if (json.startsWith("{") && json.endsWith("}")) {
            json = json.substring(1, json.length() - 1);
        }
        String[] parts = json.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        for (String part : parts) {
            String[] kv = part.split(":(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", 2);
            if (kv.length == 2) {
                String k = kv[0].trim().replace("\"", "");
                String v = kv[1].trim();
                if (v.startsWith("\"") && v.endsWith("\"")) {
                    v = v.substring(1, v.length() - 1);
                }
                map.put(k, v);
            }
        }
        return map;
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
