[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$workdir = (Resolve-Path "dist\DotaModHub-win32-x64").Path
$target = Join-Path $workdir "DotaModHub.exe"
$desktop = [Environment]::GetFolderPath('Desktop')
$lnkPath = Join-Path $desktop "DotaMod Hub.lnk"

$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut($lnkPath)
$sc.TargetPath = $target
$sc.WorkingDirectory = $workdir
$sc.IconLocation = "$target,0"
$sc.Description = "DotaMod Hub v1.5.0 - Скинченджер Dota 2"
$sc.Save()

Write-Host "Shortcut created at: $lnkPath"
Write-Host "Target: $target"
Write-Host "WorkDir: $workdir"
