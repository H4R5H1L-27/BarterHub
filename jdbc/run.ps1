param (
    [switch]$Auto,
    [switch]$Diagnostics,
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$binDir = Join-Path $scriptDir "bin"
if (!(Test-Path -Path $binDir)) { New-Item -ItemType Directory -Path $binDir | Out-Null }

$jarPath = Join-Path $scriptDir "lib\postgresql-42.7.4.jar"
$srcDir = Join-Path $scriptDir "src"
$CLASSPATH = "$binDir;$jarPath"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "    BarterHub - PostgreSQL JDBC Application Runner     " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

$javaSources = Get-ChildItem -Path $srcDir -Filter "*.java" -Recurse | ForEach-Object { $_.FullName }
javac -encoding UTF-8 -cp $CLASSPATH -d $binDir $javaSources

if ($Auto) {
    java -cp $CLASSPATH com.barterhub.jdbc.BarterHubCLI --auto
} elseif ($Diagnostics) {
    java -cp $CLASSPATH com.barterhub.jdbc.BarterHubCLI --diagnostics
} else {
    java -cp $CLASSPATH com.barterhub.jdbc.BarterHubCLI
}
