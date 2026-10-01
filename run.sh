#!/usr/bin/env bash
# ==============================================================================
# BarterHub PostgreSQL JDBC CLI Application Runner (Linux / macOS)
# ==============================================================================

set -e

mkdir -p bin

CLASSPATH="bin:lib/postgresql-42.7.4.jar:lib/*"

echo "======================================================="
echo "    BarterHub - PostgreSQL JDBC Application Runner     "
echo "======================================================="

echo "[1/2] Compiling Java source files..."
find src -name "*.java" > sources.txt
javac -encoding UTF-8 -cp "$CLASSPATH" -d bin @sources.txt
rm sources.txt

echo "      [OK] Compilation successful."

echo "[2/2] Launching BarterHub JDBC CLI..."
echo "-------------------------------------------------------"

java -cp "$CLASSPATH" com.barterhub.jdbc.BarterHubCLI "$@"
