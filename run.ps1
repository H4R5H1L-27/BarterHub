param (
    [switch]$Auto,
    [switch]$Diagnostics,
    [switch]$Help
)

$argsList = @()
if ($Auto) { $argsList += "-Auto" }
if ($Diagnostics) { $argsList += "-Diagnostics" }
if ($Help) { $argsList += "-Help" }

powershell -ExecutionPolicy Bypass -File "jdbc\run.ps1" @argsList
