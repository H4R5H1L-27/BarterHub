@echo off
REM ==============================================================================
REM BarterHub PostgreSQL JDBC CLI Application Runner (Windows Batch)
REM ==============================================================================

setlocal enabledelayedexpansion

if not exist bin mkdir bin

set CLASSPATH=bin;lib\postgresql-42.7.4.jar;lib\*

echo =======================================================
echo     BarterHub - PostgreSQL JDBC Application Runner
echo =======================================================

echo [1/2] Compiling Java source files...
dir /s /b src\*.java > sources.txt
javac -encoding UTF-8 -cp "%CLASSPATH%" -d bin @sources.txt
del sources.txt

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed.
    exit /b %ERRORLEVEL%
)
echo       [OK] Compilation successful.

echo [2/2] Launching BarterHub JDBC CLI...
echo -------------------------------------------------------

java -cp "%CLASSPATH%" com.barterhub.jdbc.BarterHubCLI %*

endlocal
