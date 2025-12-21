@echo off
chcp 65001 >nul
echo ========================================
echo    上传贪吃蛇游戏到 GitHub
echo ========================================
echo.

REM 检查是否已配置Git用户信息
git config user.name >nul 2>&1
if errorlevel 1 (
    echo [步骤 1/4] 配置 Git 用户信息
    echo.
    set /p GIT_NAME="请输入你的 GitHub 用户名: "
    set /p GIT_EMAIL="请输入你的 GitHub 邮箱: "
    git config --global user.name "%GIT_NAME%"
    git config --global user.email "%GIT_EMAIL%"
    echo 配置完成！
    echo.
) else (
    echo [步骤 1/4] Git 用户信息已配置
    echo 用户名: 
    git config user.name
    echo 邮箱: 
    git config user.email
    echo.
)

REM 检查是否已提交
git log --oneline >nul 2>&1
if errorlevel 1 (
    echo [步骤 2/4] 提交文件到本地仓库
    git add .
    git commit -m "Initial commit: Two-player Snake Game"
    echo 提交完成！
    echo.
) else (
    echo [步骤 2/4] 文件已提交
    echo.
)

REM 检查是否已配置远程仓库
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [步骤 3/4] 配置远程仓库
    echo.
    echo 请先在 GitHub 上创建新仓库：
    echo 1. 登录 https://github.com
    echo 2. 点击右上角 "+" 号，选择 "New repository"
    echo 3. 输入仓库名称（例如：snake-game）
    echo 4. 选择 Public 或 Private
    echo 5. 不要勾选 "Initialize this repository with a README"
    echo 6. 点击 "Create repository"
    echo.
    set /p REPO_URL="请输入你的 GitHub 仓库地址 (例如: https://github.com/用户名/仓库名.git): "
    git remote add origin "%REPO_URL%"
    echo 远程仓库配置完成！
    echo.
) else (
    echo [步骤 3/4] 远程仓库已配置
    git remote get-url origin
    echo.
)

echo [步骤 4/4] 推送到 GitHub
echo.
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo 推送失败！
    echo.
    echo 可能的原因：
    echo 1. 需要身份验证（使用 Personal Access Token）
    echo 2. 仓库地址不正确
    echo 3. 网络连接问题
    echo.
    echo 如果遇到认证问题：
    echo - GitHub 现在使用 Personal Access Token 而不是密码
    echo - 在 GitHub Settings ^> Developer settings ^> Personal access tokens 创建 token
    echo - 推送时使用 token 作为密码
    echo ========================================
) else (
    echo.
    echo ========================================
    echo 上传成功！
    echo 你的游戏已经上传到 GitHub 了！
    echo ========================================
)

echo.
pause

