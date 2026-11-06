@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PATH=%PATH%;C:\Program Files\nodejs
node serve.cjs
pause
