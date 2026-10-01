package com.barterhub.jdbc;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * PostgreSQL JDBC Connection Manager
 * Connects directly to PostgreSQL using standard JDBC URL, USERNAME, and PASSWORD.
 */
public class DatabaseConnection {

    // =========================================================================
    // POSTGRESQL JDBC CONNECTION PARAMETERS
    // =========================================================================
    public static final String URL = "jdbc:postgresql://localhost:5432/productexchange";
    public static final String USERNAME = "postgres";
    public static final String PASSWORD = "password";

    // Official PostgreSQL Driver Name
    private static final String DRIVER_CLASS = "org.postgresql.Driver";

    static {
        // Step 1: Load and register the PostgreSQL JDBC Driver
        try {
            Class.forName(DRIVER_CLASS);
        } catch (ClassNotFoundException e) {
            System.err.println("❌ ERROR: PostgreSQL JDBC Driver not found on classpath!");
            System.err.println("Ensure postgresql-42.7.4.jar is present in the classpath.");
        }
    }

    /**
     * Step 2: Establish and return a live JDBC Connection using URL, Username, and Password.
     */
    public static Connection getConnection() throws SQLException {
        // Check if environment or .env provides credentials; fallback to constants
        String resolvedUrl = getResolvedUrl();
        String resolvedUser = getResolvedUser();
        String resolvedPass = getResolvedPassword();

        Properties props = new Properties();
        props.setProperty("user", resolvedUser);
        props.setProperty("password", resolvedPass);

        // Enable SSL mode automatically if connecting to cloud database (Neon / AWS)
        if (resolvedUrl.contains("neon.tech") || resolvedUrl.contains("sslmode=require")) {
            props.setProperty("ssl", "true");
            props.setProperty("sslmode", "require");
        }

        return DriverManager.getConnection(resolvedUrl, props);
    }

    private static String getResolvedUrl() {
        String envUrl = System.getenv("JDBC_DATABASE_URL");
        if (envUrl != null && !envUrl.isEmpty()) return envUrl;

        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = readEnvFileProperty("DATABASE_URL");
        }

        if (dbUrl != null && !dbUrl.isEmpty()) {
            // Translate postgresql:// to jdbc:postgresql://
            String clean = dbUrl.trim().replace("\"", "");
            if (clean.startsWith("postgresql://") || clean.startsWith("postgres://")) {
                clean = clean.replace("postgresql://", "jdbc:postgresql://").replace("postgres://", "jdbc:postgresql://");
                // Remove inline credentials from URL string so DriverManager gets clean host/db
                if (clean.contains("@")) {
                    String prefix = "jdbc:postgresql://";
                    String rest = clean.substring(prefix.length());
                    String hostAndDb = rest.substring(rest.indexOf("@") + 1);
                    return prefix + hostAndDb;
                }
                return clean;
            }
        }
        return URL;
    }

    private static String getResolvedUser() {
        String user = System.getenv("JDBC_USER");
        if (user != null && !user.isEmpty()) return user;

        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isEmpty()) dbUrl = readEnvFileProperty("DATABASE_URL");

        if (dbUrl != null && dbUrl.contains("://") && dbUrl.contains("@")) {
            try {
                String clean = dbUrl.trim().replace("\"", "");
                String userInfo = clean.substring(clean.indexOf("://") + 3, clean.indexOf("@"));
                if (userInfo.contains(":")) {
                    return userInfo.split(":")[0];
                }
                return userInfo;
            } catch (Exception ignored) {}
        }
        return USERNAME;
    }

    private static String getResolvedPassword() {
        String pass = System.getenv("JDBC_PASSWORD");
        if (pass != null) return pass;

        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isEmpty()) dbUrl = readEnvFileProperty("DATABASE_URL");

        if (dbUrl != null && dbUrl.contains("://") && dbUrl.contains("@")) {
            try {
                String clean = dbUrl.trim().replace("\"", "");
                String userInfo = clean.substring(clean.indexOf("://") + 3, clean.indexOf("@"));
                if (userInfo.contains(":")) {
                    return userInfo.split(":", 2)[1];
                }
            } catch (Exception ignored) {}
        }
        return PASSWORD;
    }

    private static String readEnvFileProperty(String key) {
        File[] candidatePaths = new File[] { new File(".env"), new File("../.env"), new File("../../.env") };
        for (File f : candidatePaths) {
            if (f.exists() && f.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(f))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.startsWith("#") || line.isEmpty()) continue;
                        if (line.startsWith(key + "=")) {
                            String val = line.substring((key + "=").length()).trim();
                            if (val.startsWith("\"") && val.endsWith("\"")) {
                                val = val.substring(1, val.length() - 1);
                            }
                            return val;
                        }
                    }
                } catch (Exception ignored) {}
            }
        }
        return null;
    }

    /**
     * Inspects and prints PostgreSQL JDBC connection metadata.
     */
    public static void printConnectionDiagnostics() {
        System.out.println("\n=======================================================");
        System.out.println("  JDBC Connection Diagnostic & Metadata Report");
        System.out.println("=======================================================");
        try (Connection conn = getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            System.out.println("[OK] JDBC Connection Status : SUCCESS (Active)");
            System.out.println("  * Configured URL         : " + URL);
            System.out.println("  * Configured Username    : " + USERNAME);
            System.out.println("  * Configured Password    : " + "********");
            System.out.println("  * JDBC Driver Name       : " + meta.getDriverName());
            System.out.println("  * JDBC Driver Version    : " + meta.getDriverVersion());
            System.out.println("  * JDBC Specification     : " + meta.getJDBCMajorVersion() + "." + meta.getJDBCMinorVersion());
            System.out.println("  * Database Product Name  : " + meta.getDatabaseProductName());
            System.out.println("  * Database Server Version: " + meta.getDatabaseProductVersion());
            System.out.println("  * Connected Database URL : " + meta.getURL());
            System.out.println("  * Connected User         : " + meta.getUserName());
            System.out.println("  * Auto-Commit Mode       : " + conn.getAutoCommit());
            System.out.println("=======================================================\n");
        } catch (SQLException e) {
            System.err.println("[ERROR] JDBC Connection Failed: " + e.getMessage());
            System.err.println("SQLState : " + e.getSQLState());
            System.err.println("ErrorCode: " + e.getErrorCode());
        }
    }
}
