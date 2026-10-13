@echo off
chcp 65001 >nul
title DotaMod Studio - Авто-Мониторинг и Каталог
echo Запуск DotaMod Studio...
cd /d "%~dp0dist\DotaModStudio-win32-x64"
start "" "DotaModStudio.exe"
exit
