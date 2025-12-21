@echo off
chcp 65001 >nul
echo ========================================
echo    贪吃蛇游戏 - 本地服务器启动
echo ========================================
echo.
echo 正在启动本地服务器...
echo.

start http://localhost:8000
timeout /t 2 /nobreak >nul

echo 游戏已在浏览器中打开！
echo.
echo 如果浏览器没有自动打开，请手动访问：
echo http://localhost:8000
echo.
echo 按 Ctrl+C 可以停止服务器
echo ========================================
echo.

python -m http.server 8000

