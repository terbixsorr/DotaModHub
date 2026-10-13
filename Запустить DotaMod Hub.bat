@echo off
chcp 65001 >nul
title Запуск DotaMod Hub...
cd /d "%~dp0dist\DotaModHub-win32-x64"
start "" "DotaModHub.exe"
exit
